import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import { toast } from "react-toastify";

const UpdateQuiz = () => {
    const { id } = useParams();
    console.log("Quiz ID:", id);
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        title: "",
        description: "",
    });
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quizzes/${id}`);
                if (res.data.success) {
                    setQuiz({
                        title: res.data.quiz.title,
                        description: res.data.quiz.description,
                    });
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchQuiz();
    }, [id]);
    const handleChange = (e) => {
        setQuiz({
            ...quiz,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/quizzes/${id}`, quiz);
            if (res.data.success) {
                toast.success("Quiz Updated Successfully");
                navigate("/teacher/quizzes");
            }
        }
        catch (err) {
            console.log(err);
            toast.error("Failed to update quiz");
        }
    };
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    <h1 className="text-4xl font-bold mb-8">
                        Update Quiz
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-xl shadow-md w-full"
                    >
                        <div className="mb-4">
                            <label className="block mb-2 text-lg">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={quiz.title}
                                onChange={handleChange}
                                placeholder="Update the Quiz Title"
                                className="w-full h-10 border p-2 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-2 text-lg">Description</label>
                            <input
                                name="description"
                                value={quiz.description}
                                onChange={handleChange} 
                                placeholder="Update the Quiz description"
                                className="w-full h-20 border p-2 rounded"
                            />
                        </div>
                        <button className="bg-yellow-300 text-white px-5 py-2 rounded-xl hover:bg-yellow-500">Update Quiz</button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default UpdateQuiz;