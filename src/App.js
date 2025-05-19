import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import StudentInfoPage from "./Components/StudentInfoPage";
import FeedbackPage from "./Components/FeedbackPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentInfoPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
    </Routes>
  );
}

export default App;
