import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function FeedbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, code,studentId } = location.state || {};

 

  const options = [
    { emoji: "😍", label: "Very Good", color: "green" },
    { emoji: "😊", label: "Good", color: "blue" },
    { emoji: "😐", label: "Medium", color: "yellow" },
    { emoji: "😟", label: "Bad", color: "red" },
    { emoji: "😭", label: "Very Bad", color: "dark" },
  ];
  const [responses, setResponses] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (questionIndex, optionLabel) => {
    setResponses((prev) => ({ ...prev, [questionIndex]: optionLabel }));
  };

  const handleSubmit = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleBack = () => {
    // Passing the current name and code back to the Student Info page
    navigate("/", { state: { name, code } });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="feedbackcontainer p-4 bg-white rounded shadow">
        <h2 className="text-center mb-3">Feedback Form</h2>
        <p className="text-center fw-bold mb-4">
          Student: {name} | Code: {code}
        </p>

        {questions.map((question, index) => (
          <div key={index} className="mb-5">
            <p className="mb-2">
              {index + 1}. {question}
            </p>
            <div className="d-flex gap-2 flex-wrap">
              {options.map((option, idx) => {
                const isActive = responses[index] === option.label;
                const btnClass = isActive
                  ? `${option.color} active`
                  : "default";

        return (
          <label
            key={idx}
            className={`btn ${btnClass}`}
            onClick={() => handleSelect(question.id, option.label)}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.label}
              checked={isActive}
              onChange={() => handleSelect(question.id, option.label)}
              className="me-1"
            />
            {option.emoji} {option.label}
          </label>
        );
      })}
            </div>
            {missingAnswers.includes(index) && (
              <div className="text-danger small">
                Please select an option for this question.
              </div>
            )}
          </div>
        ))}

        <div className="button-group mt-4">
          <button className="backbtn" onClick={handleBack}>
            ← Back
          </button>
          <button className="feedbtn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
              </div>
              <div className="modal-body">
                <p>Feedback Successfully Submitted!</p>
              </div>
              <div className="modal-footer">
                <button className="btn-footer" onClick={handleModalClose}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
