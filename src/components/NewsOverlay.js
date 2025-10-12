import React, { Component } from 'react';
import { Calendar, User, ExternalLink, X, Share2, Loader, AlertCircle } from 'lucide-react';

export class NewsOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            articleContent: null,
            error: null
        };
    }

    async componentDidMount() {
        if (this.props.newsUrl && this.props.isOpen) {
            await this.fetchArticleContent();
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen && this.props.newsUrl) {
            await this.fetchArticleContent();
        }
    }

    fetchArticleContent = async () => {
        try {
            this.setState({ loading: true, error: null });

            // Use a proxy service to avoid CORS issues
            const proxyUrl = `https://api.allorigins.win/get?url=${this.props.newsUrl}`;

            const response = await fetch(proxyUrl);
            const data = await response.json();

            if (data.contents) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, 'text/html');

                // Extract content using common selectors
                const content = this.extractArticleContent(doc);

                this.setState({
                    articleContent: content,
                    loading: false
                });
            } else {
                throw new Error('Failed to fetch article content');
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            this.setState({
                error: 'Unable to load article content. The website might be blocking access or temporarily unavailable.',
                loading: false
            });
        }
    };

    extractArticleContent = (doc) => {
        // Remove unwanted elements first
        const unwantedSelectors = [
            'script', 'style', 'nav', 'header', 'footer', 'aside',
            '.advertisement', '.ad', '.social-share', '.comments',
            '[class*="ad-"]', '[id*="ad-"]', '.sidebar', '.widget'
        ];

        unwantedSelectors.forEach(selector => {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });

        // Common selectors for article content (in order of preference)
        const contentSelectors = [
            'article',
            '[class*="article-content"]',
            '[class*="article-body"]',
            '[class*="story-body"]',
            '[class*="story-content"]',
            '[class*="post-content"]',
            '[class*="entry-content"]',
            '[class*="main-content"]',
            '.content',
            'main',
            '[role="main"]',
            '.container'
        ];

        let articleText = '';
        let foundContent = false;

        // Try each selector until we find substantial content
        for (const selector of contentSelectors) {
            const elements = doc.querySelectorAll(selector);
            if (elements.length > 0) {
                let tempContent = '';

                elements.forEach(element => {
                    const paragraphs = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
                    paragraphs.forEach(p => {
                        const text = p.textContent.trim();
                        // Only include paragraphs with substantial content
                        if (text.length > 30 && !this.isUnwantedContent(text)) {
                            tempContent += text + '\n\n';
                        }
                    });
                });

                // If we found substantial content, use it
                if (tempContent.length > 200) {
                    articleText = tempContent;
                    foundContent = true;
                    break;
                }
            }
        }

        // Final fallback: extract all meaningful paragraphs
        if (!foundContent) {
            const paragraphs = doc.querySelectorAll('p');
            paragraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text.length > 50 && !this.isUnwantedContent(text)) {
                    articleText += text + '\n\n';
                }
            });
        }

        // Clean up the content
        articleText = articleText
            .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
            .trim();

        return articleText || 'Content could not be extracted from this article. The website might have protection against automated content extraction.';
    };

    isUnwantedContent = (text) => {
        const unwantedPatterns = [
            /cookie/i,
            /subscribe/i,
            /advertisement/i,
            /share this/i,
            /follow us/i,
            /social media/i,
            /terms of service/i,
            /privacy policy/i,
            /click here/i
        ];

        return unwantedPatterns.some(pattern => pattern.test(text)) || text.length < 20;
    };

    handleShare = async () => {
        const shareData = {
            title: this.props.title,
            text: this.props.description,
            url: this.props.newsUrl,
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(this.props.newsUrl);
                this.showToast('Article URL copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // Final fallback
            this.showToast('Unable to share. Please copy the URL manually.');
        }
    };

    showToast = (message) => {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 3000);
    };

    handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            this.props.onClose();
        }
    };

    render() {
        const { isOpen, onClose, title, description, imageUrl, author, date, source, categoryColor } = this.props;
        const { loading, articleContent, error } = this.state;

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity"
                    onClick={this.handleBackdropClick}
                ></div>

                {/* Modal */}
                <div className="relative min-h-screen flex items-center justify-center p-4">
                    <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 pr-4">
                                    <div className={`inline-block bg-gradient-to-r ${categoryColor || 'from-blue-400 to-purple-500'} text-white text-sm font-semibold px-3 py-1 rounded-full mb-3`}>
                                        {source}
                                    </div>
                                    <h1 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                                        {title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                        <div className="flex items-center space-x-1">
                                            <User className="w-4 h-4" />
                                            <span>{author || "Unknown Author"}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={this.handleShare}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Share article"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Close overlay"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                            {/* Image */}
                            {imageUrl && (
                                <div className="px-6 pt-4">
                                    <img
                                        src={imageUrl}
                                        alt={title}
                                        className="w-full h-48 md:h-64 object-cover rounded-xl"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            {/* Description */}
                            {description && (
                                <div className="px-6 pt-4">
                                    <p className="text-slate-300 text-lg leading-relaxed italic border-l-4 border-blue-500 pl-4 bg-slate-700/30 p-4 rounded-r-lg">
                                        {description}
                                    </p>
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="px-6 py-6">
                                {loading && (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader className="w-8 h-8 animate-spin text-blue-400 mb-4" />
                                        <span className="text-slate-400">Loading article content...</span>
                                        <span className="text-slate-500 text-sm mt-2">This may take a few moments</span>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
                                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                        <h3 className="text-red-400 font-semibold mb-2">Content Unavailable</h3>
                                        <p className="text-red-300 mb-6 leading-relaxed">{error}</p>
                                        <a
                                            href={this.props.newsUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`inline-flex items-center space-x-2 bg-gradient-to-r ${categoryColor || 'from-blue-400 to-purple-500'} hover:shadow-lg text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105`}
                                        >
                                            <span>Read on Original Site</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}

                                {articleContent && !loading && !error && (
                                    <div className="prose prose-slate prose-invert max-w-none">
                                        <div className="space-y-4">
                                            {articleContent.split('\n\n').map((paragraph, index) => {
                                                if (!paragraph.trim()) return null;

                                                return (
                                                    <p key={index} className="text-slate-300 leading-relaxed text-base">
                                                        {paragraph}
                                                    </p>
                                                );
                                            })}
                                        </div>

                                        {/* Original article link */}
                                        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                                            <p className="text-slate-400 text-sm mb-4">
                                                Want to see the original formatting or continue reading?
                                            </p>
                                            <a
                                                href={this.props.newsUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`inline-flex items-center space-x-2 bg-gradient-to-r ${categoryColor || 'from-blue-400 to-purple-500'} hover:shadow-lg text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105`}
                                            >
                                                <span>View Original Article</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewsOverlay;