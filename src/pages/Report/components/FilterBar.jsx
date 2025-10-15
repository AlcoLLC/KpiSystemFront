import DatePicker from 'react-datepicker';
import { az } from 'date-fns/locale';
import { FaFilter, FaDownload } from 'react-icons/fa';
import { eventVisuals } from '../constants/eventVisuals';
import "react-datepicker/dist/react-datepicker.css";

const FilterBar = ({ filters, allUsers, onFilterChange, onExport }) => {
  return (
    <div className="bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
      <h3 className="text-lg font-medium mb-4 dark:text-white flex items-center"><FaFilter className="mr-2"/> Filterlər</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarix Aralığı</label>
          <DatePicker
            selectsRange={true}
            startDate={filters.dateRange[0]}
            endDate={filters.dateRange[1]}
            onChange={(update) => onFilterChange('dateRange', update)}
            isClearable={true}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 min-w-[220px]"
            dateFormat="dd/MM/yyyy"
            locale={az}
            placeholderText="Başlanğıc və bitmə tarixi seçin"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">İstifadəçi</label>
          <select 
            value={filters.user} 
            onChange={e => onFilterChange('user', e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Bütün İstifadəçilər</option>
            {allUsers.map(user => (
              <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fəaliyyət Növü</label>
          <select 
            value={filters.actionType} 
            onChange={e => onFilterChange('actionType', e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Bütün Növlər</option>
            {Object.entries(eventVisuals).map(([key, {label}]) => (
              key !== 'default' && <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-transparent mb-1">.</label>
          <button 
            onClick={onExport}
            className="w-full flex items-center justify-center p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FaDownload className="mr-2" /> CSV Yüklə
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;