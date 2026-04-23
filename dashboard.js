import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔐 Protect page
if (!localStorage.getItem("codeVerified")) {
  window.location.href = "login.html";
}

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "attendance-system-7f3cd.firebaseapp.com",
  projectId: "attendance-system-7f3cd",
  storageBucket: "attendance-system-7f3cd.firebasestorage.app",
  messagingSenderId: "18776101759",
  appId: "1:18776101759:web:4929ec79951dc5be5ac04a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ LOAD STUDENT
async function loadStudent() {
  let email = localStorage.getItem("userEmail");

  if (!email) {
    alert("Login required");
    window.location.href = "login.html";
    return;
  }

  email = email.trim().toLowerCase();

  const snapshot = await getDocs(collection(db, "students"));

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (
      data.email &&
      data.email.trim().toLowerCase() === email
    ) {
      document.getElementById("name").innerText = data.name;
      document.getElementById("attendance").innerText =
        "Attendance: " + data.attendance;
      document.getElementById("total").innerText =
        "Total Classes: " + data.totalClasses;

      const percent =
        (data.attendance / data.totalClasses) * 100;

      document.getElementById("percent").innerText =
        "Percentage: " + percent.toFixed(2) + "%";
    }
  });
}

// ✅ MARK ATTENDANCE (ONLY IF OPEN)
window.markAttendance = async function () {
  const ref = doc(db, "settings", "attendanceControl");
  const snap = await getDoc(ref);

  if (!snap.exists() || !snap.data().isAttendanceOpen) {
    alert("Attendance is CLOSED ❌");
    return;
  }

  let email = localStorage.getItem("userEmail");
  email = email.trim().toLowerCase();

  const snapshot = await getDocs(collection(db, "students"));

  snapshot.forEach(async (docSnap) => {
    const data = docSnap.data();

    if (
      data.email &&
      data.email.trim().toLowerCase() === email
    ) {
      await updateDoc(doc(db, "students", docSnap.id), {
        attendance: (data.attendance || 0) + 1
      });
    }
  });

  alert("Attendance marked ✅");
  loadStudent();
};

// ✅ TEACHER TOGGLE
window.toggleAttendance = async function () {
  const ref = doc(db, "settings", "attendanceControl");
  const snap = await getDoc(ref);

  const current = snap.data().isAttendanceOpen;

  if (!current) {
    const snapshot = await getDocs(collection(db, "students"));

    snapshot.forEach(async (docSnap) => {
      const data = docSnap.data();

      await updateDoc(doc(db, "students", docSnap.id), {
        totalClasses: (data.totalClasses || 0) + 1
      });
    });
  }

  await updateDoc(ref, {
    isAttendanceOpen: !current
  });

  alert("Attendance is now " + (!current ? "OPEN ✅" : "CLOSED ❌"));
};

// ✅ LOGOUT
window.logout = function () {
  localStorage.clear();
  window.location.href = "login.html";
};

// 🚀 START
loadStudent();