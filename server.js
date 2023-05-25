const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

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
  } else if (req.method === 'POST' && req.url === '/api/submitForm') {
    let data = '';

    // Collect the request body data
    req.on('data', (chunk) => {
      data += chunk;
    });

    // Process the request when the data has been fully received
    req.on('end', () => {
      const formData = JSON.parse(data);

      // Save form data to a file
      fs.writeFile('details.json', JSON.stringify(formData), (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end('Failed to submit form data. Please try again.');
        } else {
          res.statusCode = 200;
          res.end('Form data submitted successfully!');
        }
      });
    });
  } else  // Handle requests for details.json
  if (req.url === '/api/getDetails') {
    const filePath = path.join(__dirname, 'details.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else if (req.method === 'POST' && req.url === '/api/update-details') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      // Parse the received JSON data
      const updatedData = JSON.parse(body);

      // Read the details.json file
      fs.readFile('details.json', 'utf8', (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Error reading the details.json file');
        } else {
          try {
            // Parse the existing JSON data
            const jsonData = JSON.parse(data);

            // Update the JSON data with the received updated data
            Object.assign(jsonData, updatedData);

            // Write the updated JSON data back to the details.json file
            fs.writeFile('details.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
              if (err) {
                res.statusCode = 500;
                res.end('Error updating the details.json file');
              } else {
                res.statusCode = 200;
                res.end('Data updated successfully');
              }
            });
          } catch (error) {
            res.statusCode = 500;
            res.end('Error parsing the details.json file');
          }
        }
      });
    });
  } else if (req.method === 'POST' && req.url === '/api/jobForm') {
    let data = '';

    // Collect the request body data
    req.on('data', (chunk) => {
      data += chunk;
    });

    // Process the request when the data has been fully received
    req.on('end', () => {
      const jobData = JSON.parse(data);

      // Save form data to a file
      fs.writeFile('jobDetails.json', JSON.stringify(jobData), (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end('Failed to submit form data. Please try again.');
        } else {
          res.statusCode = 200;
          res.end('Form data submitted successfully!');
        }
      });
    });
  } else {
    // Serve the requested file
    let filePath;
    if (req.url === '/') {
      filePath = path.join(__dirname, 'index.html');
    } else {
      // Map additional routes to HTML files
      if (req.url === '/account') {
        filePath = path.join(__dirname, 'account.html');
      } else if (req.url === '/candidate') {
        filePath = path.join(__dirname, 'candidate.html');
      } else if (req.url === '/candidate-details') {
        filePath = path.join(__dirname, 'candidate-details.html');
      } else if (req.url === '/contact') {
        filePath = path.join(__dirname, 'contact.html');
      } else if (req.url === '/faq') {
        filePath = path.join(__dirname, 'faq.html');
      } else if (req.url === '/find-job') {
        filePath = path.join(__dirname, 'find-job.html');
      } else if (req.url === '/job-details') {
        filePath = path.join(__dirname, 'job-details.html');
      } else if (req.url === '/job-grid') {
        filePath = path.join(__dirname, 'job-grid.html');
      } else if (req.url === '/post-job') {
        filePath = path.join(__dirname, 'post-job.html');
      } else if (req.url === '/privacy-policy') {
        filePath = path.join(__dirname, 'privacy-policy.html');
      } else if (req.url === '/reset-password') {
        filePath = path.join(__dirname, 'reset-password.html');
      } else if (req.url === '/resume') {
        filePath = path.join(__dirname, 'resume.html');
      } else if (req.url === '/sign-in') {
        filePath = path.join(__dirname, 'sign-in.html');
      } else if (req.url === '/sign-up') {
        filePath = path.join(__dirname, 'sign-up.html');
      } else if (req.url === '/terms-condition') {
        filePath = path.join(__dirname, 'terms-condition.html');
      } else {
        filePath = path.join(__dirname, req.url);
      }
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
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message }));
}

function sendErrorResponse(res, statusCode, message) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: message }));
}
