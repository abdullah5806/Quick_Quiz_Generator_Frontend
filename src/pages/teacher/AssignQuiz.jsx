import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import api from "../../services/api";

const AssignQuiz = () => {

  const [searchParams, setSearchParams] = useSearchParams();
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
        console.log("Quizzes API Response:",res.data);
        if (res.data.success) {
          const quizData = res.data.data || res.data.quizzes || [];
          console.log("Final Quiz Data:",quizData);
          setQuizzes( Array.isArray(quizData) ? quizData : [] );
        } else {
          setQuizzes([]);
        }
      } 
      catch (error) {
        console.error("Fetch Quizzes Error:",error);
        setQuizzes([]);
        toast.error(error.response?.data?.message ||"Failed to fetch quizzes.");
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
        console.log("Students API Response:",res.data);
        if (res.data.success) {
          setStudents(res.data.data || []);
        } else {
          setStudents([]);
        }
      } 
      catch (error) {
        console.error("Fetch Students Error:",error);
        setStudents([]);
        toast.error(error.response?.data?.message ||"Failed to fetch students.");
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (loadingQuizzes || loadingStudents) {
      return;
    }
    const quizTitle = searchParams.get("quizTitle");
    const studentNames =searchParams.get("studentNames");
    if (quizTitle) {
      const quiz = quizzes.find((quiz) =>
        String(quiz.title).trim() ===
        String(quizTitle).trim()
      );
      if (quiz) {
        setSelectedQuiz(String(quiz.id));
      }
    }
    if (studentNames) {
      const names = studentNames.split(",").map(
        (name) => name.trim()
      ).filter(Boolean);
      const studentIds =students.filter(
        (student) => names.includes(String(student.name).trim())
      )
      .map(
        (student) => student.id
      );
      setSelectedStudents(studentIds);
    }
  }, [loadingQuizzes,loadingStudents,quizzes,students,searchParams,]);

  const updateURL = (quizId,studentIds) => {
    const params =new URLSearchParams();
    const quiz =quizzes.find(
      (quiz) => String(quiz.id) === String(quizId)
    );
    if (quiz) {
      params.set("quizTitle", quiz.title);
    }
    if (studentIds && studentIds.length > 0) {
      const names =studentIds.map(
        (studentId) => {
          const student = students.find(
            (student) => String(student.id) === String(studentId)
          );
          return student?.name;
        }
      )
      .filter(Boolean);
      if (names.length > 0) {
        params.set("studentNames", names.join(","));
      }
    }
    setSearchParams(params);
  };

  const handleQuizChange = (e) => {
    const quizId = e.target.value;
    setSelectedQuiz(quizId);
    updateURL(quizId, selectedStudents);
  };

  const handleStudentChange = (studentId) => {
    let updatedStudents;
    if (
      selectedStudents.some(
        (id) =>String(id) === String(studentId)
      )
    ) {
      updatedStudents =selectedStudents.filter(
        (id) => String(id) !== String(studentId)
      );
    }
    else {
      updatedStudents = [
        ...selectedStudents,
        studentId,
      ];
    }
    setSelectedStudents(updatedStudents);
    updateURL(selectedQuiz,updatedStudents);
  };

  const handleAssignQuiz =async (e) => {e.preventDefault();
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
      const res = await api.post("/assign-quiz",{
        quizId: Number(selectedQuiz),
        studentIds: selectedStudents,
      });
      console.log("Assign Quiz Response:",res.data);
      if (res.data.success) {
        toast.success(`Quiz assigned successfully to ${res.data.assignedCount} student(s)!`);
        setSelectedQuiz("");
        setSelectedStudents([]);
        setSearchParams({});
      }
    } catch (error) {
      console.error("Assign Quiz Error:",error);
      toast.error(error.response?.data?.message ||"Failed to assign quiz.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
          <main className="flex-1 p-8">
            <h1 className="text-4xl font-bold text-gray-800">Assign Quiz</h1>
            <p className="text-gray-600 mt-2">Assign quizzes to one or more students.</p>
            <div className="bg-white mt-8 p-8 rounded-xl shadow-lg">
              <form
                onSubmit={handleAssignQuiz}
                className="space-y-8"
              >
                <div>
                  <label className="block font-semibold mb-2">Select Quiz</label>
                  <select
                    value={selectedQuiz}
                    onChange={handleQuizChange}
                    disabled={loadingQuizzes ||assigning}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      {loadingQuizzes ? "Loading quizzes..." : "-- Select Quiz --"}
                    </option>
                    {quizzes.map((quiz) => (
                      <option
                        key={quiz.id}
                        value={quiz.id}
                      >
                        {quiz.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-4">Select Students</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {loadingStudents ? (
                      <p className="text-gray-500">Loading students...</p>
                    ) : students.length === 0 ? (
                      <p className="text-gray-500">No students found.</p>
                    ) : (
                      students.map((student) => (
                        <label 
                          key={student.id}
                          className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.some((id) =>
                              String(id) === String(student.id)
                            )}
                            onChange={() => handleStudentChange(student.id)}
                            disabled={assigning}
                          />
                          <span> {student.name} </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold mb-3">Selected Students</h2>
                  <div className="border rounded-lg p-4 min-h-[80px]">
                    {selectedStudents.length === 0 ? (
                      <p className="text-gray-500">No student selected.</p>
                    ) : (
                      <ul className="list-disc list-inside">
                        {selectedStudents.map((studentId) => {
                          const student =students.find(
                            (student) => String(student.id) === String(studentId)
                          );
                          return (
                            <li
                              key={studentId}
                            >
                              {student?.name || `Student ${studentId}`}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {assigning ? "Assigning..." : "Assign Quiz"}
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
  );
};

export default AssignQuiz;