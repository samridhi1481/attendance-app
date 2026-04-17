// Common utility functions (optional)

// Clear all data (for testing)
function logout() {
  localStorage.clear();
  window.location.href = "code.html";
}

// Check login globally (can be reused)
function checkLogin() {
  const email = localStorage.getItem("userEmail");

  if (!email) {
    alert("Please login first ❌");
    window.location.href = "login.html";
  }
}