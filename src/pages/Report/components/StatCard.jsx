const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

export default StatCard;