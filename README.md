# Project Setup Guide

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/)

## Setup Instructions

### 1. Install and Run Redis

Make sure Redis is installed and running on port `6379`. Follow the instructions for your operating system:

#### On macOS:

```bash
brew install redis
brew services start redis
On Ubuntu:
bash
Copy
Edit
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis-server.service
sudo systemctl start redis-server.service
On Windows:
Download the latest Redis release from here and follow the installation instructions.

To verify Redis is running, execute:

bash
Copy
Edit
redis-cli ping
If Redis is running correctly, you should see PONG as the response.

2. Set Up the Backend Server
Open a new terminal and navigate to the backend directory. Then, run the following commands:

bash
Copy
Edit
cd path/to/backend
npm install
npm run server
Commands Explanation:

npm install: Installs all dependencies listed in package.json.
npm run server: Starts the backend server using the ts-node command specified in scripts of package.json.
3. Set Up the Workers
In another terminal, navigate to the backend directory again and execute:

bash
Copy
Edit
cd path/to/backend
npm run worker
Commands Explanation:

npm run worker: Starts the worker process using the ts-node command specified in scripts of package.json.
4. Set Up the Frontend
Finally, open a new terminal for the frontend setup:

bash
Copy
Edit
cd path/to/frontend
npm install
npm run dev
Your frontend should now be running at http://localhost:3000 (or the port specified in your project settings).

```
