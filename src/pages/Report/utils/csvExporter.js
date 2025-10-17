import Papa from 'papaparse';
import { format } from 'date-fns';
import reportsAPI from '../../../api/reportsAPI';
import { eventVisuals } from '../constants/eventVisuals';
import { formatTimestamp } from './formatters';

export const exportLogsToCSV = async (filters) => {
  alert("Bütün məlumatlar ixrac üçün yüklənir. Bu bir az vaxt ala bilər.");
  try {
    const [startDate, endDate] = filters.dateRange;
    const params = { page: 1, page_size: 1000 };

    if (filters.user !== 'all') params.actor = filters.user;
    if (filters.actionType !== 'all') params.action_type = filters.actionType;
    if (startDate) params.start_date = format(startDate, 'yyyy-MM-dd');
    if (endDate) params.end_date = format(endDate, 'yyyy-MM-dd');
    
    const response = await reportsAPI.getActivityLogs(params);
    const allLogs = response.data.results;
    
    if (!allLogs || allLogs.length === 0) {
        alert("Yükləmək üçün heç bir məlumat yoxdur.");
        return;
    }

    const dataToExport = allLogs.map(log => ({
        'İstifadəçi': `${log.actor_details.first_name} ${log.actor_details.last_name}`,
        'Fəaliyyət': log.description,
        'Növ': eventVisuals[log.action_type]?.label || 'Digər',
        'Tarix': formatTimestamp(log.timestamp)
    }));

    const csv = Papa.unparse(dataToExport, { delimiter: ';' });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'fealiyyet_tarixcesi.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    alert("Məlumatları ixrac etmək mümkün olmadı.", error);
  }
};