# Chat UOL

A real-time chat application built with Node.js, Express, and Socket.IO.

## Features

- Real-time messaging using WebSockets
- User join/leave notifications
- Typing indicators
- Responsive design
- No data persistence (messages are not saved)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

### Development Mode

To run the application in development mode with automatic restart on file changes:

```bash
npm run dev
```

### Production Mode

To run the application in production mode:

```bash
npm start
```

The application will be available at `http://localhost:3000` by default.

## Project Structure

- `server.js` - Main server file that sets up Express and Socket.IO
- `public/` - Static files directory
  - `index.html` - Main HTML file
  - `styles.css` - CSS styles
  - `app.js` - Client-side JavaScript

## License

MIT
