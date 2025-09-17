import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCategory: 'general'
        };
    }

    componentDidMount() {
        // Set active category based on current path
        const path = window.location.pathname;
        const category = path === '/' ? 'general' : path.substring(1);
        this.setState({ activeCategory: category });
    }

    handleCategoryClick = (category) => {
        this.setState({ activeCategory: category });
    }

    render() {
        const { activeCategory } = this.state;
        
        const categories = [
            { name: 'General', path: '/', key: 'general' },
            { name: 'Business', path: '/business', key: 'business' },
            { name: 'Entertainment', path: '/entertainment', key: 'entertainment' },
            { name: 'Health', path: '/health', key: 'health' },
            { name: 'Science', path: '/science', key: 'science' },
            { name: 'Sports', path: '/sports', key: 'sports' },
            { name: 'Technology', path: '/technology', key: 'technology' }
        ];

        return (
            <nav className="sticky top-0 z-50 glass-effect border-b border-dark-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">Q</span>
                            </div>
                            <h1 className="text-xl font-bold text-gradient">QuickRead</h1>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-1">
                            {categories.map((category) => (
                                <Link
                                    key={category.key}
                                    to={category.path}
                                    onClick={() => this.handleCategoryClick(category.key)}
                                    className={`nav-link ${activeCategory === category.key ? 'active' : ''}`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button className="text-gray-300 hover:text-white p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden pb-4">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Link
                                    key={category.key}
                                    to={category.path}
                                    onClick={() => this.handleCategoryClick(category.key)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                                        activeCategory === category.key 
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                            : 'bg-dark-800 text-gray-300 hover:text-white hover:bg-dark-700'
                                    }`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navbar
