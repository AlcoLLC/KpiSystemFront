import {
  FaPlusCircle,
  FaCheckCircle,
  FaSyncAlt,
  FaStar,
} from 'react-icons/fa';

export const eventVisuals = {
  TASK_CREATED: { Icon: FaPlusCircle, color: 'text-green-500', label: 'Tapşırıq yaradıldı' },
  TASK_APPROVED: { Icon: FaCheckCircle, color: 'text-blue-500', label: 'Tapşırıq təsdiqləndi' },
  TASK_STATUS_CHANGED: { Icon: FaSyncAlt, color: 'text-purple-500', label: 'Status dəyişdirildi' },
  KPI_TASK_EVALUATED: { Icon: FaStar, color: 'text-yellow-500', label: 'Tapşırıq qiymətləndirildi' },
  KPI_USER_EVALUATED: { Icon: FaStar, color: 'text-orange-400', label: 'İstifadəçi qiymətləndirildi' },
  default: { Icon: FaPlusCircle, color: 'text-gray-500', label: 'Digər' },
};