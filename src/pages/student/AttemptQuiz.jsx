import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api.js";
import { toast } from "react-toastify";

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");
        const quizResponse = await api.get(`/quizzes/${quizId}`);
        console.log("Quiz Response:", quizResponse.data);
        if (quizResponse.data.success) {
          const quizData = quizResponse.data.data || quizResponse.data.quiz;
          setQuiz(quizData);
        } else {
          setError( quizResponse.data.message || "Failed to load quiz.");
          return;
        }
        const questionsResponse = await api.get(`/questions/quiz/${quizId}`);
        console.log("Questions Response:",questionsResponse.data);
        if (questionsResponse.data.success) {
          const questionData =questionsResponse.data.data || questionsResponse.data.questions || [];
          setQuestions(questionData);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Error fetching quiz:",err);
        setError( err.response?.data?.message || "Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (loading || questions.length === 0 || submitting) {
      return;
    }
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
        setTimeLeft((previousTime) => previousTime - 1);
      }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, loading, questions.length, submitting,]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleOptionClick = (option) => {
    setSelectedAnswers(
      (previousAnswers) => ({
        ...previousAnswers,
        [currentQuestion]: option,
      })
    );
  };
  const handleNext = () => {
    if ( currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };
  const handleSubmit = async () => {
    if (submitting) {
      return;
    }
    try {
      setSubmitting(true);
      console.log("Selected Answers:", selectedAnswers);
      const response = await api.post("/attempt-quiz",{
        quizId: Number(quizId),
        answers: selectedAnswers,
      });
      console.log("Attempt Response:",response.data);
      if (response.data.success) {
        const resultData = response.data.data;
        const score = resultData.score;
        const totalMarks = resultData.totalMarks;
        const percentage = resultData.percentage;
        const resultId = resultData.resultId;
        toast.success(`Quiz Submitted! Score: ${score}/${totalMarks} (${percentage}%)`);
        if (resultId) {
          navigate(`/student/result/${resultId}`);
        } else {
          navigate("/student/dashboard");
        }
      }
    } catch (err) {
      console.error("Submit Quiz Error:",err);
      toast.error(err.response?.data?.message ||"Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4">
            </div>
            <p className="text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Quiz</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Questions Found</h2>
            <p className="text-gray-600 mb-6">This quiz does not contain any questions yet.</p>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  const question = questions[currentQuestion];
  const options = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">{quiz?.title || "Quiz"}</h1>
              {quiz?.description && (
                <p className="text-gray-600 mt-2">{quiz.description}</p>
              )}
            </div>
            {/* Timer */}
            <div
              className={`px-5 py-2 rounded-lg text-xl font-bold whitespace-nowrap
                ${
                  timeLeft <= 60
                    ? "bg-red-600 text-white"
                    : "bg-blue-600 text-white"
                }
              `}
            >
              ⏰ {formatTime()}
            </div>
          </div>
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Question{" "}
                {currentQuestion + 1}
                {" "}of{" "}
                {questions.length}
              </span>
              <span>
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className=" bg-blue-600 h-2 rounded-full transition-all"
                style={{width: `${((currentQuestion + 1) /questions.length) * 100 }%`,}}
              ></div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-6">{question.question}</h2>
            <div className="space-y-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className={` w-full text-left p-4 rounded-lg border transition
                      ${
                        selectedAnswers[currentQuestion] === option ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-300 hover:bg-blue-100"
                      }
                    `}
                  >
                    <span className="font-semibold mr-3">
                      {String.fromCharCode( 65 + index)}
                      .
                    </span>
                    {option}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="flex justify-between mt-10">
            {/* Previous */}
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || submitting}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg"
            >
              Previous
            </button>
            {/* Next / Submit */}
            {currentQuestion ===
            questions.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttemptQuiz;