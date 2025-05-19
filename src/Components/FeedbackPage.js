import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function FeedbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, code,studentId } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});
  const [missingAnswers, setMissingAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const options = [
    { emoji: "😍", label: "Very Good", color: "green" },
    { emoji: "😊", label: "Good", color: "blue" },
    { emoji: "😐", label: "Medium", color: "yellow" },
    { emoji: "😟", label: "Bad", color: "red" },
    { emoji: "😭", label: "Very Bad", color: "dark" },
  ];

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("https://support.ansar.in/api/feedbackquestionlist/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const handleSelect = (questionId, optionLabel) => {
    setResponses((prev) => ({ ...prev, [questionId]: optionLabel }));
    setMissingAnswers((prev) => prev.filter((id) => id !== questionId));
  };

  const handleSubmit = async () => {
    const unanswered = questions
      .map((q) => q.id)
      .filter((id) => !responses.hasOwnProperty(id));

    if (unanswered.length > 0) {
      setMissingAnswers(unanswered);
      return;
    }

    const feedbackPayload = questions.map((q) => ({
      student: studentId, // Ensure code is the student ID here
      question: q.id,
      answer: responses[q.id],
    }));

    try {
      const response = await fetch("https://support.ansar.in/api/submitfeedback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackPayload),
      });

      if (!response.ok) {
        let errorText = await response.text();

        // Sometimes backend returns HTML error page - show that text in alert for debugging
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || JSON.stringify(errorData));
        } catch {
          throw new Error(errorText);
        }
      }

      setShowModal(true);
    } catch (err) {
      alert(`Error submitting feedback: ${err.message}`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleBack = () => {
    navigate("/", { state: { name, code } });
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>Error loading questions: {error}</p>;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="feedbackcontainer p-4 bg-white rounded shadow">
        <h2 className="text-center mb-3">Feedback Form</h2>
        <p className="text-center fw-bold mb-4">
          Student: {name} | Code: {code}
        </p>

        {questions.map((question, index) => (
          <div key={question.id} className="mb-5">
            <p className="mb-2">
              {index + 1}. {question.question_text}
            </p>
            <div className="d-flex gap-2 flex-wrap">
              {options.map((option, idx) => {
                const isActive = responses[question.id] === option.label;
                const btnClass = isActive ? `${option.color} active` : "default";

                return (
                  <label
                    key={idx}
                    className={`btn ${btnClass}`}
                    onClick={() => handleSelect(question.id, option.label)}
                    style={{ cursor: "pointer" }}
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
            {missingAnswers.includes(question.id) && (
              <div className="text-danger small">
                Please select an option for this question.
              </div>
            )}
          </div>
        ))}

        <div className="button-group mt-4 d-flex justify-content-between">
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
