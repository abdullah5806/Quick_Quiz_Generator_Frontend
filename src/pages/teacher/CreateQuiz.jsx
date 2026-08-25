import api from "../../services/api.js"
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createQuizSchema } from "../../schemas/createQuizSchema.js";
const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: "",
    subject: "",
    description: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const {name, value} = e.target;
    setQuizData({
      ...quizData,
      [name]: value,
    });
    if(errors[name]){
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = createQuizSchema.safeParse(quizData);
    if(!result.success){
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({ 
        title: fieldErrors.title?.[0] || "", 
        subject: fieldErrors.subject?.[0] || "", 
        description: fieldErrors.description?.[0] || "", 
        duration: fieldErrors.duration?.[0] || "", 
        totalMarks: fieldErrors.totalMarks?.[0] || "", 
        passingMarks: fieldErrors.passingMarks?.[0] || "", 
      }); 
      return;
    }
    setErrors({});
    try {
      const res = await api.post("/quizzes", result.data);
      console.log(res.data);
      toast.success("Quiz Created Successfully!");
      console.log(res.data);
      setQuizData({
        title: "",
        subject: "",
        description: "",
        duration: "",
        totalMarks: "",
        passingMarks: "",
      });
    } 
    catch(error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to create Quiz"
      );
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Create Quiz
          </h1>
          <p className="text-gray-600 mt-2">
            Create a new quiz for your students.
          </p>
          <div className="bg-white shadow-lg rounded-xl p-8 mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quiz Title */}
              <div>
                <label className="block font-semibold mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Quiz Title"
                  value={quizData.title}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.title
                    ? "border border-red-500"
                    : "border border-black focus:border-blue-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title}
                  </p>
                )}
              </div>
              {/* Subject */}
              <div>
                <label className="block font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={quizData.subject}
                  onChange={handleChange}
                  placeholder="Enter Subject"
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.subject
                    ? "border border-red-500"
                    : "border border-black focus:border-blue-500"
                  }`}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subject}
                  </p>
                )}
              </div>
              {/* Description */}
              <div>
                <label className="block font-semibold mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  name="description"
                  value={quizData.description}
                  onChange={handleChange}
                  placeholder="Write quiz description..."
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.description
                    ? "border border-red-500"
                    : "border border-black focus:border-blue-500"
                  }`}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              {/* Duration */}
              <div>
                <label className="block font-semibold mb-2">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={quizData.duration}
                  onChange={handleChange}
                  placeholder="20"
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.duration
                    ? "border border-red-500"
                    : "border border-black focus:border-blue-500"
                  }`}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.duration}
                  </p>
                )}
              </div>
              {/* Total Marks */}
              <div>
                <label className="block font-semibold mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  name="totalMarks"
                  value={quizData.totalMarks}
                  onChange={handleChange}
                  placeholder="100"
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.totalMarks
                    ? "border border-red-500"
                    : "border border-black focus:border-blue-500"
                  }`}
                />
                {errors.totalMarks && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.totalMarks}
                  </p>
                )}
              </div>
              {/* Passing Marks */}
              <div>
                <label className="block font-semibold mb-2">
                  Passing Marks
                </label>
                <input
                  type="number"
                  name="passingMarks"
                  value={quizData.passingMarks}
                  onChange={handleChange}
                  placeholder="33"
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.passingMarks
                    ? "border border-red-500"
                    : "border border-black focus:border-blue-500"
                  }`}
                />
                {errors.passingMarks && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.passingMarks}
                  </p>
                )}
              </div>
              {/* Button */}
              <div>
                <button
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Submit Quiz
                </button>
                <button
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white ml-5 px-8 py-3 rounded-lg font-semibold transition"
                  onClick={() => navigate("/teacher/add-questions")}
                >
                  Add Questions
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateQuiz;