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
                    <img src={imageUrl} className="card-img-top" alt="..." style={{ height: '200px', width: '100%' }} />
                    <div className="card-body">
                        <h6>{title}...</h6>
                        <p className="card-text">{description}...</p>
                        <p className="card-text"><small className="text-body-secondary">By {!author ? "Unknown" : author} on {date}</small></p>
                        <a className="btn btn-sm btn-success" href={newsUrl} target='_blank' rel="noreferrer"> Read More... </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsItem
