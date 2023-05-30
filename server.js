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
  } else if (req.method === 'POST' && req.url === '/api/recSignup') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      // Parse the JSON data from the request body
      const recData = JSON.parse(body);

      // Check if the recruiter.json file exists
      const recFilePath = path.join(__dirname, 'recruiter.json');
      fs.access(recFilePath, fs.constants.F_OK, err => {
        if (err) {
          // If the file doesn't exist, create a new one with the recruiter data
          const initialData = [recData];
          const initialDataJSON = JSON.stringify(initialData);

          fs.writeFile(recFilePath, initialDataJSON, 'utf8', err => {
            if (err) {
              console.error('Error writing to recruiter.json:', err);
              sendErrorResponse(res, 500, 'Failed to create recruiter');
            } else {
              sendSuccessResponse(res, 'Recruiter signed up successfully!');
            }
          });
        } else {
          // If the file exists, read the existing recruiter data
          fs.readFile(recFilePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading recruiter.json:', err);
              sendErrorResponse(res, 500, 'Failed to read recruiter data');
            } else {
              try {
                // Parse the existing recruiter data from the file
                const existingRecruiters = JSON.parse(data);

                // Check if the email already exists
                const recExists = existingRecruiters.some(recruiter => recruiter.email === recData.email);
                if (recExists) {
                  sendErrorResponse(res, 400, 'Email already exists');
                } else {
                  // Add the new recruiter data to the existing recruiters
                  existingRecruiters.push(recData);
                  const updatedDataJSON = JSON.stringify(existingRecruiters);

                  // Write the updated recruiter data back to the file
                  fs.writeFile(recFilePath, updatedDataJSON, 'utf8', err => {
                    if (err) {
                      console.error('Error writing to recruiter.json:', err);
                      sendErrorResponse(res, 500, 'Failed to create recruiter');
                    } else {
                      sendSuccessResponse(res, 'Recruiter signed up successfully!');
                    }
                  });
                }
              } catch (error) {
                console.error('Error parsing recruiter.json:', error);
                sendErrorResponse(res, 500, 'Failed to read recruiter data');
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
  } else if (req.method === 'POST' && req.url === '/api/recSignin') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      // Parse the JSON data from the request body
      const recData = JSON.parse(body);

      // Check if the recuiter.json file exists
      const recFilePath = path.join(__dirname, 'recruiter.json');
      fs.readFile(recFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading recruiter.json:', err);
          sendErrorResponse(res, 500, 'Failed to read user data');
        } else {
          try {
            // Parse the user data from the file
            const users = JSON.parse(data);

            // Find the user with matching email and password
            const authenticatedUser = users.find(
              user => user.email === recData.email && user.password === recData.password
            );

            if (authenticatedUser) {
              // Authentication successful
              sendSuccessResponse(res, 'Authentication successful');
            } else {
              // Authentication failed
              sendErrorResponse(res, 401, 'Authentication failed');
            }
          } catch (error) {
            console.error('Error parsing recuiter.json:', error);
            sendErrorResponse(res, 500, 'Failed to read user data');
          }
        }
      });
    });
  } else if (req.method === 'POST' && req.url === '/api/submitForm') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      // Parse the JSON data from the request body
      const formData = JSON.parse(body);

      // Save the form data to a file
      const filePath = path.join(__dirname, 'details.json');
      fs.writeFile(filePath, JSON.stringify(formData), (err) => {
        if (err) {
          console.error('Error writing details.json:', err);
          res.statusCode = 500;
          res.end('Failed to submit form details');
        } else {
          res.statusCode = 200;
          res.end('Form data submitted successfully');
        }
      });
    });
  } else  // Handle requests for details.json
  if (req.method === 'POST' && req.url === '/api/update-details') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
  
    req.on('end', () => {
      // Parse the JSON data from the request body
      const updatedData = JSON.parse(body);
  
      // Read the existing data from the JSON file
      const filePath = path.join(__dirname, 'details.json');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading details.json:', err);
          res.statusCode = 500;
          res.end('Failed to update details');
        } else {
          // Parse the existing data
          const existingData = JSON.parse(data);
  
          // Update the existing data with the new values
          existingData.name = updatedData.name;
          existingData.jobTitle = updatedData.jobTitle;
          existingData.aboutMe = updatedData.aboutMe;
          existingData.education.school = updatedData.education.school;
          existingData.education.qualification = updatedData.education.qualification;
          existingData.education.yearStarted = updatedData.education.yearStarted;
          existingData.education.yearCompleted = updatedData.education.yearCompleted;
          existingData.experience.position = updatedData.experience.position;
          existingData.experience.company = updatedData.experience.company;
          existingData.experience.year = updatedData.experience.year;
          existingData.experience.reason = updatedData.experience.reason;
          existingData.skills = updatedData.skills;
  
          // Write the updated data back to the JSON file
          fs.writeFile(filePath, JSON.stringify(existingData), (err) => {
            if (err) {
              console.error('Error writing details.json:', err);
              res.statusCode = 500;
              res.end('Failed to update data');
            } else {
              res.statusCode = 200;
              res.end('Data updated successfully');
            }
          });
        }
      });
    });  
  } else if (req.method === 'POST' && req.url === '/api/updateprofile') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      // Parse the JSON data from the request body
      const updatedData = JSON.parse(body);

      // Check if the recruiter.json file exists
      const recFilePath = path.join(__dirname, 'recruiter.json');
      fs.access(recFilePath, fs.constants.F_OK, err => {
        if (err) {
          sendErrorResponse(res, 500, 'Recruiter data file does not exist');
        } else {
          // If the file exists, read the existing recruiter data
          fs.readFile(recFilePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading recruiter.json:', err);
              sendErrorResponse(res, 500, 'Failed to read recruiter data');
            } else {
              try {
                // Parse the existing recruiter data from the file
                const existingRecruiters = JSON.parse(data);

                // Find the recruiter by email
                const recruiter = existingRecruiters.find(rec => rec.email === updatedData.email);
                if (!recruiter) {
                  sendErrorResponse(res, 400, 'Recruiter not found');
                } else {
                  // Update the recruiter data
                  recruiter.name = updatedData.name;
                  recruiter.company = updatedData.company;

                  const updatedDataJSON = JSON.stringify(existingRecruiters);

                  // Write the updated recruiter data back to the file
                  fs.writeFile(recFilePath, updatedDataJSON, 'utf8', err => {
                    if (err) {
                      console.error('Error writing to recruiter.json:', err);
                      sendErrorResponse(res, 500, 'Failed to update recruiter');
                    } else {
                      sendSuccessResponse(res, 'Recruiter updated successfully!');
                    }
                  });
                }
              } catch (error) {
                console.error('Error parsing recruiter.json:', error);
                sendErrorResponse(res, 500, 'Failed to read recruiter data');
              }
            }
          });
        }
      });
    });
  } else if (req.url === '/api/jobForm' && req.method === 'POST') {
    let body = '';

    // Read the request body
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    // Process the request body
    req.on('end', () => {
      try {
        // Parse the JSON data from the request body
        const jobData = JSON.parse(body);

        // Read the existing job details from the JSON file
        fs.readFile('jobDetails.json', 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          } else {
            // Parse the existing job details
            const existingJobs = JSON.parse(data);

            // Update the job details with the new job data
            existingJobs[0].jobs.push(jobData);

            // Write the updated job details back to the JSON file
            fs.writeFile('jobDetails.json', JSON.stringify(existingJobs), 'utf8', (err) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
              } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Job Posted!');
              }
            });
          }
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON data');
      }
    });
  } else // Check the URL path and respond accordingly
  if (req.url === '/api/jobDetails.json') {
    fs.readFile('./api/jobDetails.json', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
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
  } else if (req.url === '/recSign-up') {
    filePath = path.join(__dirname, 'recSign-up.html');
  } else if (req.url === '/recSign-in') {
    filePath = path.join(__dirname, 'recSign-in.html');
  } else if (req.url === '/dashboard') {
    filePath = path.join(__dirname, 'dashboard.html');
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

// Function to send a success response
function sendSuccessResponse(res, message) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  const responseData = { success: true, message };
  res.end(JSON.stringify(responseData));
}

// Function to send an error response
function sendErrorResponse(res, statusCode, message) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  const responseData = { success: false, error: message };
  res.end(JSON.stringify(responseData));
}

// Retrieve the job ID from the query parameters
const urlParams = new URL(req.url, `http://${req.headers.host}`);
const jobId = urlParams.searchParams.get('id');

// Read the jobDetails.json file
fs.readFile('jobDetails.json', 'utf8', (err, data) => {
  if (err) {
    res.statusCode = 500;
    res.end('Internal Server Error');
    return;
  }

  try {
    const jobData = JSON.parse(data);

    // Find the job object with the matching ID
    const job = jobData.jobs.find((item) => item.id === jobId);

    if (job) {
      // Return the job data as a JSON response
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(job));
    } else {
      res.statusCode = 404;
      res.end('Job not found');
    }
  } catch (error) {
    res.statusCode = 500;
    res.end('Internal Server Error');
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

