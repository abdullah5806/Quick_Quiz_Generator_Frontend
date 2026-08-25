import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const QuizAttempts = () => {
  const [quizAttempts, setQuizAttempts] = useState({
    attempts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/attempt-quiz/attempts");
        console.log("Attempts API Response:", res.data);
        if (res.data.success) {
          // Backend returns data as an array → wrap it
          setQuizAttempts({ attempts: res.data.data || [] });
        } else {
          setError(res.data.message || "Failed to fetch attempts");
        }
      } catch (err) {
        console.error("Error Fetching attempts:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-gray-800">Quiz Attempts</h1>
          <p className="text-gray-600 mt-2">Monitor students attempting quizzes.</p>
          <div className="bg-white shadow-lg rounded-xl mt-8 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading attempts...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-left">Student Id</th>
                    <th className="p-4 text-left">Student Name</th>
                    <th className="p-4 text-left">Quiz Title</th>
                    <th className="p-4 text-center">Attempted At</th>
                  </tr>
                </thead>
                <tbody>
                  {quizAttempts.attempts.length > 0 ? (
                    quizAttempts.attempts.map((attempt) => (
                      <tr key={attempt.id} className="border-b hover:bg-gray-100">
                        <td className="p-3">{attempt.user?.id ?? "-"}</td>
                        <td className="p-3">{attempt.user?.name ?? "-"}</td>
                        <td className="p-3">{attempt.quiz?.title ?? "-"}</td>
                        <td className="p-3 text-center">
                          {attempt.attemptedAt
                            ? new Date(attempt.attemptedAt).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-gray-500">
                        No quiz attempts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizAttempts;