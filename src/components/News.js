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
            page: 1,
            usedArticleIndices: new Set(),
            seenArticles: new Set() // Track seen article titles and URLs
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

    // Function to check if an article is duplicate
    isDuplicateArticle = (article, existingArticles) => {
        const articleKey = `${article.title}-${article.url}`.toLowerCase();
        return this.state.seenArticles.has(articleKey);
    }

    // Function to add article to seen set
    addToSeenArticles = (articles) => {
        const newSeenArticles = new Set(this.state.seenArticles);
        articles.forEach(article => {
            const articleKey = `${article.title}-${article.url}`.toLowerCase();
            newSeenArticles.add(articleKey);
        });
        return newSeenArticles;
    }

    // Function to filter out duplicate articles
    filterDuplicateArticles = (newArticles) => {
        return newArticles.filter(article => {
            if (!article.title || !article.url) return false;
            return !this.isDuplicateArticle(article, this.state.articles);
        });
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
                const mockArticles = this.getMockArticles();
                this.setState({
                    articles: mockArticles,
                    totalResults: 20,
                    loading: false,
                    usedArticleIndices: new Set(mockArticles.map((_, index) => index))
                });
            } else {
                // Filter out duplicate articles from API response
                const uniqueArticles = this.filterDuplicateArticles(parsedData.articles || []);
                const updatedSeenArticles = this.addToSeenArticles(uniqueArticles);
                
                this.setState({
                    articles: uniqueArticles,
                    totalResults: parsedData.totalResults || 0,
                    loading: false,
                    usedArticleIndices: new Set(),
                    seenArticles: updatedSeenArticles
                });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // Use mock data if fetch fails
            const mockArticles = this.getMockArticles();
            this.setState({
                articles: mockArticles,
                totalResults: 20,
                loading: false,
                usedArticleIndices: new Set(mockArticles.map((_, index) => index))
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
                },
                {
                    title: "Local Community Celebrates Annual Festival",
                    description: "Thousands gather for the city's biggest cultural celebration of the year",
                    urlToImage: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Community Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Local News" }
                },
                {
                    title: "Education Reform Bill Passes Legislature",
                    description: "New legislation promises significant changes to public education system",
                    urlToImage: "https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Education Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Education Today" }
                },
                {
                    title: "Transportation Infrastructure Gets Major Upgrade",
                    description: "City announces multi-billion dollar investment in public transportation",
                    urlToImage: "https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Infrastructure Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "City News" }
                },
                {
                    title: "Environmental Conservation Efforts Show Results",
                    description: "Local wildlife population increases thanks to conservation initiatives",
                    urlToImage: "https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Environmental Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Green News" }
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
                },
                {
                    title: "Startup Raises Record-Breaking Funding Round",
                    description: "Young company secures largest Series A funding in industry history",
                    urlToImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Startup Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Venture News" }
                },
                {
                    title: "Global Supply Chain Disruptions Continue",
                    description: "Companies adapt strategies to navigate ongoing logistical challenges",
                    urlToImage: "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Supply Chain Expert",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Logistics Today" }
                },
                {
                    title: "Cryptocurrency Market Shows Volatility",
                    description: "Digital currencies experience significant price fluctuations amid regulatory news",
                    urlToImage: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Crypto Analyst",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Crypto News" }
                },
                {
                    title: "Retail Sales Surge During Holiday Season",
                    description: "Consumer spending reaches new highs as holiday shopping peaks",
                    urlToImage: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Retail Analyst",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Retail Report" }
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
                },
                {
                    title: "Quantum Computing Milestone Achieved",
                    description: "Researchers demonstrate quantum supremacy in complex calculations",
                    urlToImage: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Quantum Researcher",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Quantum Tech" }
                },
                {
                    title: "5G Network Expansion Accelerates Globally",
                    description: "Telecommunications companies roll out next-generation wireless infrastructure",
                    urlToImage: "https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Telecom Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "5G Today" }
                },
                {
                    title: "Cybersecurity Threats Evolve with New Technology",
                    description: "Security experts warn of sophisticated attacks targeting emerging technologies",
                    urlToImage: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Security Expert",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Cyber Security" }
                },
                {
                    title: "Virtual Reality Gaming Reaches New Heights",
                    description: "Immersive gaming experiences push the boundaries of virtual reality technology",
                    urlToImage: "https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Gaming Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "VR Gaming" }
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
                },
                {
                    title: "Soccer World Cup Qualifiers Heat Up",
                    description: "National teams compete for coveted spots in the upcoming World Cup tournament",
                    urlToImage: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Soccer Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Soccer World" }
                },
                {
                    title: "Basketball Season Reaches Playoff Intensity",
                    description: "Teams battle for championship positions as regular season concludes",
                    urlToImage: "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Basketball Analyst",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Hoops Central" }
                },
                {
                    title: "Tennis Grand Slam Tournament Begins",
                    description: "World's top tennis players compete for prestigious championship title",
                    urlToImage: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Tennis Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Tennis Today" }
                },
                {
                    title: "Marathon Running Gains Popularity Worldwide",
                    description: "Record numbers of participants register for major marathon events globally",
                    urlToImage: "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Running Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Marathon News" }
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
                },
                {
                    title: "Vaccine Development Shows Promising Results",
                    description: "Clinical trials demonstrate high efficacy rates for new preventive treatment",
                    urlToImage: "https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Vaccine Researcher",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Vaccine News" }
                },
                {
                    title: "Nutrition Study Reveals Surprising Benefits",
                    description: "Research shows unexpected health advantages of common dietary choices",
                    urlToImage: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Nutrition Expert",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Nutrition Today" }
                },
                {
                    title: "Telemedicine Adoption Continues to Grow",
                    description: "Remote healthcare services become increasingly popular among patients",
                    urlToImage: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Digital Health Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Telemedicine News" }
                },
                {
                    title: "Exercise Benefits for Aging Population Confirmed",
                    description: "Long-term study validates importance of physical activity for seniors",
                    urlToImage: "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Geriatric Specialist",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Senior Health" }
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
                },
                {
                    title: "Streaming Platform Launches Original Series",
                    description: "New exclusive content promises to compete with traditional television",
                    urlToImage: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Streaming Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Streaming News" }
                },
                {
                    title: "Celebrity Couple Announces Engagement",
                    description: "Popular actors share exciting news with fans on social media",
                    urlToImage: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Celebrity Reporter",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Celebrity News" }
                },
                {
                    title: "Gaming Industry Sets New Revenue Records",
                    description: "Video game sales reach unprecedented levels across all platforms",
                    urlToImage: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Gaming Analyst",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Gaming Industry" }
                },
                {
                    title: "Broadway Shows Return to Full Capacity",
                    description: "Theater district celebrates return to normal operations with sold-out performances",
                    urlToImage: "https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Theater Critic",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Broadway News" }
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
                },
                {
                    title: "Marine Biology Discovery in Deep Ocean",
                    description: "Scientists find new species in previously unexplored ocean depths",
                    urlToImage: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Marine Biologist",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Ocean Science" }
                },
                {
                    title: "Renewable Energy Efficiency Breakthrough",
                    description: "New solar panel technology achieves record-breaking energy conversion rates",
                    urlToImage: "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Energy Researcher",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Green Energy" }
                },
                {
                    title: "Archaeological Find Rewrites Ancient History",
                    description: "Excavation uncovers artifacts that challenge existing historical timelines",
                    urlToImage: "https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Archaeologist",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Archaeology Today" }
                },
                {
                    title: "Genetic Research Opens New Treatment Possibilities",
                    description: "Gene therapy trials show promise for treating rare genetic disorders",
                    urlToImage: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=400",
                    url: "#",
                    author: "Genetics Researcher",
                    publishedAt: new Date().toISOString(),
                    source: { name: "Genetics News" }
                }
            ]
        };

        // Return category-specific articles, or general if category not found
        return categoryData[this.props.category] || categoryData.general;
    }

    fetchMoreData = async () => {
        const nextPage = this.state.page + 1;
        
        try {
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${process.env.REACT_APP_API_KEY}&page=${nextPage}&pageSize=${this.props.pageSize}`;
            let data = await fetch(url);
            let parsedData = await data.json()
            console.log(parsedData);
            
            if (parsedData.status !== 'error' && parsedData.articles && parsedData.articles.length > 0) {
                // Filter out duplicate articles from API response
                const uniqueNewArticles = this.filterDuplicateArticles(parsedData.articles);
                const updatedSeenArticles = this.addToSeenArticles(uniqueNewArticles);
                
                // Only add articles if we have unique ones
                if (uniqueNewArticles.length > 0) {
                    this.setState({
                        articles: this.state.articles.concat(uniqueNewArticles),
                        totalResults: parsedData.totalResults || 0,
                        page: nextPage,
                        seenArticles: updatedSeenArticles
                    });
                } else {
                    // If no unique articles from API, fall back to mock data
                    this.addMockArticles(nextPage);
                }
            } else {
                // If API fails or no more articles, add more mock data
                this.addMockArticles(nextPage);
            }
        } catch (error) {
            console.error('Fetch more data error:', error);
            // If fetch fails, add mock data
            this.addMockArticles(nextPage);
        }
    }

    addMockArticles = (nextPage) => {
        const allMockArticles = this.getMockArticles();
        const availableIndices = [];
        
        // Find unused articles
        for (let i = 0; i < allMockArticles.length; i++) {
            if (!this.state.usedArticleIndices.has(i)) {
                availableIndices.push(i);
            }
        }
        
        let finalMockArticles = [];
        
        if (availableIndices.length >= 4) {
            // Use next 4 unused articles
            const selectedIndices = availableIndices.slice(0, 4);
            finalMockArticles = selectedIndices.map(index => allMockArticles[index]);
            
            // Mark these articles as used
            const newUsedIndices = new Set(this.state.usedArticleIndices);
            selectedIndices.forEach(index => newUsedIndices.add(index));
            const updatedSeenArticles = this.addToSeenArticles(finalMockArticles);
            
            this.setState({
                articles: this.state.articles.concat(finalMockArticles),
                page: nextPage,
                totalResults: this.state.articles.length + finalMockArticles.length + (availableIndices.length > 4 ? 20 : 0),
                usedArticleIndices: newUsedIndices,
                seenArticles: updatedSeenArticles
            });
        } else if (availableIndices.length > 0) {
            // Use remaining unused articles
            finalMockArticles = availableIndices.map(index => allMockArticles[index]);
            const updatedSeenArticles = this.addToSeenArticles(finalMockArticles);
            
            this.setState({
                articles: this.state.articles.concat(finalMockArticles),
                page: nextPage,
                totalResults: this.state.articles.length + finalMockArticles.length,
                usedArticleIndices: new Set([...this.state.usedArticleIndices, ...availableIndices]),
                seenArticles: updatedSeenArticles
            });
        } else {
            // All articles used, create variations
            finalMockArticles = allMockArticles.slice(0, 4).map((article, index) => ({
                ...article,
                title: `${article.title} - Update ${nextPage}`,
                url: `#page-${nextPage}-${index}`,
                description: `${article.description} - Latest developments from page ${nextPage}.`
            }));
            const updatedSeenArticles = this.addToSeenArticles(finalMockArticles);
            
            this.setState({
                articles: this.state.articles.concat(finalMockArticles),
                page: nextPage,
                totalResults: this.state.articles.length + finalMockArticles.length + 20,
                seenArticles: updatedSeenArticles
            });
        }
    }

    render() {
        return (
            <div>
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner />}
                >
                    <div className="container">
                        <div className="row">
                            {this.state.articles.map((element, index) => {
                                return <div className="col-md-4" key={`${element.url}-${index}`}>
                                    <NewsItem
                                        title={element.title ? element.title.slice(0, 45) : ""}
                                        description={element.description ? element.description.slice(0, 88) : ""}
                                        imageUrl={element.urlToImage}
                                        newsUrl={element.url}
                                        author={element.author}
                                        date={element.publishedAt}
                                        source={element.source.name}
                                    />
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
