const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

// Create the server
const server = http.createServer((req, res) => {
  // Serve the requested file
  let filePath;
  if (req.url === '/') {
    filePath = path.join(__dirname, 'index.html');
  } else {
    filePath = path.join(__dirname, req.url);
  }

  // Get the file extension
  const extension = path.extname(filePath);

  // Set the content type based on the file extension
  res.setHeader('Content-Type', getContentType(extension));

  // Read and serve the requested file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Handle file not found
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File Not Found');
        return;
      }

      // Handle other errors
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }

    // Send the file data as the response
    res.end(data);
  });
});

// Handle POST request to /api/signup
server.on('request', (req, res) => {
  if (req.method === 'POST' && req.url === '/api/signup') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      // Get the user data from the request body
      const userData = JSON.parse(body);

      // Perform validation or any additional logic here before storing the data
      // For example, you could check if the username or email already exists in the database

      // Store the user data in a database or perform any other necessary actions
      // Replace this code with your actual storage implementation
      // Here, we're just logging the user data to the console
      console.log('Received user data:', userData);

      // Send a response indicating success
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ message: 'User signed up successfully!' }));
    });
  }
});

// Start the server
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

// Helper function to get the content type based on the file extension
function getContentType(extension) {
  switch (extension) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.woff':
      return 'application/font-woff';
    case '.woff2':
      return 'application/font-woff2';
    case '.ttf':
      return 'application/font-sfnt';
    case '.eot':
      return 'application/vnd.ms-fontobject';
    default:
      return 'application/octet-stream';
  }
}
