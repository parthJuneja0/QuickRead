# QuickRead

QuickRead is a React-based web application that displays the latest news articles sourced from NewsAPI. This project serves as an insightful exploration of React development, incorporating various npm libraries to enhance the user experience.

## Features

- **NewsAPI Integration:** QuickRead utilizes NewsAPI to fetch and display the latest news articles, providing users with up-to-date information. NewsAPI was the first external API I used in this app, which helped me understand the meaning and basics of APIs.

- **User-Friendly Interface:** The application boasts a clean and intuitive design for easy navigation and an enjoyable reading experience.

- **Dynamic Features:** Leveraging npm libraries, QuickRead implements features such as a top-loading bar and infinite scroll, enhancing the overall usability of the app.

- **Category-wise News:** Users can personalize their news consumption by fetching category-wise news, making QuickRead a versatile alternative to news apps like Inshorts.

## Tech Stack

- React
- NewsAPI
- Bootstrap

## Environment Setup

- To set up the environment variables required to access NewsAPI, follow these steps:

1. Create a .env.local file in the root directory of the project.
2. Add the following content to the .env.local file, replacing yourApiKey with your actual NewsAPI key: `REACT_APP_API_KEY=yourApiKey`
3. You can obtain an API key by signing up at https://newsapi.org/.

## Usage

- Deployment of this project was not possible due to restriction set be NewsAPI

1. Clone the repository: `git clone https://github.com/parthJuneja0/QuickRead.git`
2. Navigate to the project directory: `cd QuickRead`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

## Contributing

Contributions are welcome! If you'd like to contribute to QuickRead, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/new-feature`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/new-feature`.
5. Submit a pull request.
