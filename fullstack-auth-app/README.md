# Fake News Detector

A full-stack web application to analyze news articles for fake/real status. It features publisher/source analytics and a modern dashboard for tracking results.

## Features

- Analyze news articles for fake or real content using rule-based logic
- Dashboard with news stats summary, sources, and publisher analytics
- MongoDB + Express backend and React frontend
- Source and publisher management
- User authentication (if implemented)
- REST API

## Project Structure


## Setup Instructions

1. **Clone the repository:**
    ```
    git clone https://github.com/tasneem1865/fake-news-detector.git
    cd fake-news-detector/fullstack-auth-app
    ```

2. **Install backend dependencies:**
    ```
    cd backend
    npm install
    ```

3. **Install frontend dependencies:**
    ```
    cd ../frontend
    npm install
    ```

4. **Set up environment variables**

   - In `backend`, add a `.env` file with your MongoDB URI and other configs (example below):

    ```
    MONGODB_URI=mongodb://localhost:27017/fakenews
    JWT_SECRET=your_jwt_secret
    ```

5. **Start backend server:**
    ```
    cd backend
    npm run dev
    ```

6. **Start frontend server:**
    ```
    cd ../frontend
    npm run dev
    ```

7. **Open your browser and use the application!**

    - Backend API: `http://localhost:5000`
    - Frontend UI: `http://localhost:3000`

## Usage

- Go to the **Analyze News** page to submit article details and check authenticity.
- Explore the **Dashboard** for overall stats.
- Visit **Publishers** to see all news sources entered into the system.

## Contributing

Bug reports and pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
