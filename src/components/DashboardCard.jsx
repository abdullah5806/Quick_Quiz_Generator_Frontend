
const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">

      <h3 className="text-lg font-semibold text-gray-700">
        {title}
      </h3>

      <p className="text-4xl font-bold text-blue-600 mt-4">
        {value}
      </p>

    </div>
  );
};

export default DashboardCard;