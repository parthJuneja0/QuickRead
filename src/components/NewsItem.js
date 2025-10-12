import React, { Component } from 'react'
import { Calendar, User, ExternalLink } from 'lucide-react'

export class NewsItem extends Component {
    formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    handleReadMore = (e) => {
        e.preventDefault();
        // Call the onReadMore function passed from News.js
        if (this.props.onReadMore) {
            this.props.onReadMore();
        }
    }

    render() {
        let { title, description, imageUrl, newsUrl, author, date, source, categoryColor } = this.props;

        return (
            <div className="relative bg-slate-800 rounded-2xl shadow-2xl overflow-hidden hover:shadow-slate-700/20 transition-all duration-300 border border-slate-700 group h-full flex flex-col">
                {/* Source badge */}
                <div className={`absolute top-3 right-3 bg-gradient-to-r ${categoryColor || 'from-blue-400 to-purple-500'} text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-lg`}>
                    {source}
                </div>

                {/* News image */}
                <div className="relative overflow-hidden">
                    <img
                        src={imageUrl ? imageUrl : "https://placehold.co/400x240/334155/94a3b8?text=No+Image"}
                        alt={title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1 mb-4">
                        <h6 className="text-lg font-bold mb-3 text-white line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors duration-200">
                            {title?.slice(0, 80)}{title?.length > 80 ? '...' : ''}
                        </h6>
                        <p className="text-sm text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                            {description?.slice(0, 120)}{description?.length > 120 ? '...' : ''}
                        </p>
                    </div>

                    {/* Author and date */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4 border-t border-slate-700 pt-3">
                        <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{author ? author.slice(0, 20) : "Unknown"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{this.formatDate(date)}</span>
                        </div>
                    </div>

                    {/* Read more button - triggers overlay */}
                    <button
                        onClick={this.handleReadMore}
                        className={`inline-flex items-center justify-center space-x-2 bg-gradient-to-r ${categoryColor || 'from-blue-400 to-purple-500'} hover:shadow-lg text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 w-full`}
                    >
                        <span>Read Full Article</span>
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )
    }
}

export default NewsItem