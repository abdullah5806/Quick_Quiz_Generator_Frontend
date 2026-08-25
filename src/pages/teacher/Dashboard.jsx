import api from "../../services/api.js";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import DashboardCard from "../../components/DashboardCard";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    teacherName: "",
    totalQuizzes: 0,
    totalStudents: 0,
    totalAttempts: 0,
    recentQuizzes: [],
    recentAttempts: [],
    students: [],
    quizzes: [],
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStudent = searchParams.get("studentName") || "";
  const selectedQuiz = searchParams.get("quizName") || "";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/teacher/dashboard", {
          params: {
            studentName: selectedStudent || undefined,
            quizName: selectedQuiz || undefined,
          },
        });
        console.log("API Response:", res.data);
        if (res.data.success) {
          setDashboard(res.data.data);
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };
    fetchDashboard();
  }, [selectedStudent, selectedQuiz]);
  
  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Dashboard Heading */}
          <h1 className="text-4xl font-bold text-gray-800">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {dashboard.teacherName}!</p>
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <DashboardCard
              title="Total Quizzes"
              value={dashboard.totalQuizzes}
            />
            <DashboardCard
              title="Total Students"
              value={dashboard.totalStudents}
            />
            <DashboardCard
              title="Quiz Attempts"
              value={dashboard.totalAttempts}
            />
          </div>
          {/* Recent Quizzes */}
          <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Quizzes</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-500">
                  <th className="p-3 text-left">Quiz Id</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentQuizzes.length > 0 ? (
                  dashboard.recentQuizzes.map((quiz) => (
                    <tr key={quiz.id} className="border-b">
                      <td className="p-3">{quiz.id}</td>
                      <td className="p-3">{quiz.title}</td>
                      <td className="p-3">{quiz.description}</td>
                      <td className="p-3">
                        {new Date(
                          quiz.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-4 text-center text-gray-500"
                    >
                      No quizzes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Recent Attempts */}
          <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <h2 className="text-2xl font-semibold">
                Recent Attempts
              </h2>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Student Filter */}
                <select
                  className="border rounded-xl"
                  value={selectedStudent}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchParams((params) => {
                      if (value) {
                        params.set("studentId", value);
                      } else {
                        params.delete("studentId");
                      }
                      return params;
                    });
                  }}
                >
                  <option value="">All Students</option>
                  {dashboard.students.map((student) => (
                    <option
                      key={student.id}
                      value={student.name}
                    >
                      {student.name}
                    </option>
                  ))}
                </select>
                {/* Quiz Filter */}
                <select
                  className="border rounded-xl"
                  value={selectedQuiz}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchParams((params) => {
                      if (value) {
                        params.set("quizId", value);
                      } else {
                        params.delete("quizId");
                      }
                      return params;
                    });
                  }}
                >
                  <option value="">All Quizzes</option>
                  {dashboard.quizzes.map((quiz) => (
                    <option
                      key={quiz.id}
                      value={quiz.title}
                    >
                      {quiz.title}
                    </option>
                  ))}
                </select>
                {/* Clear Button */}
                <button
                  onClick={handleClearFilters}
                  className="bg-gray-600 text-white w-20 h-10 rounded-lg hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
            </div>
            {/* Attempts Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-500">
                  <th className="p-3 text-left">Student Id</th>
                  <th className="p-3 text-left">Student Name</th>
                  <th className="p-3 text-left">Quiz Title</th>
                  <th className="p-3 text-left">Attempt At</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentAttempts.length > 0 ? (
                  dashboard.recentAttempts.map((attempt) => (
                    <tr
                      key={attempt.id}
                      className="border-b"
                    >
                      <td className="p-3">{attempt.user.id}</td>
                      <td className="p-3">{attempt.user.name}</td>
                      <td className="p-3">{attempt.quiz.title}</td>
                      <td className="p-3">{new Date(attempt.attemptedAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-4 text-center text-gray-500"
                    >
                      No attempts found for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;