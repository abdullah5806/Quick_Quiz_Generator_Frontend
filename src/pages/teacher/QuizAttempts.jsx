import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const QuizAttempts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const studentFromURL = searchParams.get("student") || "";
  const quizFromURL = searchParams.get("quiz") || "";
  const pageFromURL = Number(searchParams.get("page")) || 1;
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(studentFromURL);
  const [selectedQuiz, setSelectedQuiz] = useState(quizFromURL);
  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const [totalPages, setTotalPages] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [pageLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedStudent(studentFromURL);
    setSelectedQuiz(quizFromURL);
    setCurrentPage(pageFromURL);
  }, [studentFromURL, quizFromURL, pageFromURL, ]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setFilterLoading(true);
        const res = await api.get("/attempt-quiz/attempt-filters");
        console.log("Filters API Response:",res.data);
        if (res.data.success) {
          setStudents(res.data.students || []);
          setQuizzes(res.data.quizzes || []);
        }
      } catch (err) {
        console.error("Error Fetching Filters:", err.response?.data || err.message);
      } finally {
        setFilterLoading(false);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page: currentPage,
          limit: pageLimit,
        };
        if (selectedStudent) {
          params.student = selectedStudent;
        }
        if (selectedQuiz) {
          params.quiz = selectedQuiz;
        }
        console.log("Attempt Query Params:", params);
        const res = await api.get("/attempt-quiz/attempts",
          {params,}
        );
        console.log("Attempts API Response:",res.data);

        if (res.data.success) {
          setQuizAttempts(res.data.data || []);
          setTotalAttempts(res.data.pagination ?.totalAttempts || 0);
          setTotalPages(res.data.pagination ?.totalPages || 0);
          if (res.data.pagination?.currentPage) {
            setCurrentPage(res.data.pagination.currentPage);
          }
        } else {
          setError(res.data.message ||"Failed to fetch attempts");
        }
      } catch (err) {
        console.error("Error Fetching Attempts:",err.response?.data || err.message);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, [selectedStudent, selectedQuiz, currentPage, pageLimit,]);

  const handleStudentChange = (e) => {
    const studentName =e.target.value;
    setSelectedStudent(studentName);
    setCurrentPage(1);
    const params = {};
    if (studentName) {
      params.student =studentName;
    }
    if (selectedQuiz) {
      params.quiz =selectedQuiz;
    }
    params.page = 1;
    setSearchParams(params);
  };

  const handleQuizChange = (e) => {
    const quizTitle = e.target.value;
    setSelectedQuiz(quizTitle);
    setCurrentPage(1);
    const params = {};
    if (selectedStudent) {
      params.student =selectedStudent;
    }
    if (quizTitle) {
      params.quiz =quizTitle;
    }
    params.page = 1;
    setSearchParams(params);
  };

  const changePage = (page) => {
    if ( page < 1 || page > totalPages ) {
      return;
    }
    setCurrentPage(page);
    const params = {};
    if (selectedStudent) {
      params.student = selectedStudent;
    }
    if (selectedQuiz) {
      params.quiz = selectedQuiz;
    }
    params.page = page;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedStudent("");
    setSelectedQuiz("");
    setCurrentPage(1);
    setSearchParams({page: 1,});
  };
  const pageNumbers = [];
  for (let i = 1;i <= totalPages;i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-gray-800">Quiz Attempts</h1>
          <p className="text-gray-600 mt-2">Monitor students attempting quizzes.</p>
          <div className="bg-white shadow-lg rounded-xl mt-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Student</label>
                <select
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  disabled={filterLoading}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    All Students
                  </option>
                  {students.map(
                    (student) => (
                      <option
                        key={student.id}
                        value={student.name}
                      >
                        {student.name}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quiz</label>
                <select
                  value={selectedQuiz}
                  onChange={handleQuizChange}
                  disabled={filterLoading}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    All Quizzes
                  </option>
                  {quizzes.map(
                    (quiz) => (
                      <option
                        key={quiz.id}
                        value={quiz.title}
                      >
                        {quiz.title}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
            {(selectedStudent || selectedQuiz) && (
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                {selectedStudent && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg">
                    Student:{" "}
                    {selectedStudent}
                  </span>
                )}
                {selectedQuiz && (
                  <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg">
                    Quiz:{" "}
                    {selectedQuiz}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          <div className="bg-white shadow-lg rounded-xl mt-8 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading attempts...
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                {error}
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-4 text-left">Student ID</th>
                      <th className="p-4 text-left">Student Name</th>
                      <th className="p-4 text-left">Quiz Title</th>
                      <th className="p-4 text-center">Attempted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizAttempts.length > 0 ? (
                      quizAttempts.map((attempt) => (
                        <tr
                          key={attempt.id}
                          className="border-b hover:bg-gray-100"
                        >
                          <td className="p-3">{attempt.user ?.id ?? "-"}</td>
                          <td className="p-3">{attempt.user ?.name ?? "-"} </td>
                          <td className="p-3">{attempt.quiz ?.title ?? "-"}</td>
                          <td className="p-3 text-center">{attempt.attemptedAt ? new Date( attempt.attemptedAt ).toLocaleString() : "-"} </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-6 text-center text-gray-500"
                        >
                          No quiz attempts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {totalPages > 0 && (
                  <div className="px-6 py-5 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Showing page{" "}
                      <span className="font-semibold">{currentPage}</span>{" "}
                      of{" "}
                      <span className="font-semibold">{totalPages}</span>
                      {" "}(
                      {totalAttempts} total attempts
                      )
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg border ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Previous
                      </button>
                      {pageNumbers.map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => changePage( page )}
                            className={`w-10 h-10 rounded-lg ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-white border text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => changePage( currentPage + 1 )}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg border ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizAttempts;