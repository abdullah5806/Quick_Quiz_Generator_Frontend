import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api.js";
import {toast} from "react-toastify"
import { addQuestionSchema } from "../../schemas/addQuestionSchema.js";

const AddQuestions = () => {
  const [quizId, setQuizId] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [marks, setMarks] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoding] = useState(false);
  

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
    const optionName = `option${String.fromCharCode(65 + index)}`;
    if (errors[optionName]) {
      setErrors({
        ...errors,
        [optionName]: "",
      });
    }
  };
  
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const formData = {
      quizId: quizId,
      question: question,
      optionA: options[0],
      optionB: options[1],
      optionC: options[2],
      optionD: options[3],
      correctAns: correctAnswer,
      marks: marks,
    };
    const result = addQuestionSchema.safeParse(formData);
    if(!result.success){
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoding(true);
    try {
      const res = await api.post("/questions", result.data);
      if(res.data.success){
        setQuestion((prev) => [...prev, res.data.data]);
        toast.success("Question Added Successufully");
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer("");
        setMarks("");
      }
    }
    catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        "Failed to add question"
      );
    }
    finally{
      setLoding(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Add Questions
          </h1>
          <p className="text-gray-600 mt-2">
            Create multiple-choice questions for your quiz.
          </p>
          <div className="bg-white mt-8 rounded-xl shadow-lg p-8">
            <form
              onSubmit={handleAddQuestion}
              className="space-y-6"
            >
              <div>
                <label className="block font-semibold mb-2">
                  Quiz ID
                </label>
                <input
                  type="number"
                  value={quizId}
                  placeholder="Enter Quiz ID"
                  onChange={(e) => {
                    setQuizId(e.target.value)
                    if(errors.quizId){
                      setErrors({
                        ...errors,
                        quizId: "",
                      });
                    }
                  }}
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.quizId
                      ? "border-red-500 focus:border-red-500"
                      : "border focus:border-blue-500"
                  }`}
                />
                {errors.quizId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.quizId}
                  </p>
                )}
              </div>
              {/* Question */}
              <div>
                <label className="block font-semibold mb-2">
                  Question
                </label>
                <textarea
                  rows="3"
                  value={question}
                  placeholder="Enter Question"
                  onChange={(e) => {
                    setQuestion(e.target.value)
                    if(errors.question){
                      setErrors({
                        ...errors,
                        question: "",
                      });
                    }
                  }}
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.question
                      ? "border-red-500 focus:border-red-500"
                      : "border focus:border-blue-500"
                  }`}
                ></textarea>
                {errors.question && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.question}
                  </p>
                )}
              </div>
              {/* Options */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Options
                </label>
                {options.map((option, index) => {
                  const optionName = `option${String.fromCharCode(
                    65 + index
                  )}`;
                  return (
                    <div key={index} className="mb-3">
                      <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index,e.target.value)}
                        className={`w-full border rounded-lg p-3 outline-none ${
                          errors[optionName]
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                      />
                      {errors[optionName] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[optionName]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Correct Answer */}
              <div>
                <label className="block font-semibold mb-2">Correct Answer</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => {
                    setCorrectAnswer(e.target.value)
                    if(errors.correctAns){
                      setErrors({
                        ...errors,
                        correctAns: "",
                      });
                    }
                  }}
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.correctAns
                      ? "border-red-500 focus:border-red-500"
                      : "border focus:border-blue-500"
                  }`}
                >
                  
                  <option value="">
                    Select Correct Option
                  </option>
                  {options.map((option, index) => (
                    <option
                      key={index}
                      value={option}
                    >
                      Option {index + 1}
                    </option>
                  ))}
                </select>
                {errors.correctAns && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.correctAns}
                  </p>
                )}
              </div>
              {/* Marks */}
              <div>
                <label className="block font-semibold mb-2">
                  Marks
                </label>
                {question.marks}
                <input
                  type="number"
                  value={marks}
                  placeholder="Enter Marks"
                  onChange={(e) => {
                    setMarks(e.target.value)
                    if(errors.marks){
                      setErrors({
                        ...errors,
                        marks: "",
                      });
                    }
                  }}
                  className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors.marks
                      ? "border-red-500 focus:border-red-500"
                      : "border focus:border-blue-500"
                  }`}
                />
                {errors.marks && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.marks}
                  </p>
                )}
              </div>
              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Adding Question...
                  </>
                ) : (
                  "Add Question"
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
export default AddQuestions;