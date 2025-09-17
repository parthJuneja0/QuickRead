import React, { Component } from 'react'

export class NewsItem extends Component {

    render() {

        let { title, description, imageUrl, newsUrl, author, date, source } = this.props;

        return (
            <div>
                <div className="card my-3" >
                    <div>
                        <span className="badge rounded-pill bg-danger" style={{ zIndex: 1, display: "flex", justifyContent: "flex-end", position: "absolute", right: -3 }} >{source}</span>
                    </div>
                    <img src={imageUrl || "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400"} className="card-img-top" alt="..." style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                    <div className="card-body">
                        <h6>{title ? (title.length > 50 ? title.slice(0, 50) + "..." : title) : "No title available"}</h6>
                        <p className="card-text">{description ? (description.length > 100 ? description.slice(0, 100) + "..." : description) : "No description available"}</p>
                        <p className="card-text"><small className="text-body-secondary">By {!author ? "Unknown" : author} on {new Date(date).toLocaleDateString()}</small></p>
                        <a className="btn btn-sm btn-success" href={newsUrl} target='_blank' rel="noreferrer"> Read More... </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsItem
