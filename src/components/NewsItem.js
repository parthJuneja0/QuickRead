import React, { Component } from 'react'

export class NewsItem extends Component {
    formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }

    render() {
        let { title, description, imageUrl, newsUrl, author, date, source } = this.props;

        return (
            <article className="news-card animate-fade-in group">
                <div className="relative overflow-hidden">
                    <img 
                        src={imageUrl || "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400"} 
                        className="news-card-image" 
                        alt={title || "News image"}
                        loading="lazy"
                    />
                    <div className="news-badge">
                        {source}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                        {title ? (title.length > 80 ? title.slice(0, 80) + "..." : title) : "No title available"}
                    </h2>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {description ? (description.length > 120 ? description.slice(0, 120) + "..." : description) : "No description available"}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-xs">
                                    {author ? author.charAt(0).toUpperCase() : 'A'}
                                </span>
                            </div>
                            <span>{!author ? "Unknown Author" : author}</span>
                        </div>
                        <time className="text-xs text-gray-500">
                            {this.formatDate(date)}
                        </time>
                    </div>
                    
                    <a 
                        href={newsUrl} 
                        target='_blank' 
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                        <span>Read More</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </article>
        )
    }
}

export default NewsItem
