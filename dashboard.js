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
  window.location.href = "code.html";
}

const firebaseConfig = {
  apiKey: "AIzaSyA573c_VwuMo3owaD8bkwoXOLKzr3lJhVA",
  authDomain: "attendance-system-7f3cd.firebaseapp.com",
  projectId: "attendance-system-7f3cd",
  storageBucket: "attendance-system-7f3cd.firebasestorage.app",
  messagingSenderId: "18776101759",
  appId: "1:18776101759:web:4929ec79951dc5be5ac04a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ LOAD STUDENT (FIXED)
async function loadStudent() {
  const email = localStorage.getItem("userEmail");

  if (!email) {
    alert("Login required");
    window.location.href = "login.html";
    return;
  }

  const studentsRef = collection(db, "students");
  const snapshot = await getDocs(studentsRef);

  let studentData = null;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (
      data.email &&
      data.email.trim().toLowerCase() === email.trim().toLowerCase()
    ) {
      studentData = data;
    }
  });

  if (!studentData) {
    alert("Student not found ❌");
    return;
  }

  // ✅ SHOW DATA
  document.getElementById("name").innerText =
    studentData.name || "No Name";

  document.getElementById("attendance").innerText =
    "Attendance: " + (studentData.attendance || 0);

  document.getElementById("total").innerText =
    "Total Classes: " + (studentData.totalClasses || 0);

  const percent =
    ((studentData.attendance || 0) /
      (studentData.totalClasses || 1)) * 100;

  document.getElementById("percent").innerText =
    "Percentage: " + percent.toFixed(2) + "%";
}

// ✅ MARK ATTENDANCE
window.markAttendance = async function () {
  const email = localStorage.getItem("userEmail");

  const studentsRef = collection(db, "students");
  const snapshot = await getDocs(studentsRef);

  snapshot.forEach(async (docSnap) => {
    const data = docSnap.data();

    if (data.email === email) {
      await updateDoc(doc(db, "students", docSnap.id), {
        attendance: (data.attendance || 0) + 1
      });

      alert("Attendance marked ✅");
      loadStudent();
    }
  });
};

// ✅ TOGGLE ATTENDANCE
window.toggleAttendance = async function () {
  const ref = doc(db, "settings", "attendanceControl");
  const snap = await getDoc(ref);

  const current = snap.data().isAttendanceOpen;

  if (!current) {
    const studentsRef = collection(db, "students");
    const snapshot = await getDocs(studentsRef);

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

// 🚀 LOAD ON START
loadStudent();