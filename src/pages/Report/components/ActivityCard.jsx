import { eventVisuals } from '../constants/eventVisuals';
import { formatTimestamp } from '../utils/formatters';

const ActivityCard = ({ log }) => {
  const { Icon, color } = eventVisuals[log.action_type] || eventVisuals.default;
  const actorName = log.actor_details ? `${log.actor_details.first_name} ${log.actor_details.last_name}`.trim() : 'Naməlum';

  return (
    <div className="flex items-start pb-4 ml-4">
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="w-px h-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="w-full bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 -mt-2">
        <p className="text-gray-800 dark:text-gray-200">
          <strong className="text-blue-600 dark:text-blue-400">{actorName}</strong>{' '}
          {log.description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {formatTimestamp(log.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default ActivityCard;