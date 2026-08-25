
import {
  FaHome,
  FaEye,
  FaPlusCircle,
  FaQuestionCircle,
  FaUserGraduate,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-64 min-h-screen bg-slate-800 text-white p-6">

      <h2 className="text-2xl font-bold mb-8 text-yellow-400">
        Instructor
      </h2>

      <ul className="space-y-5">

        <li 
        onClick={() => navigate("/teacher/dashboard")}
        className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
          <FaHome />
          Dashboard
        </li>

        <li 
        onClick={() => navigate("/teacher/Quizzes")}
        className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
          <FaEye/>
          All Quizzes
        </li>

        <li 
        onClick={() => navigate("/teacher/create-quiz")}
        className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
          <FaPlusCircle />
          Create Quiz
        </li>

        <li 
        onClick={() => navigate("/teacher/all-questions")}
        className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
          <FaEye/>
          All Questions
        </li>

        <li 
        onClick={() => navigate("/teacher/add-questions")}
        className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
          <FaQuestionCircle />
          Add Questions
        </li>

        <li 
        onClick={() => navigate("/teacher/assign-quiz")}
        className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
          <FaUserGraduate />
          Assign Quiz
        </li>

        <li 
        onClick={() => navigate("/teacher/quiz-attempts")}
        className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
          <FaClipboardList />
          Quiz Attempts
        </li>

        <li 
        onClick={() => navigate("/teacher/quiz-results")}
        className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
          <FaChartBar />
          Quiz Results
        </li>

        <li 
        onClick={() => navigate("/")}
        className="flex items-center gap-3 hover:text-red-400 cursor-pointer mt-16">
          <FaSignOutAlt />
          Logout
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;