import { useEffect,useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {toast} from "react-toastify"
import api from "../../services/api";

const AssignQuiz = () => {
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);

  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoadingQuizzes(true);
        const res = await api.get("/quizzes");
        console.log("Quizzes API Response:", res.data);
        if (res.data.success) {
          setQuizzes(res.data.quizzes);
        } else {
          setQuizzes([]);
        }
      } 
      catch (error) {
        console.error("Fetch Quizzes Error:", error);
        setQuizzes([]);
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch quizzes."
        );
      } finally {
        setLoadingQuizzes(false);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await api.get("/students");
        console.log("Students API Response:", res.data);
        if (res.data.success) {
          setStudents(res.data.data);
        } else {
          setStudents([]);
        }
      } 
      catch (error) {
        console.error("Fetch Students Error:", error);
        setStudents([]);
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch students."
        );
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentChange = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(
        selectedStudents.filter((id) => id !== studentId)
      );
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };
  const handleAssignQuiz = async (e) => {e.preventDefault();
    if (!selectedQuiz) {
      toast.error("Please select a quiz.");
      return;
    }
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student.");
      return;
    }
    try {
      setAssigning(true);
      const res = await api.post("/assign-quiz", {
        quizId: Number(selectedQuiz),
        studentIds: selectedStudents,
      });
      console.log("Assign Quiz Response:", res.data);
      if (res.data.success) {
        toast.success("Quiz assigned successfully!");
        setSelectedQuiz("");
        setSelectedStudents([]);
      }
    } 
    catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign quiz.");
    } finally{
      setAssigning(false);
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
          <h1 className="text-4xl font-bold text-gray-800">Assign Quiz</h1>
          <p className="text-gray-600 mt-2">Assign quizzes to one or more students.</p>
          <div className="bg-white mt-8 p-8 rounded-xl shadow-lg">
            <form
              onSubmit={handleAssignQuiz}
              className="space-y-8"
            >
              {/* Quiz Selection */}
              <div>
                <label className="block font-semibold mb-2">Select Quiz</label>
                <select
                  value={selectedQuiz}
                  onChange={(e) => setSelectedQuiz(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingQuizzes}
                >
                  <option value="">{loadingQuizzes? "Loading quizzes...": "-- Select Quiz --"}</option>
                  {quizzes.map((quiz) => (
                    <option 
                    key={quiz.id} 
                    value={quiz.id}>
                      {quiz.title}
                    </option>
                  ))}
                </select>
              </div>
              {/* Student Selection */}
              <div>
                <label className="block font-semibold mb-4">Select Students</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {loadingStudents ? (
                    <p className="text-gray-500">Loading students...</p> ) : 
                    students.length === 0 ? 
                    (
                      <p className="text-gray-500">No students found.</p> 
                    ) : 
                    (
                      students.map((student) => (
                        <label
                          key={student.id}
                          className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleStudentChange(student.id)}
                            disabled={assigning}
                          />
                          {student.name}
                        </label>
                      ))
                    )
                  }
                </div>
              </div>
              {/* Selected Students */}
              <div>
                <h2 className="font-semibold mb-3">Selected Students</h2>
                <div className="border rounded-lg p-4 min-h-[80px]">
                  {selectedStudents.length === 0 ? (
                    <p className="text-gray-500">No student selected.</p>
                  ) : (
                    <ul className="list-disc list-inside">
                      {selectedStudents.map((studentId) => {
                        const student = students.find(
                          (student) => student.id === studentId
                        );
                        return (
                          <li key={studentId}>
                            {student?.name}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={assigning}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                {assigning? "Assigning...": "Asign Quiz"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignQuiz;