import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/results/${id}`);
        console.log("Result API response:", res.data);
        if (res.data.success) {
          setResult(res.data.data);
        } else {
          toast.error(res.data.message || "Failed to load result");
        }
      } 
      catch (err) {
        console.error("Error Fetching Result", err);
        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if(id) { 
      fetchResult();
    } else{
      setLoading(false);
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl">Loading result...</p>
      </div>
    );
  }
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Result not found</p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = result.quiz?.questions?.length || 0;
  const totalMarks = result.quiz?.questions?.reduce(
    (total, question) => total + Number(question.marks || 0),
    0 
  ) || 0;
  const obtainedMarks = Number(result.score || 0);
  const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
  const status = percentage >= 50 ? "Pass" : "Fail";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-5xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center text-blue-600">Quiz Result</h1>
          <p className="text-center text-gray-600 mt-2">Congratulations! Here is your quiz performance.</p>
          {/* Student & Quiz Info */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-10">
            <div className="bg-gray-100 rounded-lg p-5">
              <h3 className="font-semibold text-gray-600">Student Name</h3>
              <p className="text-2xl font-bold mt-2">{result.student?.name || "N/A"}</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-5">
              <h3 className="font-semibold text-gray-600">Quiz Title</h3>
              <p className="text-2xl font-bold mt-2">{result.quiz?.title || "N/A"}</p>
            </div>
          </div>

          {/* Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* Obtained Marks */}
            <div className="bg-green-100 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold">Obtained Marks</h3>
              <p className="text-5xl font-bold text-green-700 mt-4">{obtainedMarks}</p>
            </div>
            {/* Total Marks */}
            <div className="bg-blue-100 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold">Total Marks</h3>
              <p className="text-5xl font-bold text-blue-700 mt-4">{totalMarks}</p>
            </div>
            {/* Percentage */}
            <div className="bg-purple-100 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold">Percentage</h3>
              <p className="text-5xl font-bold text-purple-700 mt-4">{percentage}%</p>
            </div>
          </div>

          {/* Marks Summary */}
          <div className="bg-gray-50 rounded-xl p-8 mt-10">
            <h2 className="text-2xl font-bold mb-6">Marks Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Total Questions</span>
                <span>{totalQuestions}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Obtained Marks</span>
                <span>{obtainedMarks}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Total Marks</span>
                <span>{totalMarks}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Status</span>
                <span
                  className={
                    status === "Pass" ? "text-green-600" : "text-red-600"
                  }
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Bar */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-3">Performance</h2>
            <div className="w-full bg-gray-300 rounded-full h-6">
              <div
                className="bg-blue-600 h-6 rounded-full text-white text-center text-sm leading-6"
                style={{ width: `${Math.min(percentage,100)}%` }}
              >
                {percentage}%
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <button
              onClick={() => navigate(`/student/attempt-quiz/${result.quizId}`)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
            >
              Attempt Again
            </button>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Result;