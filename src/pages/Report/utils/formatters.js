import { format } from 'date-fns';
import { az } from 'date-fns/locale';

export const formatTimestamp = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return format(date, 'd MMMM yyyy, HH:mm', { locale: az });
  } catch (error) {
    return isoString;
  }
};