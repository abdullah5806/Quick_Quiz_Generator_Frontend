import CommonTable from "../pages/CommonTable";

const columns = [
    {
      key: "studentId",
      label: "Student ID",
      render: (attempt) => attempt.user?.id ?? "-"
    },
    {
      key: "studentName",
      label: "Student Name",
      render: (attempt) => attempt.user?.name ?? "-"
    },
    {
      key: "quizTitle",
      label: "Quiz Title",
      render: (attempt) => attempt.quiz?.title ?? "-"
    },
    {
      key: "attemptedAt",
      label: "Attempted At",
      align: "center",
      render: (attempt) => attempt.attemptedAt ? new Date( attempt.attemptedAt ).toLocaleString() : "-"
    }
];

export default columns;
