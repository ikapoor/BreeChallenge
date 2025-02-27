# Project Setup Guide

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/)

## Setup Instructions

### 1. Install and Run Redis

Make sure Redis is installed and running on port 6379. Follow the instructions for your operating system:

#### On macOS:

```bash
brew install redis
brew services start redis
```

````

#### On Ubuntu:

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis-server.service
sudo systemctl start redis-server.service
```

#### On Windows:

Download the latest Redis release from [here](https://github.com/microsoftarchive/redis/releases) and follow the installation instructions.

Verify Redis is running by executing:

```bash
redis-cli ping
```

You should see `PONG` as a response.

### 2. Set Up the Backend Server

Open a new terminal and navigate to the backend directory. Then, run the following commands:

```bash
cd path/to/backend
npm install
npm run server
```

- `npm install`: Installs all the dependencies listed in `package.json`.
- `npm run server`: Starts the backend server using the `ts-node` command specified in the `scripts` section of `package.json`.

### 3. Set Up the Workers

In another terminal, navigate to the backend directory again and execute:

```bash
cd path/to/backend
npm run worker
```

- `npm run worker`: Starts the worker process using the `ts-node` command specified in the `scripts` section of `package.json`.

### 4. Set Up the Frontend

Finally, open a new terminal for the frontend setup:

```bash
cd path/to/frontend
npm install
npm run dev
```
````
