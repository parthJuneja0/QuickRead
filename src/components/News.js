import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            loading: false,
            totalResults: 0,
            page: 1
        }

        let category = this.props.category[0].toUpperCase() + this.props.category.slice(1);
        document.title = `${category} - QuickRead`;
    }

    async componentDidMount() {
        this.newsUpdate();
    }

    handlePrev = async () => {
        await this.setState({ page: this.state.page - 1, })
        this.newsUpdate();
    }

    handleNext = async () => {
        await this.setState({ page: this.state.page + 1 })
        this.newsUpdate();
    }

    newsUpdate = async () => {
        this.props.setProgress(20);
        this.setState({ loading: true })
        try {
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.REACT_APP_API_KEY}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
            let data = await fetch(url);
            let parsedData = await data.json()
            this.props.setProgress(50);
            console.log(parsedData);
            
            if (parsedData.status === 'error') {
                console.error('NewsAPI Error:', parsedData.message);
                // Use mock data if API fails
                this.setState({
                    articles: this.getMockArticles(),
                    totalResults: 20,
                    loading: false
                });
            } else {
                this.setState({
                    articles: parsedData.articles || [],
                    totalResults: parsedData.totalResults || 0,
                    loading: false
                });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // Use mock data if fetch fails
            this.setState({
                articles: this.getMockArticles(),
                totalResults: 20,
                loading: false
            });
        }
        this.props.setProgress(100);
    }

    getMockArticles = () => {
        return [
            {
                title: "Sample News Article 1",
                description: "This is a sample news article description to demonstrate the app functionality",
                urlToImage: "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400",
                url: "#",
                author: "Sample Author",
                publishedAt: new Date().toISOString(),
                source: { name: "Sample News" }
            },
            {
                title: "Sample News Article 2",
                description: "Another sample news article to show multiple articles in the grid layout",
                urlToImage: "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?auto=compress&cs=tinysrgb&w=400",
                url: "#",
                author: "Another Author",
                publishedAt: new Date().toISOString(),
                source: { name: "Sample Source" }
            },
            {
                title: "Sample News Article 3",
                description: "Third sample article demonstrating the news feed functionality",
                urlToImage: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
                url: "#",
                author: "Third Author",
                publishedAt: new Date().toISOString(),
                source: { name: "News Source" }
            },
            {
                title: "Sample News Article 4",
                description: "Fourth sample article to fill out the news grid with more content",
                urlToImage: "https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=400",
                url: "#",
                author: "Fourth Author",
                publishedAt: new Date().toISOString(),
                source: { name: "Daily News" }
            }
        ];
    }

    fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 }, async () => {
            try {
                let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.REACT_APP_API_KEY}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
                let data = await fetch(url);
                let parsedData = await data.json()
                console.log(parsedData);
                
                if (parsedData.status !== 'error') {
                    this.setState({
                        articles: this.state.articles.concat(parsedData.articles || []),
                        totalResults: parsedData.totalResults || 0,
                        loading: false
                    });
                }
            } catch (error) {
                console.error('Fetch more data error:', error);
            }
        })
    }

    render() {
        return (
            <div className=' my-4'>
                <h1 className='text-center'>{`News from ${this.props.category} category`}</h1>
                {this.state.loading && <Spinner />}

                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length < this.state.totalResults}
                    loader={<Spinner />}
                >
                    <div className="container">
                        <div className="row">
                            {!this.state.loading && this.state.articles.map((element) => {
                                return <div className="col-md-3" key={element.url}>
                                    <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>

                </InfiniteScroll>

            </div>

        )
    }
}

export default News
