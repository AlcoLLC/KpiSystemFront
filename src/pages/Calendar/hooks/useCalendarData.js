import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import tasksApi from '../../../api/tasksApi';
import notesApi from '../../../api/notesApi';
import { getAssigneeName } from '../utils/helpers';

export function useCalendarData(viewDate, calendarMode) {
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (date, mode) => {
        try {
            setLoading(true);
            setError(null);
            const startRange = (mode === 'year' ? date.startOf('year') : date.startOf('month').subtract(1, 'week')).format('YYYY-MM-DD');
            const endRange = (mode === 'year' ? date.endOf('year') : date.endOf('month').add(1, 'week')).format('YYYY-MM-DD');

            const [taskResponse, noteResponse] = await Promise.all([
                tasksApi.getTasks({ start_date_before: endRange, due_date_after: startRange, page_size: 1000 }),
                notesApi.getNotes({ start_date: startRange, end_date: endRange })
            ]);

            if (taskResponse.data && Array.isArray(taskResponse.data.results)) {
                const newTasks = taskResponse.data.results
                    .filter(task => task.start_date && task.due_date)
                    .map(task => ({
                        id: task.id,
                        title: task.title,
                        startDate: task.start_date,
                        endDate: task.due_date,
                        status: task.status,
                        priority: task.priority,
                        assignee: getAssigneeName(task.assignee_details),
                        description: task.description || 'Təsvir yoxdur'
                    }));
                setTasks(newTasks);
            }

            if (noteResponse.data && Array.isArray(noteResponse.data)) {
                setNotes(noteResponse.data);
            }
        } catch (err) {
            const errorMessage = 'Məlumatları yükləmək mümkün olmadı. İnternet bağlantınızı yoxlayın.';
            setError(errorMessage);
            message.error(errorMessage);
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(viewDate, calendarMode);
    }, [viewDate, calendarMode, fetchData]);

    return { tasks, notes, loading, error, setNotes };
}