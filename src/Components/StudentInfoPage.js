import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeedBack.css";
import logo from "./Images/Ansar.png";

function StudentInfoPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (name && code) {
      // Submit student data to the Django API
      const studentData = { name, student_id: code };
      fetch("https://support.ansar.in/api/feedbacklogin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.id) {
            // If the student is successfully logged in, navigate to the feedback page
            navigate("/feedback", { state: { name, code, studentId: data.id } });
          } else {
            alert("Error: Unable to login student.");
          }
        })
        .catch((error) => {
          console.error("Error logging in student:", error.message);
          alert("Error logging in. Please try again.");
        });
    } else {
      alert("Please enter student details!");
    }
  };

  return (
    <div className="feedback-container">
      {/* Logo */}
      <img src={logo} alt="Logo" className="logo" />

      {/* Main Heading */}
      <h1 className="ansar-heading">ANSAR</h1>

      {/* Subheading */}
      <h2 className="student-feedback">Student Feedback</h2>

      {/* Form */}
      <form className="form">
        <div className="input-group">
          <input
            type="text"
            className="input-field"
            placeholder="Enter Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Enter Student Id"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* Next Button */}
        <button type="button" className="submit-btn" onClick={handleNext}>
          Next →
        </button>
      </form>
    </div>
  );
}

export default StudentInfoPage;
