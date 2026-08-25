import { useState } from "react";
import Navbar from "../../components/Navbar";

const AvailableQuiz = () => {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const quizzes = [
    {
      id: 1,
      title: "Java Basics",
      subject: "Java",
      duration: "30 Minutes",
      marks: 20,
    },
    {
      id: 2,
      title: "React Fundamentals",
      subject: "React",
      duration: "25 Minutes",
      marks: 15,
    },
    {
      id: 3,
      title: "HTML & CSS",
      subject: "Web",
      duration: "20 Minutes",
      marks: 20,
    },
    {
      id: 4,
      title: "JavaScript",
      subject: "JavaScript",
      duration: "35 Minutes",
      marks: 25,
    },
    {
      id: 5,
      title: "Node.js",
      subject: "Node.js",
      duration: "40 Minutes",
      marks: 30,
    },
  ];
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchSearch = quiz.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchSubject =
      subject === "All" || quiz.subject === subject;
    return matchSearch && matchSubject;
  });
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Available Quizzes
        </h1>
        <p className="text-gray-600 mt-2">
          Select any quiz and start attempting.
        </p>
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <input
            type="text"
            placeholder="Search Quiz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option>Java</option>
            <option>React</option>
            <option>JavaScript</option>
            <option>Web</option>
            <option>Node.js</option>
          </select>
        </div>
        {/* Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-bold text-blue-600">
                {quiz.title}
              </h2>
              <p className="mt-4">
                <strong>Subject:</strong> {quiz.subject}
              </p>
              <p className="mt-2">
                <strong>Duration:</strong> {quiz.duration}
              </p>
              <p className="mt-2">
                <strong>Total Marks:</strong> {quiz.marks}
              </p>
              <button
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                Attempt Quiz
              </button>
            </div>
          ))}
        </div>
        {filteredQuizzes.length === 0 && (
          <div className="mt-10 text-center text-gray-500 text-xl">
            No quizzes found.
          </div>
        )}
      </main>
    </div>
  );
};
export default AvailableQuiz;