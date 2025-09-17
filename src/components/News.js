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
            },
            {
                title: "Sample News Article 5",
                description: "Fifth sample article with technology news content",
                urlToImage: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400",
                url: "#",
                author: "Tech Reporter",
                publishedAt: new Date().toISOString(),
                source: { name: "Tech News" }
            },
            {
                title: "Sample News Article 6",
                description: "Sixth sample article covering business and finance topics",
                urlToImage: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400",
                url: "#",
                author: "Business Writer",
                publishedAt: new Date().toISOString(),
                source: { name: "Business Today" }
            },
            {
                title: "Sample News Article 7",
                description: "Seventh sample article about health and wellness trends",
                urlToImage: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400",
                url: "#",
                author: "Health Expert",
                publishedAt: new Date().toISOString(),
                source: { name: "Health Daily" }
            },
            {
                title: "Sample News Article 8",
                description: "Eighth sample article covering sports and entertainment news",
                urlToImage: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400",
                url: "#",
                author: "Sports Reporter",
                publishedAt: new Date().toISOString(),
                source: { name: "Sports Central" }
            }
        ];
    }

    fetchMoreData = async () => {
        const nextPage = this.state.page + 1;
        
        try {
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.REACT_APP_API_KEY}&page=${nextPage}&pageSize=${this.props.pageSize}`;
            let data = await fetch(url);
            let parsedData = await data.json()
            console.log(parsedData);
            
            if (parsedData.status !== 'error' && parsedData.articles && parsedData.articles.length > 0) {
                this.setState({
                    articles: this.state.articles.concat(parsedData.articles),
                    totalResults: parsedData.totalResults || 0,
                    page: nextPage
                });
            } else {
                // If API fails or no more articles, add more mock data
                const moreMockArticles = this.getMockArticles().map((article, index) => ({
                    ...article,
                    title: `${article.title} - Page ${nextPage}`,
                    url: `#page-${nextPage}-${index}`
                }));
                
                this.setState({
                    articles: this.state.articles.concat(moreMockArticles),
                    page: nextPage,
                    totalResults: this.state.articles.length + moreMockArticles.length + 20 // Allow more loading
                });
            }
        } catch (error) {
            console.error('Fetch more data error:', error);
            // If fetch fails, add mock data
            const moreMockArticles = this.getMockArticles().map((article, index) => ({
                ...article,
                title: `${article.title} - Page ${nextPage}`,
                url: `#page-${nextPage}-${index}`
            }));
            
            this.setState({
                articles: this.state.articles.concat(moreMockArticles),
                page: nextPage,
                totalResults: this.state.articles.length + moreMockArticles.length + 20 // Allow more loading
            });
        }
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
                    endMessage={
                        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                            <b>You have seen all the news!</b>
                        </p>
                    }
                >
                    <div className="container">
                        <div className="row">
                            {!this.state.loading && this.state.articles.map((element, index) => {
                                return <div className="col-md-3" key={`${element.url}-${index}`}>
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
