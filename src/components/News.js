import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import NewsOverlay from './NewsOverlay';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TrendingUp, Calendar, Globe } from 'lucide-react';

export class News extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            loading: false,
            totalResults: 0,
            actualAvailableArticles: 0,
            page: 1,
            hasMore: true,
            // Overlay state
            showOverlay: false,
            selectedArticle: null,
            overlayLoading: false,
            scrapedContent: null,
            overlayError: null
        }

        let category = this.props.category[0].toUpperCase() + this.props.category.slice(1);
        document.title = `${category} - QuickRead`;
    }

    async componentDidMount() {
        this.newsUpdate();
    }

    handlePrev = async () => {
        await this.setState({ page: this.state.page - 1 })
        this.newsUpdate();
    }

    handleNext = async () => {
        await this.setState({ page: this.state.page + 1 })
        this.newsUpdate();
    }

    newsUpdate = async () => {
        this.props.setProgress(20);
        this.setState({ loading: true })
        await this.loadAllArticles();
        this.props.setProgress(100);
    }

    loadAllArticles = async () => {
        let allValidArticles = [];
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.REACT_APP_API_KEY}&page=${currentPage}&pageSize=${this.props.pageSize}`;

            try {
                let data = await fetch(url);
                let parsedData = await data.json();

                if (parsedData.articles && parsedData.articles.length > 0) {
                    const validNewArticles = parsedData.articles.filter(article =>
                        article && article.title && article.url &&
                        !allValidArticles.some(existing => existing.url === article.url)
                    );

                    allValidArticles = [...allValidArticles, ...validNewArticles];
                    hasMorePages = parsedData.articles.length === this.props.pageSize && validNewArticles.length > 0;
                    currentPage++;

                    console.log(`Page ${currentPage - 1}: ${validNewArticles.length} valid articles. Total so far: ${allValidArticles.length}`);
                } else {
                    hasMorePages = false;
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
                hasMorePages = false;
            }
        }

        this.setState({
            articles: allValidArticles.slice(0, this.props.pageSize),
            actualAvailableArticles: allValidArticles.length,
            totalResults: allValidArticles.length,
            loading: false,
            hasMore: allValidArticles.length > this.props.pageSize,
            page: 1
        });

        this.allValidArticles = allValidArticles;
        console.log(`Loaded all available articles: ${allValidArticles.length} valid articles found`);
    }

    fetchMoreData = async () => {
        if (this.state.loading || !this.allValidArticles) return;

        const currentLength = this.state.articles.length;
        const pageSize = this.props.pageSize;
        const nextBatch = this.allValidArticles.slice(currentLength, currentLength + pageSize);

        if (nextBatch.length > 0) {
            this.setState(prevState => ({
                articles: [...prevState.articles, ...nextBatch],
                hasMore: currentLength + nextBatch.length < this.allValidArticles.length
            }));

            console.log(`Loaded ${nextBatch.length} more articles. Total showing: ${currentLength + nextBatch.length} of ${this.allValidArticles.length}`);
        } else {
            this.setState({ hasMore: false });
        }
    }

    // Overlay Management Functions
    openArticleOverlay = async (article) => {
        this.setState({
            showOverlay: true,
            selectedArticle: article,
            overlayLoading: true,
            scrapedContent: null,
            overlayError: null
        });

        // Start scraping the article content
        await this.scrapeArticleContent(article.url);
    }

    closeArticleOverlay = () => {
        this.setState({
            showOverlay: false,
            selectedArticle: null,
            overlayLoading: false,
            scrapedContent: null,
            overlayError: null
        });
    }

    scrapeArticleContent = async (url) => {
        try {
            console.log('Starting to scrape article:', url);

            // Try multiple proxy services for better reliability
            const proxyServices = [
                `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                `https://cors-anywhere.herokuapp.com/${url}`,
                `https://corsproxy.io/?${encodeURIComponent(url)}`
            ];

            let scrapedData = null;
            let lastError = null;

            // Try each proxy service
            for (const proxyUrl of proxyServices) {
                try {
                    console.log('Trying proxy:', proxyUrl);

                    const response = await fetch(proxyUrl, {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    const data = await response.json();

                    if (data.contents || data.body) {
                        const htmlContent = data.contents || data.body;
                        scrapedData = this.extractArticleContent(htmlContent, url);
                        if (scrapedData && scrapedData.content && scrapedData.content.length > 100) {
                            console.log('Successfully scraped content, length:', scrapedData.content.length);
                            break;
                        }
                    }
                } catch (error) {
                    console.error(`Proxy ${proxyUrl} failed:`, error);
                    lastError = error;
                    continue;
                }
            }

            if (scrapedData && scrapedData.content) {
                this.setState({
                    scrapedContent: scrapedData,
                    overlayLoading: false,
                    overlayError: null
                });
            } else {
                throw lastError || new Error('All proxy services failed to fetch content');
            }

        } catch (error) {
            console.error('Error scraping article:', error);
            this.setState({
                overlayLoading: false,
                overlayError: `Failed to load article content: ${error.message}. This website may be blocking automated access.`
            });
        }
    }

    extractArticleContent = (htmlString, originalUrl) => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            // Remove unwanted elements
            this.removeUnwantedElements(doc);

            // Extract structured content
            const extractedData = {
                title: this.extractTitle(doc),
                content: this.extractMainContent(doc),
                publishDate: this.extractPublishDate(doc),
                author: this.extractAuthor(doc),
                images: this.extractImages(doc, originalUrl),
                tags: this.extractTags(doc)
            };

            console.log('Extracted article data:', {
                titleLength: extractedData.title?.length || 0,
                contentLength: extractedData.content?.length || 0,
                imageCount: extractedData.images?.length || 0
            });

            return extractedData;
        } catch (error) {
            console.error('Error parsing HTML:', error);
            return null;
        }
    }

    removeUnwantedElements = (doc) => {
        const unwantedSelectors = [
            'script', 'style', 'nav', 'header', 'footer', 'aside',
            '.advertisement', '.ad', '.ads', '.social-share', '.comments',
            '.sidebar', '.widget', '.popup', '.modal', '.overlay',
            '[class*="ad-"]', '[id*="ad-"]', '[class*="advertisement"]',
            '.cookie-notice', '.newsletter-signup', '.related-articles',
            '.social-media', '.share-buttons', 'iframe[src*="ads"]'
        ];

        unwantedSelectors.forEach(selector => {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    }

    extractTitle = (doc) => {
        const titleSelectors = [
            'h1',
            '.article-title',
            '.post-title',
            '.entry-title',
            'title'
        ];

        for (const selector of titleSelectors) {
            const element = doc.querySelector(selector);
            if (element && element.textContent.trim().length > 10) {
                return element.textContent.trim();
            }
        }
        return null;
    }

    extractMainContent = (doc) => {
        // Priority selectors for article content
        const contentSelectors = [
            'article',
            '.article-content',
            '.article-body',
            '.post-content',
            '.entry-content',
            '.story-body',
            '.main-content',
            '.content-body',
            '[class*="article-text"]',
            '[class*="story-text"]'
        ];

        let bestContent = '';
        let maxLength = 0;

        // Try each selector and pick the one with most content
        for (const selector of contentSelectors) {
            const elements = doc.querySelectorAll(selector);

            elements.forEach(element => {
                const content = this.extractTextFromElement(element);
                if (content.length > maxLength && content.length > 200) {
                    bestContent = content;
                    maxLength = content.length;
                }
            });
        }

        // Fallback: extract from main tag or body
        if (!bestContent || bestContent.length < 200) {
            const fallbackSelectors = ['main', '.container', 'body'];

            for (const selector of fallbackSelectors) {
                const element = doc.querySelector(selector);
                if (element) {
                    const content = this.extractTextFromElement(element);
                    if (content.length > bestContent.length) {
                        bestContent = content;
                    }
                }
            }
        }

        return bestContent || 'Unable to extract article content from this website.';
    }

    extractTextFromElement = (element) => {
        if (!element) return '';

        const paragraphs = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote');
        let content = '';

        paragraphs.forEach(p => {
            const text = p.textContent.trim();
            if (text.length > 20 && !this.isUnwantedText(text)) {
                // Detect if this might be a heading
                if (p.tagName.match(/^H[1-6]$/)) {
                    content += '\n\n## ' + text + '\n\n';
                } else if (p.tagName === 'BLOCKQUOTE') {
                    content += '\n\n> ' + text + '\n\n';
                } else {
                    content += text + '\n\n';
                }
            }
        });

        return content.trim();
    }

    isUnwantedText = (text) => {
        const unwantedPatterns = [
            /cookie/i, /subscribe/i, /advertisement/i, /share this/i,
            /follow us/i, /social media/i, /terms of service/i,
            /privacy policy/i, /click here/i, /read more/i,
            /continue reading/i, /sign up/i, /newsletter/i,
            /related articles/i, /you may also like/i
        ];

        return unwantedPatterns.some(pattern => pattern.test(text)) ||
            text.length < 20 ||
            /^[^a-zA-Z]*$/.test(text);
    }

    extractPublishDate = (doc) => {
        const dateSelectors = [
            '[datetime]',
            '.publish-date',
            '.post-date',
            '[class*="date"]',
            'time'
        ];

        for (const selector of dateSelectors) {
            const element = doc.querySelector(selector);
            if (element) {
                const dateText = element.getAttribute('datetime') || element.textContent;
                const date = new Date(dateText);
                if (!isNaN(date.getTime())) {
                    return date.toISOString();
                }
            }
        }
        return null;
    }

    extractAuthor = (doc) => {
        const authorSelectors = [
            '.author',
            '.by-author',
            '[class*="author"]',
            '[rel="author"]'
        ];

        for (const selector of authorSelectors) {
            const element = doc.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim().replace(/^by\s+/i, '');
            }
        }
        return null;
    }

    extractImages = (doc, baseUrl) => {
        const images = [];
        const imgElements = doc.querySelectorAll('img');

        imgElements.forEach(img => {
            const src = img.getAttribute('src') || img.getAttribute('data-src');
            if (src && !src.includes('data:image') && !src.includes('placeholder')) {
                let fullUrl = src;
                if (src.startsWith('/')) {
                    const url = new URL(baseUrl);
                    fullUrl = url.origin + src;
                } else if (!src.startsWith('http')) {
                    const url = new URL(baseUrl);
                    fullUrl = url.origin + '/' + src;
                }

                images.push({
                    src: fullUrl,
                    alt: img.getAttribute('alt') || '',
                    caption: img.getAttribute('title') || ''
                });
            }
        });

        return images.slice(0, 10); // Limit to 10 images
    }

    extractTags = (doc) => {
        const tags = [];
        const tagSelectors = [
            '.tags a',
            '.categories a',
            '[class*="tag"] a',
            '.keywords'
        ];

        tagSelectors.forEach(selector => {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(el => {
                const tag = el.textContent.trim();
                if (tag && tag.length < 50 && !tags.includes(tag)) {
                    tags.push(tag);
                }
            });
        });

        return tags.slice(0, 10); // Limit to 10 tags
    }

    getCategoryIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'business':
                return <TrendingUp className="w-6 h-6" />;
            case 'general':
                return <Globe className="w-6 h-6" />;
            default:
                return <Calendar className="w-6 h-6" />;
        }
    }

    getCategoryColor = (category) => {
        const colors = {
            business: 'from-emerald-400 to-green-500',
            entertainment: 'from-pink-400 to-rose-500',
            health: 'from-red-400 to-orange-500',
            science: 'from-purple-400 to-indigo-500',
            sports: 'from-orange-400 to-yellow-500',
            technology: 'from-blue-400 to-cyan-500',
            general: 'from-slate-400 to-gray-500'
        };
        return colors[category.toLowerCase()] || 'from-blue-400 to-purple-500';
    }

    render() {
        const categoryTitle = this.props.category[0].toUpperCase() + this.props.category.slice(1);
        const categoryColor = this.getCategoryColor(this.props.category);

        return (
            <div className="min-h-screen bg-slate-900 relative">
                {/* Hero Section */}
                <div className="bg-slate-800 shadow-xl border-b border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        <div className="text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${categoryColor} text-white shadow-2xl mb-4`}>
                                {this.getCategoryIcon(this.props.category)}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className={`bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent`}>
                                    {categoryTitle}
                                </span>
                                <span className="text-slate-200"> News</span>
                            </h1>

                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Stay updated with the latest {categoryTitle.toLowerCase()} news from around the world
                            </p>

                            <div className="flex justify-center items-center space-x-6 mt-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-100">
                                        {this.state.actualAvailableArticles.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-slate-400">Available Articles</div>
                                </div>
                                <div className="w-px h-8 bg-slate-600"></div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-100">
                                        {this.state.articles.length}
                                    </div>
                                    <div className="text-sm text-slate-400">Loaded</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Initial Loading State */}
                {this.state.loading && this.state.articles.length === 0 && (
                    <div className="py-12">
                        <Spinner />
                    </div>
                )}

                {/* News Grid */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <InfiniteScroll
                        dataLength={this.state.articles?.length || 0}
                        next={this.fetchMoreData}
                        hasMore={this.state.hasMore}
                        loader={
                            <div className="py-8">
                                <Spinner />
                            </div>
                        }
                        endMessage={
                            <div className="text-center py-8">
                                <div className="inline-flex items-center px-6 py-3 bg-slate-800 rounded-full shadow-lg border border-slate-700">
                                    <span className="text-slate-300">
                                        🎉 All {this.state.articles.length} articles loaded!
                                    </span>
                                </div>
                            </div>
                        }
                        scrollThreshold={0.7}
                        style={{ overflow: 'visible' }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {this.state.articles?.map((element, index) => {
                                if (!element || !element.title || !element.url) return null;

                                return (
                                    <div
                                        key={element.url}
                                        className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                                        style={{
                                            animationDelay: `${index * 50}ms`
                                        }}
                                    >
                                        <NewsItem
                                            title={element.title}
                                            description={element.description}
                                            imageUrl={element.urlToImage}
                                            newsUrl={element.url}
                                            author={element.author}
                                            date={element.publishedAt}
                                            source={element.source?.name}
                                            categoryColor={categoryColor}
                                            onReadMore={() => this.openArticleOverlay(element)}
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        {/* Empty State */}
                        {!this.state.loading && this.state.articles?.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                                    <Globe className="w-12 h-12 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-medium text-white mb-2">No articles found</h3>
                                <p className="text-slate-400">
                                    We couldn't find any articles in the {categoryTitle.toLowerCase()} category right now.
                                </p>
                            </div>
                        )}
                    </InfiniteScroll>
                </div>

                {/* News Overlay */}
                <NewsOverlay
                    isOpen={this.state.showOverlay}
                    onClose={this.closeArticleOverlay}
                    article={this.state.selectedArticle}
                    scrapedContent={this.state.scrapedContent}
                    loading={this.state.overlayLoading}
                    error={this.state.overlayError}
                    categoryColor={categoryColor}
                />
            </div>
        )
    }
}

export default News