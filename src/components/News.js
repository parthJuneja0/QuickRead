import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TrendingUp, Calendar, Globe } from 'lucide-react';

export class News extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            loading: false,
            totalResults: 0,
            actualAvailableArticles: 0, // Track actual loadable articles
            page: 1,
            hasMore: true
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

        // Start with loading all pages to get accurate count
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
                    // Filter valid articles and check for duplicates
                    const validNewArticles = parsedData.articles.filter(article =>
                        article && article.title && article.url &&
                        !allValidArticles.some(existing => existing.url === article.url)
                    );

                    allValidArticles = [...allValidArticles, ...validNewArticles];

                    // Check if we should continue loading
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

        // Now we know exactly how many valid articles are available
        this.setState({
            articles: allValidArticles.slice(0, this.props.pageSize), // Show first page initially
            actualAvailableArticles: allValidArticles.length,
            totalResults: allValidArticles.length, // Set this to actual available count
            loading: false,
            hasMore: allValidArticles.length > this.props.pageSize,
            page: 1
        });

        // Store all articles for pagination
        this.allValidArticles = allValidArticles;

        console.log(`Loaded all available articles: ${allValidArticles.length} valid articles found`);
    }

    fetchMoreData = async () => {
        // Prevent multiple simultaneous requests
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
            <div className="min-h-screen bg-slate-900">
                {/* Hero Section */}
                <div className="bg-slate-800 shadow-xl border-b border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        <div className="text-center">
                            {/* Category Icon */}
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${categoryColor} text-white shadow-2xl mb-4`}>
                                {this.getCategoryIcon(this.props.category)}
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className={`bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent`}>
                                    {categoryTitle}
                                </span>
                                <span className="text-slate-200"> News</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Stay updated with the latest {categoryTitle.toLowerCase()} news from around the world
                            </p>

                            {/* Stats */}
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
                                // Skip rendering articles with missing essential data
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
                                <h3 className="text-xl font-medium text-slate-200 mb-2">No articles found</h3>
                                <p className="text-slate-400">
                                    We couldn't find any articles in the {categoryTitle.toLowerCase()} category right now.
                                </p>
                            </div>
                        )}
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}

export default News