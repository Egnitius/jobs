const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

// Create the server
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/signup') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      // Parse the JSON data from the request body
      const userData = JSON.parse(body);

      // Check if the users.json file exists
      const usersFilePath = path.join(__dirname, 'users.json');
      fs.access(usersFilePath, fs.constants.F_OK, err => {
        if (err) {
          // If the file doesn't exist, create a new one with the user data
          const initialData = [userData];
          const initialDataJSON = JSON.stringify(initialData);

          fs.writeFile(usersFilePath, initialDataJSON, 'utf8', err => {
            if (err) {
              console.error('Error writing to users.json:', err);
              sendErrorResponse(res, 500, 'Failed to create user');
            } else {
              sendSuccessResponse(res, 'User signed up successfully!');
            }
          });
        } else {
          // If the file exists, read the existing user data
          fs.readFile(usersFilePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading users.json:', err);
              sendErrorResponse(res, 500, 'Failed to read user data');
            } else {
              try {
                // Parse the existing user data from the file
                const existingUsers = JSON.parse(data);

                // Check if the email already exists
                const userExists = existingUsers.some(user => user.email === userData.email);
                if (userExists) {
                  sendErrorResponse(res, 400, 'Email already exists');
                } else {
                  // Add the new user data to the existing users
                  existingUsers.push(userData);
                  const updatedDataJSON = JSON.stringify(existingUsers);

                  // Write the updated user data back to the file
                  fs.writeFile(usersFilePath, updatedDataJSON, 'utf8', err => {
                    if (err) {
                      console.error('Error writing to users.json:', err);
                      sendErrorResponse(res, 500, 'Failed to create user');
                    } else {
                      sendSuccessResponse(res, 'User signed up successfully!');
                    }
                  });
                }
              } catch (error) {
                console.error('Error parsing users.json:', error);
                sendErrorResponse(res, 500, 'Failed to read user data');
              }
            }
          });
        }
      });
    });
  } else if (req.method === 'POST' && req.url === '/api/signin') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      // Parse the JSON data from the request body
      const userData = JSON.parse(body);

      // Check if the users.json file exists
      const usersFilePath = path.join(__dirname, 'users.json');
      fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading users.json:', err);
          sendErrorResponse(res, 500, 'Failed to read user data');
        } else {
          try {
            // Parse the user data from the file
            const users = JSON.parse(data);

            // Find the user with matching email and password
            const authenticatedUser = users.find(
              user => user.email === userData.email && user.password === userData.password
            );

            if (authenticatedUser) {
              // Authentication successful
              sendSuccessResponse(res, 'Authentication successful');
            } else {
              // Authentication failed
              sendErrorResponse(res, 401, 'Authentication failed');
            }
          } catch (error) {
            console.error('Error parsing users.json:', error);
            sendErrorResponse(res, 500, 'Failed to read user data');
          }
        }
      });
    });
  } else {
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

// Helper functions for sending responses
function sendSuccessResponse(res, message) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message }));
}

function sendErrorResponse(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message }));
}
