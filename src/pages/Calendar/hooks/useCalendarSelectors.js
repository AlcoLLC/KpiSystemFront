import { useMemo, useCallback } from 'react';
import dayjs from 'dayjs';

export function useCalendarSelectors({ tasks, notes, viewDate, clickedDate, selectedDate }) {
    const getTasksForMonth = useCallback((monthDate) => 
        tasks.filter(task => dayjs(task.endDate).isSame(monthDate, 'month')), 
    [tasks]);

    const getTasksForDate = useCallback((date) => 
        tasks.filter(task => dayjs(date).isSame(dayjs(task.endDate), 'day')), 
    [tasks]);

    const getNoteForDate = useCallback((date) => 
        notes.find(note => dayjs(note.date).isSame(date, 'day')), 
    [notes]);

    const isDayViewActive = !!clickedDate;

    const tasksForMonth = useMemo(() => 
        getTasksForMonth(viewDate).sort((a, b) => dayjs(a.endDate).diff(dayjs(b.endDate))), 
    [getTasksForMonth, viewDate]);

    const tasksForDay = useMemo(() => 
        isDayViewActive ? getTasksForDate(clickedDate) : [], 
    [isDayViewActive, getTasksForDate, clickedDate]);

    const tasksToShow = isDayViewActive ? tasksForDay : tasksForMonth;

    const selectedDateNote = useMemo(() => 
        getNoteForDate(selectedDate), 
    [getNoteForDate, selectedDate]);

    const upcomingTasks = useMemo(() => {
        const today = dayjs().startOf('day');
        return tasks
            .filter(task => {
                const endDate = dayjs(task.endDate);
                const isActionable = task.status !== 'DONE' && task.status !== 'CANCELLED';
                return isActionable && endDate.isSameOrAfter(today, 'day');
            })
            .sort((a, b) => dayjs(a.endDate).diff(dayjs(b.endDate)));
    }, [tasks]);

    const monthlyStats = useMemo(() => ({
        total: tasksForMonth.length,
        done: tasksForMonth.filter(t => t.status === 'DONE').length,
        inProgress: tasksForMonth.filter(t => t.status === 'IN_PROGRESS').length,
        todo: tasksForMonth.filter(t => t.status === 'TODO').length,
    }), [tasksForMonth]);

    return {
        getTasksForDate,
        getNoteForDate,
        getTasksForMonth,
        isDayViewActive,
        tasksToShow,
        selectedDateNote,
        upcomingTasks,
        monthlyStats,
    };
}