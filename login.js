import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyA573c_VwuMo3owaD8bkwoXOLKzr3lJhVA",
  authDomain: "attendance-system-7f3cd.firebaseapp.com",
  projectId: "attendance-system-7f3cd",
  storageBucket: "attendance-system-7f3cd.firebasestorage.app",
  messagingSenderId: "18776101759",
  appId: "1:18776101759:web:4929ec79951dc5be5ac04a"
};

initializeApp(firebaseConfig);

window.login = function () {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Enter email");
    return;
  }

  // ✅ store email
  localStorage.setItem("studentEmail", email);

  alert("Login successful ✅");

  // ✅ go to dashboard
  window.location.href = "dashboard.html";
};