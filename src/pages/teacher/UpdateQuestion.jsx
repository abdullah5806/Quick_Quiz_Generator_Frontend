import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import api from "../../services/api.js";
import {toast} from "react-toastify";

const UpdateQuestion = () => {
    const {id} = useParams();
    console.log("Question Id:", id);
    const navigate = useNavigate();
    const [question, setQuestion] = useState({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAns: "",
    });
    useEffect(() => {
        const fetchQuestion = async () => {
            try{
                const res = await api.get(`/questions/${id}`, question);
                if(res.data.success){
                    const data = res.data.data;
                    setQuestion({
                        question: data.question,
                        optionA: data.optionA,
                        optionB: data.optionB,
                        optionC: data.optionC,
                        optionD: data.optionD,
                        correctAns: data.correctAns,
                    });
                }
            }catch(err){
                console.log(err);
            }
        };
        fetchQuestion();
    }, [id]);

    const handleChange = (e) => {
        setQuestion({
            ...question,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const res = await api.put(`/questions/${id}`, question);
                if (res.data.success) {
                    toast.success("Question Updated Successfully");
                    navigate("/teacher/all-questions");
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
                        Update Question
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-xl shadow-md w-full"
                    >
                        <div className="mb-4">
                            <label className="block mb-2 text-lg">Question</label>
                            <input
                                type="text"
                                name="question"
                                value={question.question}
                                onChange={handleChange}
                                placeholder="Update the Question"
                                className="w-full h-20 border p-2 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-2 text-lg">Option A</label>
                            <input
                                type="text"
                                name="optionA"
                                value={question.optionA}
                                onChange={handleChange} 
                                placeholder="Update the Quiz description"
                                className="w-full h-10 border p-2 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-2 text-lg">Option B</label>
                            <input
                                type="text"
                                name="optionB"
                                value={question.optionB}
                                onChange={handleChange} 
                                placeholder="Update the Quiz description"
                                className="w-full h-10 border p-2 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-2 text-lg">Option C</label>
                            <input
                                type="text"
                                name="optionC"
                                value={question.optionC}
                                onChange={handleChange} 
                                placeholder="Update the Quiz description"
                                className="w-full h-10 border p-2 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-2 text-lg">Option D</label>
                            <input
                                type="text"
                                name="optionD"
                                value={question.optionD}
                                onChange={handleChange} 
                                placeholder="Update the Quiz description"
                                className="w-full h-10 border p-2 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-2 text-lg">Correct Answer</label>
                            <input
                                type="text"
                                name="correctAns"
                                value={question.correctAns}
                                onChange={handleChange} 
                                placeholder="Update the Quiz description"
                                className="w-full h-10 border p-2 rounded"
                            />
                        </div>
                        <button className="bg-yellow-300 text-white mt-5 px-5 py-2 rounded-xl hover:bg-yellow-500">
                            Update Question
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}
export default UpdateQuestion;