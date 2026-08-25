import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import { toast } from "react-toastify";

const QuizResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await api.get("/results");
        console.log("Teacher Results API Response:", res.data);
        if (res.data.success) {
          setResults(res.data.data || []);
        } else {
          toast.error(res.data.message || "Failed to fetch quiz results");
        }
      } catch (error) {
        console.error("Error fetching quiz results:", error);
        toast.error(error.response?.data?.message ||"Failed to fetch quiz results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const getTotalMarks = (quiz) => {
    if (!quiz?.questions) {
      return 0;
    }
    return quiz.questions.reduce(
      (total, question) =>
        total + Number(question.marks || 0),
      0
    );
  };

  const getPercentage = (score, totalMarks) => {
    if (!totalMarks) {
      return 0;
    }
    return Math.round((Number(score) / totalMarks) * 100);
  };

  const getResultStatus = (percentage) => {
    return percentage >= 50 ? "Pass" : "Fail";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <p className="text-xl text-gray-600">
              Loading quiz results...
            </p>
          </main>
        </div>
      </div>
    );
  }

  const passedStudents = results.filter((item) => {
    const totalMarks = getTotalMarks(item.quiz);
    const percentage = getPercentage(
      item.score,
      totalMarks
    );
    return percentage >= 50;
  }).length;

  const failedStudents = results.filter((item) => {
    const totalMarks = getTotalMarks(item.quiz);
    const percentage = getPercentage(
      item.score,
      totalMarks
    );
    return percentage < 50;
  }).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-gray-800">Quiz Results</h1>
          <p className="text-gray-600 mt-2">View the performance of students who attempted your quizzes.</p>
          {/* Results Table */}
          <div className="bg-white rounded-xl shadow-lg mt-8 overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Student</th>
                  <th className="p-4 text-left">Quiz</th>
                  <th className="p-4 text-center">Marks</th>
                  <th className="p-4 text-center">Total</th>
                  <th className="p-4 text-center">Percentage</th>
                  <th className="p-4 text-center">Result</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((item, index) => {
                    const totalMarks = getTotalMarks(item.quiz);
                    const percentage =getPercentage(
                        item.score,
                        totalMarks
                      );
                    const status = getResultStatus(percentage);
                    return (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-100"
                      >
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold">{item.student?.name || "N/A"}</p>
                            <p className="text-sm text-gray-500">{item.student?.email || ""}</p>
                          </div>
                        </td>
                        <td className="p-4">{item.quiz?.title || "N/A"}</td>
                        <td className="p-4 text-center font-semibold">{item.score}</td>
                        <td className="p-4 text-center">{totalMarks}</td>
                        <td className="p-4 text-center text-blue-600 font-semibold">{percentage}%</td>
                        <td className="p-4 text-center">
                          <span className={`px-4 py-1 rounded-full text-white text-sm ${ status === "Pass" ? "bg-green-600" : "bg-red-600"}`} >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">No quiz results found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-600">Total Results</h2>
              <p className="text-4xl font-bold text-blue-600 mt-3">{results.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-600">Passed Students</h2>
              <p className="text-4xl font-bold text-green-600 mt-3">{passedStudents}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-600">Failed Students</h2>
              <p className="text-4xl font-bold text-red-600 mt-3">{failedStudents}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizResults;