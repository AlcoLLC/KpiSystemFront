import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Komponentlərin importu
import TaskStatsCards from './components/TaskStatsCards';
import MonthlyTasksChart from './components/MonthlyTasksChart';
import PriorityDistributionChart from './components/PriorityDistributionChart';
import RecentTasksTable from './components/RecentTasksTable';

// ChartJS modullarının qeydiyyatı
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Home() {
  return (
    <div className="space-y-8">
      <h2 className="px-1 text-xl font-medium text-black dark:text-white">Ana Səhifə</h2>
      
      {/* Tapşırıqlar Üzrə İcmal Kartları */}
      <TaskStatsCards />

      {/* Qrafiklər və Cədvəl Bölməsi */}
      <div className="p-6 rounded-lg shadow-md transition-colors duration-500 bg-white dark:bg-[#1B232D] space-y-8">
        
        {/* Qrafiklər */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 p-4 rounded-lg shadow bg-gray-50 dark:bg-[#131920]">
            <h4 className="text-md font-semibold mb-4 dark:text-gray-300">Aylıq Tamamlanan Tapşırıqlar</h4>
            <MonthlyTasksChart />
          </div>
          <div className="lg:col-span-2 p-4 rounded-lg shadow bg-gray-50 dark:bg-[#131920] flex items-center justify-center relative">
            <h4 className="text-md font-semibold mb-4 absolute top-4 left-4 dark:text-gray-300">Prioritetə Görə Bölgü</h4>
            <PriorityDistributionChart />
          </div>
        </div>
        
        {/* Son Tapşırıqlar Cədvəli */}
        <div>
          <RecentTasksTable />
        </div>

      </div>
    </div>
  );
}

export default Home;