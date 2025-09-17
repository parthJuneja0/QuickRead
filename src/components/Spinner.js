import React, { Component } from 'react'

export class Spinner extends Component {
    render() {
        return (
            <div className="flex justify-center items-center my-8">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        )
    }
}

export default Spinner
