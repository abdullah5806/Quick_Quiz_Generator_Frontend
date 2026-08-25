import { BrowserRouter, Routes, Route } from "react-router-dom";
// Authentication Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
// Teacher Pages
import Dashboard from "./pages/teacher/Dashboard";
import AllQuizzes from "./pages/teacher/AllQuizzes"
import CreateQuiz from "./pages/teacher/CreateQuiz";
import UpdateQuiz from "./pages/teacher/UpdateQuiz";
import AllQuestions from "./pages/teacher/AllQuestions";
import UpdateQuestion from "./pages/teacher/UpdateQuestion";
import AddQuestions from "./pages/teacher/AddQuestions";
import AssignQuiz from "./pages/teacher/AssignQuiz";
import QuizAttempts from "./pages/teacher/QuizAttempts";
import QuizResults from "./pages/teacher/QuizResults";
// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import AvailableQuiz from "./pages/student/AvailableQuiz";
import AttemptQuiz from "./pages/student/AttemptQuiz";
import Result from "./pages/student/Result";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<Dashboard />} />
        <Route path="/teacher/quizzes" element={<AllQuizzes/>} />
        <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
        <Route path="/teacher/all-questions" element={<AllQuestions/>} />
        <Route path="/teacher/update-quiz/:id" element={<UpdateQuiz />}/>
        <Route path="/teacher/update-question/:id" element={<UpdateQuestion />} />
        <Route path="/teacher/add-questions" element={<AddQuestions />} />
        <Route path="/teacher/assign-quiz" element={<AssignQuiz />} />
        <Route path="/teacher/quiz-attempts" element={<QuizAttempts />} />
        <Route path="/teacher/quiz-results" element={<QuizResults />} />
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/available-quizzes" element={<AvailableQuiz />} />
        <Route path="/student/attempt-quiz/:quizId" element={<AttemptQuiz />} />
        <Route path="/student/result/:id" element={<Result />} />
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;