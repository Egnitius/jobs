// Notifications
var box  = document.getElementById('box');
var down = false;

// Hide the box when the page loads
box.style.height = '0px';
box.style.opacity = 0;

function toggleNotifi(){
	if (down) {
		box.style.height  = '0px';
		box.style.opacity = 0;
		down = false;
	}else {
		box.style.height  = '510px';
		box.style.opacity = 1;
		down = true;
	}
}

// function handleSignUp(event) {
//     event.preventDefault(); // Prevent the default form submission
  
//     // Get the form inputs
//     var username = document.getElementById('username').value;
//     var email = document.getElementById('email').value;
//     var password = document.getElementById('password').value;
  
//     // Perform the sign-up logic, e.g., send an AJAX request to your server
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', '/signup');
//     xhr.setRequestHeader('Content-Type', 'application/json');
  
//     xhr.onreadystatechange = function() {
//       if (xhr.readyState === XMLHttpRequest.DONE) {
//         if (xhr.status === 200) {
//           // Sign-up successful
//           alert('Sign-up successful');
//           // Redirect to the next page
//           window.location.href = 'account.html';
//         } else {
//           // Error handling
//           alert('Sign-up failed');
//         }
//       }
//     };
  
//     const data = {
//       username: username,
//       email: email,
//       password: password
//     };
  
//     xhr.send(JSON.stringify(data));
  
//     // Clear the form inputs
//     document.getElementById('username').value = '';
//     document.getElementById('email').value = '';
//     document.getElementById('password').value = '';
//   }
  
//   var signupForm = document.getElementById('signup-form');
//   signupForm.addEventListener('submit', handleSignUp);
  
