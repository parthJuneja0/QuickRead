import React, { useState } from 'react';
import { Menu, X, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { path: '/business', label: 'Business' },
        { path: '/entertainment', label: 'Entertainment' },
        { path: '/health', label: 'Health' },
        { path: '/science', label: 'Science' },
        { path: '/sports', label: 'Sports' },
        { path: '/technology', label: 'Technology' }
    ];

    return (
        <nav className="bg-slate-800 shadow-2xl border-b border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <a
                        href="/"
                        className="flex items-center space-x-3 text-2xl font-bold text-white hover:text-blue-300 transition-colors duration-300 no-underline"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="p-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <Newspaper className="w-6 h-6 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            QuickRead
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="relative px-4 py-2 text-white font-medium hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300 group no-underline"
                                style={{ textDecoration: 'none' }}
                            >
                                {link.label}
                                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800 border-t border-slate-700">
                    {navLinks.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            className="block px-4 py-3 text-slate-300 font-medium hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 no-underline"
                            style={{ textDecoration: 'none' }}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;