import React from "react";
import { useSelector } from "react-redux";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Custom Bar Thickness Example",
    },
  },
};

const labels = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul"];
const barLabels = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul"];

const data = {
  labels,
  datasets: [
    {
      label: "Custom Bars",
      data: [10, 20, 30, 40, 50, 60, 70],
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      borderColor: "rgb(54, 162, 235)",
      borderWidth: 1,
      barPercentage: 0.5,
      barThickness: 30,
      maxBarThickness: 40,
      minBarLength: 2,
    },
  ],
};

// Bar chart data

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Bar Chart Example",
    },
  },
};

const barData = {
  labels: barLabels,
  datasets: [
    {
      label: "Custom Bars",
      data: [10, 20, 30, 40, 50, 60, 70],
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      borderColor: "rgb(54, 162, 235)",
      borderWidth: 1,
      barThickness: 30,
    },
  ],
};

const doughnutData = {
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50, 100],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      hoverOffset: 4,
    },
  ],
};
function Home() {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition duration-500 ${
        isDark ? "bg-[#1B232D] text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-xl font-bold mb-6">Dashboard Charts</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div
          className={`p-4 rounded-lg shadow transition duration-500 ${
            isDark ? "bg-[#131920]" : ""
          } w-full max-w-[100%] h-[350px] mx-auto flex items-center justify-center`}
        >
          <Bar options={barOptions} data={barData} />
        </div>

        {/* Doughnut Chart */}
        <div
          className={`p-4 rounded-lg shadow transition duration-500 ${
            isDark ? "bg-[#131920]" : ""
          } w-full max-w-[90%] h-[350px] mx-auto flex items-center justify-center`}
        >
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}
export default Home;