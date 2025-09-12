import React from 'react';
import { 
  FaPlusCircle, 
  FaCheckCircle, 
  FaSyncAlt, 
  FaStar 
} from 'react-icons/fa';

// Nümunə məlumatlar. Gələcəkdə bu massiv API-dan gələcək.
const activityLogData = [
  {
    id: 1,
    type: 'TASK_RATED',
    user: 'Rəşad Əliyev',
    taskName: 'Backend Development',
    details: 'tapşırığını 8/10 ulduz ilə qiymətləndirdi.',
    timestamp: '12 Sentyabr 2025, 11:50',
  },
  {
    id: 2,
    type: 'STATUS_CHANGED',
    user: 'Əhməd Məmmədov',
    taskName: 'Hotel management system',
    details: 'statusunu "IN_PROGRESS"-dən "DONE"-a dəyişdi.',
    timestamp: '12 Sentyabr 2025, 10:15',
  },
  {
    id: 3,
    type: 'TASK_APPROVED',
    user: 'Rəhbərlik',
    taskName: 'UI/UX Design',
    details: 'tapşırığını təsdiq etdi.',
    timestamp: '11 Sentyabr 2025, 16:30',
  },
  {
    id: 4,
    type: 'TASK_CREATED',
    user: 'Ayşə Həsənova',
    taskName: 'UI/UX Design',
    details: 'adlı yeni tapşırıq yaratdı.',
    timestamp: '11 Sentyabr 2025, 14:00',
  },
];

// Fəaliyyət növünə görə uyğun ikona və rəngi təyin edən obyekt
const eventVisuals = {
  TASK_CREATED: { Icon: FaPlusCircle, color: 'text-green-500' },
  TASK_APPROVED: { Icon: FaCheckCircle, color: 'text-blue-500' },
  STATUS_CHANGED: { Icon: FaSyncAlt, color: 'text-purple-500' },
  TASK_RATED: { Icon: FaStar, color: 'text-yellow-500' },
  default: { Icon: FaPlusCircle, color: 'text-gray-500' },
};

// Tək bir fəaliyyət kartını təsvir edən alt-komponent
const ActivityCard = ({ log }) => {
  const { Icon, color } = eventVisuals[log.type] || eventVisuals.default;

  return (
    <div className="flex items-start pb-4">
      {/* İkona və zaman xətti üçün konteyner */}
      <div className="flex flex-col items-center mr-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="w-px h-full bg-gray-300 dark:bg-gray-600 my-2"></div>
      </div>

      {/* Məzmun hissəsi */}
      <div className="w-full bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-gray-800 dark:text-gray-200">
          <strong className="text-blue-600 dark:text-blue-400">{log.user}</strong>{' '}
          <em>'{log.taskName}'</em>{' '}
          {log.details}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {log.timestamp}
        </p>
      </div>
    </div>
  );
};

function Report() {
  return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-8 text-black dark:text-white">
        Fəaliyyət Tarixçəsi
      </h2>
      
      <div className="relative">
        {/* Sonuncu elementdən sonra xəttin görünməməsi üçün xüsusi stil */}
        <div className="space-y-0">
          {activityLogData.map((log, index) => (
            <div key={log.id} className="relative">
              {/* Bu div, ActivityCard-ın içindəki xətti gizlətmək üçün lazımdır */}
              <ActivityCard log={log} />
              {/* Sonuncu elementin altındakı xətti gizlədirik */}
              {index === activityLogData.length - 1 && (
                 <div className="absolute left-[19px] top-12 bottom-0 w-px bg-gray-50 dark:bg-[#131920]"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Report;