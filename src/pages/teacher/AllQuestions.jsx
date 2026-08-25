import api from "../../services/api.js";
import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AllQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    // Fetch all questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get("/questions");
                console.log("API Response:", res.data);
                if (res.data.success) {
                    setQuestions(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
                toast.error("Failed to fetch questions");
            }
        };
        fetchQuestions();
    }, []);
    // Delete question
    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`/questions/${id}`);
            if (res.data.success) {
                toast.success("Question Deleted Successfully");
                setQuestions((prevQuestions) =>
                    prevQuestions.filter(
                        (question) => question.id !== id
                    )
                );
            }
        } catch (error) {
            console.error("Delete question error:", error);
            toast.error("Failed to delete question");
        }
    };
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">
                                All Questions
                            </h1>
                            <p className="text-gray-600 mt-3 text-sm font-light">
                                All Questions you will see here.
                            </p>
                        </div>
                        <button onClick={() => navigate("/teacher/add-questions")}
                            className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-800"
                        >
                            Add Questions
                        </button>
                    </div>
                    <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">All Questions</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-500">
                                        <th className="p-2 text-left">Question Id</th>
                                        <th className="p-2 text-left">Quiz</th>
                                        <th className="p-2 text-left">Question</th>
                                        <th className="p-2 text-left">Option A</th>
                                        <th className="p-2 text-left">Option B</th>
                                        <th className="p-2 text-left">Option C</th>
                                        <th className="p-2 text-left">Option D</th>
                                        <th className="p-2 text-left">Correct</th>
                                        <th className="p-2 text-left">Update</th>
                                        <th className="p-2 text-left">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="10"
                                                className="p-6 text-center text-gray-500"
                                            >
                                                No questions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        questions.map((question) => (
                                            <tr key={question.id} className="border-b">
                                                <td className="p-2">{question.id}</td>
                                                <td className="p-2">{question.quiz?.title || "N/A"}</td>
                                                <td className="p-2">{question.question}</td>
                                                <td className="p-2">{question.optionA}</td>
                                                <td className="p-2">{question.optionB}</td>
                                                <td className="p-2">{question.optionC}</td>
                                                <td className="p-2">{question.optionD}</td>
                                                <td className="p-2">{question.correctAns}</td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => navigate(`/teacher/update-question/${question.id}`)}
                                                        className="bg-yellow-400 text-white h-8 w-16 rounded-xl hover:bg-yellow-600"
                                                    >
                                                        Update
                                                    </button>
                                                </td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => handleDelete(question.id)}
                                                        className="bg-red-500 text-white h-8 w-16 rounded-xl hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
export default AllQuestions;