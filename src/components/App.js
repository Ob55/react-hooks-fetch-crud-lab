import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState("List");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  };

  const handleCreateQuestion = (newQuestion) => {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create question");
        }
        return response.json();
      })
      .then((createdQuestion) => {
        setQuestions((prevQuestions) => [...prevQuestions, createdQuestion]);
        setPage("List");
      })
      .catch((error) => console.error("Error creating question:", error));
  };

  const handleDeleteQuestion = (questionId) => {
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setQuestions(questions.filter((question) => question.id !== questionId));
        } else {
          console.error("Failed to delete question");
        }
      })
      .catch((error) => console.error("Error deleting question:", error));
  };

  const handleUpdateQuestion = (questionId, updatedQuestionData) => {
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQuestionData),
    })
      .then((response) => {
        if (response.ok) {
          const updatedQuestions = questions.map((question) =>
            question.id === questionId ? { ...question, ...updatedQuestionData } : question
          );
          setQuestions(updatedQuestions);
        } else {
          console.error("Failed to update question");
        }
      })
      .catch((error) => console.error("Error updating question:", error));
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onCreateQuestion={handleCreateQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;
