const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const qs = require('querystring');

// Create a nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  // configure the transporter options (e.g., SMTP settings)
  host: 'mail.capaciti.org.za', // Replace with your email provider SMTP server
      port: 465, // Replace with the port number provided by your email provider
      secure: true, // Use SSL
      auth: {
        user: 'paledi.egnitius@capaciti.org.za', // Replace with your email address
        pass: 'Egni@pal', // Replace with your email password
      },
});
 

const port = 3000;
const sessionData = {
  applications: [],
};

// Read the job details from the JSON file
const jobDetailsPath = path.join(__dirname, 'jobDetails.json');
const jobDetails = JSON.parse(fs.readFileSync(jobDetailsPath, 'utf8'));

// Create the server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

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
          // existingData.education.school = updatedData.education.school;
          // existingData.education.qualification = updatedData.education.qualification;
          // existingData.education.yearStarted = updatedData.education.yearStarted;
          // existingData.education.yearCompleted = updatedData.education.yearCompleted;
          // existingData.experience.position = updatedData.experience.position;
          // existingData.experience.company = updatedData.experience.company;
          // existingData.experience.year = updatedData.experience.year;
          // existingData.experience.reason = updatedData.experience.reason;
          // existingData.skills = updatedData.skills;
  
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
  } else if (req.method === 'POST' && req.url === '/api/jobForm') {
    // Read existing job data from the file
    const filePath = path.join(__dirname, 'jobDetails.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading job data:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      // Parse existing job data as JSON
      let jobDetails = JSON.parse(data);

      // Generate a unique ID for the new job
      const newJobId = generateUniqueId(jobDetails);

      // Get the request body
      let requestBody = '';
      req.on('data', chunk => {
        requestBody += chunk.toString();
      });

      req.on('end', () => {
        // Parse the request body as JSON
        const newJobData = JSON.parse(requestBody);

        // Add the new job data with the generated ID
        newJobData.id = newJobId;
        jobDetails.jobs.push(newJobData);

        // Write the updated job data back to the file
        fs.writeFile(filePath, JSON.stringify(jobDetails), 'utf8', err => {
          if (err) {
            console.error('Error writing job data:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }

          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Job posted successfully');
        });
      });
    });
  } else if (req.url === '/api/jobDetails.json') {
    // Read the job details JSON file
    fs.readFile('/api/jobDetails.json', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });
  } else if (req.method === 'POST' && req.url === '/apply') {
    let body = '';

    // Collect the request data
    req.on('data', (chunk) => {
      body += chunk;
    });

    // Process the request data
    req.on('end', () => {
      // Parse the request body as JSON
      const applicationData = JSON.parse(body);

      // Save the application data in the session
      if (sessionData.applications.length < 5) {
        sessionData.applications.push(applicationData);
      }

      // Send a response indicating success
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Application submitted successfully' }));
    });
  } else if (req.method === 'GET' && req.url === '/jobDetails.json') {
    const filePath = path.join(__dirname, 'jobDetails.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      }
    });
  } else if (req.method === 'GET' && req.url === '/session') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(sessionData));
  } else if (req.url === '/candidate-details') {
    // Read the candidate details from the JSON file
    fs.readFile('candidate-details.json', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      }
    });} else if (req.method === 'GET' && pathname === '/api/search') {
      // Retrieve the searchQuery, locationQuery, and categoryQuery from the query parameters
      const searchQuery = query.searchQuery;
      const locationQuery = query.locationQuery;
      const categoryQuery = query.categoryQuery;
  
      // Implement your logic to filter jobs based on the search query, location, and category
      const filteredJobs = filterJobs(searchQuery, locationQuery, categoryQuery);
  
      // Prepare the job results
      const results = { jobs: filteredJobs };
  
      // Send the response as JSON
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(results));
  } else if (req.method === 'POST' && req.url === '/api/resume') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
  
      // Parse the received data
      const userData = JSON.parse(body);
  
      // Generate the PDF
      const doc = new PDFDocument({ margin: 50 });
  
      // Set the response headers for downloading the PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="myResume.pdf"`);
  
      // Pipe the PDF document to the response
      doc.pipe(res);
  
      // Set font colors and styles
      const headingColor = '#333333';
      const subheadingColor = '#666666';
      const contentColor = '#000000';
  
      // Add a border around the content
     const borderWidth = 2;
     const borderX = 40;
     const borderY = 40;
     const borderWidthWithMargin = doc.page.width - (2 * borderX);
     const borderHeightWithMargin = doc.page.height - (2 * borderY);
     doc.rect(borderX, borderY, borderWidthWithMargin, borderHeightWithMargin).lineWidth(borderWidth).stroke();
  
      // Add content to the PDF
      const imageWidth = 120;
      const imageHeight = 120;
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Calculate the horizontal position to center the image
      const imageX = (pageWidth - imageWidth) / 2;
      const imageY = borderY + 5;

      // Add the image above the name
      doc.image('assets/img/blackman.jpg', imageX, imageY, { fit: [imageWidth, imageHeight], align: 'center' });

      doc.moveDown(6);
  
      doc.font('Helvetica-Bold').fillColor(headingColor).fontSize(20).text(userData.name, {align: 'center'});
  
      doc.font('Helvetica').fillColor(subheadingColor).fontSize(14).text(userData.jobTitle, {align: 'center'});
  
      doc.moveDown(); // Add vertical spacing
  
  
      doc.font('Helvetica-Bold').fillColor(headingColor).fontSize(14).text('About Me:');
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(userData.aboutMe);
      doc.moveDown();
  
      // Personal Information
      doc.font('Helvetica-Bold').fillColor(headingColor).fontSize(14).text('Personal Information:');
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(`Email: ${userData.email}`);
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(`Phone: ${userData.phone}`);
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(`Address: ${userData.city}, ${userData.region}, ${userData.country}, ${userData.zipCode}`);
  
      doc.moveDown(); // Add vertical spacing
  
      // Education
      doc.font('Helvetica-Bold').fillColor(headingColor).fontSize(14).text('Education:');
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(userData.educationQualification);
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(userData.educationSchool);
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(`${userData.educationYearStarted} - ${userData.educationYearCompleted}`);
  
      doc.moveDown(); // Add vertical spacing
  
      // Work Experience
      doc.font('Helvetica-Bold').fillColor(headingColor).fontSize(14).text('Work Experience:');
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(userData.workPosition);
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(userData.workCompany);
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(userData.workYear);
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(`Reason for Leaving: ${userData.workReasonForLeaving}`);
  
      doc.moveDown(); // Add vertical spacing
  
      // Skills
      doc.font('Helvetica-Bold').fillColor(headingColor).fontSize(14).text('Skills:');
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(userData.skill1);
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(userData.skill2);
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(userData.skill3);
      doc.font('Helvetica').fillColor(contentColor).fontSize(12).text(userData.skill4);
  
      // End the PDF document
      doc.end();
    });
  } else if (req.method === 'POST' && req.url === '/subscribe') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const formData = qs.parse(body);
      const email = formData.EMAIL;

      // Process the email subscription here
      saveToDatabase(email)
        .then(() => sendConfirmationEmail(email))
        .then(() => {
          // Send a response indicating successful subscription
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Thank you for subscribing!');
        })
        .catch((error) => {
          // Handle any errors that occurred during subscription processing
          console.error('Subscription error:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('An error occurred during subscription.');
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

// Helper function to generate a unique ID
function generateUniqueId(jobDetails) {
  let id = 1;
  const existingIds = jobDetails.jobs.map(job => job.id);

  // Find the smallest available ID
  while (existingIds.includes(id)) {
    id++;
  }

  return id;
}

function filterJobs(searchQuery, locationQuery, categoryQuery) {
  const search = searchQuery.toLowerCase();
  const location = locationQuery.toLowerCase();
  const jobCategory = categoryQuery.toLowerCase();

  const filteredJobs = jobDetails.jobs.filter(job => {
    const jobTitleMatch = job.job.toLowerCase().includes(search);
    const locationMatch = job.location.toLowerCase().includes(location);
    const categoryMatch = job.jobCategory && job.jobCategory.toLowerCase().includes(jobCategory); // Check if category exists before accessing it
    return jobTitleMatch && locationMatch && (!jobCategory || categoryMatch); // Only check categoryMatch if category is provided
  });

  return filteredJobs;
}

// Simulate saving the email to a database
function saveToDatabase(email) {
  return new Promise((resolve) => {
    // Save the email to the database (replace with your actual database logic)
    // For example, using a MongoDB connection:
    // const collection = db.collection('subscribers');
    // collection.insertOne({ email }, (error) => {
    //   if (error) {
    //     reject(error);
    //   } else {
    //     resolve();
    //   }
    // });
    resolve(); // Placeholder resolve
  });
}
// Simulate sending a confirmation email
function sendConfirmationEmail(email) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: 'JobQuest <paledi.egnitius@capaciti.org.za>',
      to: email,
      subject: 'Subscription Confirmation',
      text: 'Thank you for subscribing to our job notifications!',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

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

