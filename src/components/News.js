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
        const categoryData = {
            general: [
                {
                    title: "Breaking: Major Political Development Unfolds",
                    description: "Latest updates on significant political events affecting the nation",
                    urlToImage: "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Political Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "General News" }
                },
                {
                    title: "Weather Alert: Severe Storm Warning Issued",
                    description: "Meteorologists warn of severe weather conditions expected this week",
                    urlToImage: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Weather Team",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Weather Central" }
                }
            ],
            business: [
                {
                    title: "Stock Market Reaches New Heights",
                    description: "Major indices show significant gains as investors remain optimistic",
                    urlToImage: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Financial Analyst",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Business Today" }
                },
                {
                    title: "Tech Giant Announces Major Acquisition",
                    description: "Multi-billion dollar deal set to reshape the technology landscape",
                    urlToImage: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Business Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Corporate News" }
                }
            ],
            technology: [
                {
                    title: "Revolutionary AI Breakthrough Announced",
                    description: "Scientists develop new artificial intelligence system with unprecedented capabilities",
                    urlToImage: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Tech Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Tech News" }
                },
                {
                    title: "New Smartphone Features Change Everything",
                    description: "Latest mobile technology promises to revolutionize how we communicate",
                    urlToImage: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Mobile Expert",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Mobile Tech" }
                }
            ],
            sports: [
                {
                    title: "Championship Finals Set Record Viewership",
                    description: "Millions tune in to watch the most anticipated sporting event of the year",
                    urlToImage: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Sports Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Sports Central" }
                },
                {
                    title: "Olympic Preparations Underway",
                    description: "Athletes from around the world prepare for the upcoming Olympic games",
                    urlToImage: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Olympic Correspondent",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Olympic News" }
                }
            ],
            health: [
                {
                    title: "Medical Breakthrough in Cancer Treatment",
                    description: "New therapy shows promising results in clinical trials",
                    urlToImage: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Medical Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Health Today" }
                },
                {
                    title: "Mental Health Awareness Campaign Launches",
                    description: "New initiative aims to reduce stigma and improve access to mental health services",
                    urlToImage: "https://images.pexels.com/photos/3912979/pexels-photo-3912979.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Health Advocate",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Mental Health News" }
                }
            ],
            entertainment: [
                {
                    title: "Hollywood Blockbuster Breaks Box Office Records",
                    description: "Latest superhero movie shatters opening weekend expectations",
                    urlToImage: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Entertainment Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Entertainment Weekly" }
                },
                {
                    title: "Music Festival Lineup Announced",
                    description: "Top artists confirmed for this summer's biggest music festival",
                    urlToImage: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Music Journalist",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Music News" }
                }
            ],
            science: [
                {
                    title: "Space Mission Discovers New Exoplanet",
                    description: "Astronomers identify potentially habitable world in distant solar system",
                    urlToImage: "https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Space Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Science Daily" }
                },
                {
                    title: "Climate Research Reveals Surprising Findings",
                    description: "New study provides insights into global climate change patterns",
                    urlToImage: "https://images.pexels.com/photos/60013/desert-drought-dehydrated-clay-soil-60013.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Climate Scientist",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Climate News" }
                }
            ]
        };

        // Return category-specific articles, or general if category not found
        const articles = categoryData[this.props.category] || categoryData.general;
        
        // Add more articles to ensure we have enough content
        const extendedArticles = [...articles];
        for (let i = 0; i < 6; i++) {
            extendedArticles.push({
                ...articles[i % articles.length],
                title: `${articles[i % articles.length].title} - Extended ${i + 1}`,
                url: `#extended-${i}`
            });
        }
        
        return extendedArticles;
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
                const baseMockArticles = this.getMockArticles().slice(0, 4); // Get first 4 articles
                const moreMockArticles = baseMockArticles.map((article, index) => ({
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
            const baseMockArticles = this.getMockArticles().slice(0, 4); // Get first 4 articles
            const moreMockArticles = baseMockArticles.map((article, index) => ({
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
