import React from 'react';
import MonthlyTasksChart from './components/MonthlyTasksChart';
import PriorityDistributionChart from './components/PriorityDistributionChart';
import RecentTasksTable from './components/RecentTasksTable';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS modules once in the main component
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Home() {
  return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Ana Səhifə</h2>
      <div className="p-6 rounded-lg shadow-md transition-colors duration-500 bg-white dark:bg-[#1B232D]">
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3 p-4 rounded-lg shadow bg-gray-50 dark:bg-[#131920]">
            <MonthlyTasksChart />
          </div>
          <div className="lg:col-span-2 p-4 rounded-lg shadow bg-gray-50 dark:bg-[#131920] flex items-center justify-center">
            <PriorityDistributionChart />
          </div>
        </div>
        
        {/* Recent Tasks Table Section */}
        <div>
          <RecentTasksTable />
        </div>

      </div>
    </div>
  );
}

export default Home;