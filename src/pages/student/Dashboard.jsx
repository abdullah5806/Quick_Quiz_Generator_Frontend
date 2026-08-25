import api from "../../services/api.js"
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const Navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    studentName: "", 
    totalassignQuizzes: 0,
    totalAttempts: 0,
    totalResults: 0,
    assignQuizzes: [],
    recentResults: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get("/student/dashboard");
        console.log(res.data.data);
        setDashboard(res.data.data);
      } 
      catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);
  if(loading){
    return(
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-xl text-gray-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />
      <main className="p-8 flex-1">
        <div className="flex flex-cols">
          <h1 className="text-4xl font-bold text-gray-800">
            Student Dashboard 
            <p className="text-gray-600 mt-3 text-lg font-light">
              Welcome back {dashboard.studentName}!
            </p>
          </h1>
          <button
          onClick={() => Navigate("/")}
          className="ml-209 bg-blue-500 text-white w-30 h-9 rounded-xl hover:bg-blue-800 "
          >
            Logout
          </button>
        </div>
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <DashboardCard
            title="Available Quizzes"
            value={dashboard.totalAssignQuizzes}
          />
          <DashboardCard
            title="Completed Quizzes"
            value={dashboard.totalAttempts}
          />
          <DashboardCard
            title="Results"
            value={dashboard.totalResults}
          />
        </div>
        {/* Assigned Quizzes */}
        <div className="bg-white rounded-xl shadow-lg mt-10 p-6">
          <h2 className="text-2xl font-semibold mb-4">
            My Assigned Quizzes
          </h2>

          {dashboard.assignQuizzes.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No quizzes have been assigned to you.</p>
            </div>
          ) : 
          (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-left">Quiz ID</th>
                    <th className="p-4 text-left">Quiz</th>
                    <th className="p-4 text-center">Duration</th>
                    <th className="p-4 text-center">Teacher</th>
                    <th className="p-4 text-center">Assigned At</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.assignQuizzes.map((assignedQuiz) => (
                    <tr
                      key={assignedQuiz.id}
                      className="border-b hover:bg-gray-100"
                    >
                      <td className="p-4">{assignedQuiz.quiz.id}</td>
                      <td className="p-4 font-medium">{assignedQuiz.quiz.title}</td>
                      <td className="p-4 text-center">{assignedQuiz.quiz.duration} Min</td>
                      <td className="p-4 text-center">{assignedQuiz.quiz.teacher?.name || "N/A"}</td>
                      <td className="p-4 text-center">{new Date(assignedQuiz.assignedAt).toLocaleDateString()}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => Navigate(`/student/attempt-quiz/${assignedQuiz.quiz.id}`)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          Start
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Recent Results */}
        <div className="bg-white rounded-xl shadow-lg mt-10 p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Recent Results
          </h2>
          {dashboard.recentResults.length === 0 ? 
            (
              <div className="text-center py-10 text-gray-500">
                <p>No results available.</p>
              </div>
            ) : 
            (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="p-4 text-left">Quiz</th>
                      <th className="p-4 text-center">Marks</th>
                      <th className="p-4 text-center">Percentage</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recentResults.map((result) => {
                      const totalMarks = result.totalMarks || 0;
                      console.log("Total Marks:", totalMarks);
                      const percentage = totalMarks > 0 ? Math.round((result.score / totalMarks) * 100) : 0;
                      const status = percentage >= 50 ? "Pass" : "Fail";
                      return (
                        <tr key={result.id} className="border-b hover:bg-gray-100">
                          <td className="p-4">{result.quiz.title}</td>
                          <td className="p-4 text-center">{result.score} / {totalMarks}</td>
                          <td className="p-4 text-center">{percentage}%</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-white ${status === "Pass" ? "bg-green-600" : "bg-red-600"}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </main>
    </div>
  );
};

export default Dashboard;