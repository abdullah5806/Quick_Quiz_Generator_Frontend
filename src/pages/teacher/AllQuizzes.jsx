import api from "../../services/api.js";
import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {toast} from "react-toastify"

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    useEffect(() => {
        const delay = setTimeout(() => {
            const fetchQuizzes = async () => {
                try {
                    const res = await api.get(`/quizzes?search=${encodeURIComponent(search)}`);
                    console.log("API Response:", res.data);
                    if (res.data.success) {
                        setQuizzes(res.data.quizzes);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchQuizzes();
        }, 500);
        return () => clearTimeout(delay);
   }, [search]);
    
    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`/quizzes/${id}`);
            if (res.data.success) {
                toast.success("Quiz Deleted Successfully");
                setQuizzes((prevQuizzes) =>
                    prevQuizzes.filter((quiz) => quiz.id !== id)
                );
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete quiz");
        }
    };
    
    const Navigate = useNavigate();
    
    return(
        <div className="min-h-screen bg-gray-100">
            <Navbar/>
            <div className="flex">
                <Sidebar/>
                <main className="flex-1 p-8">
                    <div className="flex">
                        <h1 className="text-4xl font-bold text-gray-800">
                            All Quizzes
                            <p className="text-gray-600 mt-3 text-sm font-light">All Quizzes you will seen here.</p>
                        </h1>
                        
                        <button 
                        onClick={() => Navigate("/teacher/create-quiz")}
                        className="ml-180 bg-blue-500 text-white w-30 h-9 rounded-xl hover:bg-blue-800 ">
                            Create Quiz
                        </button>
                    </div>
                    <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">All Quizzes</h2>
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search quizzes..."
                                value={search}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if(value){
                                        setSearchParams({search: value});
                                    } else{
                                        setSearchParams({});
                                    }
                                }}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                    <tr className="bg-blue-500">
                                        <th className="p-3 text-left">Quiz Id</th>
                                        <th className="p-3 text-left">Title</th>
                                        <th className="p-3 text-left">Description</th>
                                        <th className="p-3 text-left">Teacher Id</th>
                                        <th className="p-3 text-left">Created</th>
                                        <th className="p-3 text-left">Update</th>
                                        <th className="p-3 text-left">Delete</th>
                                    </tr>
                            </thead>
                            <tbody>
                                {
                                    quizzes.map((quiz) => (
                                        <tr key={quiz.id} className="border-b">
                                            <td className="p-3">{quiz.id}</td>
                                            <td className="p-3">{quiz.title}</td>
                                            <td className="p-3">{quiz.description}</td>
                                            <td className="p-3">{quiz.teacherId}</td>
                                            <td className="p-3">{new Date(quiz.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <button 
                                                onClick={() => Navigate(`/teacher/update-quiz/${quiz.id}`)}
                                                className="bg-yellow-400 text-white w-17 h-9 rounded-xl hover:bg-yellow-600">Update</button>
                                            </td>
                                            <td className="p-3">
                                                <button 
                                                onClick={() => handleDelete(quiz.id)}
                                                className="bg-red-500 text-white w-17 h-9 rounded-xl hover:bg-red-700">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>

    )
}
export default Quizzes;