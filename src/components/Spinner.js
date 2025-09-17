import React, { Component } from 'react'

export class Spinner extends Component {
    render() {
        return (
            <div className='flex justify-center items-center py-12'>
                <div className="relative">
                    <div className="loading-spinner"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-dark-700"></div>
                </div>
                <span className="ml-3 text-gray-400 font-medium">Loading more news...</span>
            </div>
        )
    }
}

export default Spinner
