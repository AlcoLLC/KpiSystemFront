import { useState, useMemo, useCallback } from 'react';
import { ConfigProvider, Calendar as AntdCalendar, Badge, Tooltip, Spin, Alert, Card, message } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/az';
import az from 'antd/locale/az_AZ';
import notesApi from "../../api/notesApi"
import "../../styles/calendar.css";

import { useCalendarData } from './hooks/useCalendarData';
import { statusMap } from './utils/constants';
import CalendarSidebar from './components/CalendarSidebar';
import NoteModal from './components/NoteModal';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale('az');

const getStatusInfo = (status) => statusMap[status] || { text: status, color: '#d9d9d9' };

function Calendar() {
    const [viewDate, setViewDate] = useState(dayjs());
    const [calendarMode, setCalendarMode] = useState('month');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [clickedDate, setClickedDate] = useState(null);

    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [noteInput, setNoteInput] = useState('');
    const [editingNote, setEditingNote] = useState(null);

    const { tasks, notes, loading, error, setNotes } = useCalendarData(viewDate, calendarMode);

    // Memoized derived states
    const getTasksForMonth = useCallback((monthDate) => tasks.filter(task => dayjs(task.endDate).isSame(monthDate, 'month')), [tasks]);
    const getTasksForDate = useCallback((date) => tasks.filter((task) => dayjs(date).isSame(dayjs(task.endDate), 'day')), [tasks]);
    const getNoteForDate = useCallback((date) => notes.find(note => dayjs(note.date).isSame(date, 'day')), [notes]);

    const isDayViewActive = !!clickedDate;
    const tasksForMonth = useMemo(() => getTasksForMonth(viewDate).sort((a, b) => dayjs(a.endDate).diff(dayjs(b.endDate))), [getTasksForMonth, viewDate]);
    const tasksForDay = useMemo(() => isDayViewActive ? getTasksForDate(clickedDate) : [], [isDayViewActive, getTasksForDate, clickedDate]);
    const tasksToShow = isDayViewActive ? tasksForDay : tasksForMonth;
    const selectedDateNote = useMemo(() => getNoteForDate(selectedDate), [getNoteForDate, selectedDate]);
    
    const upcomingTasks = useMemo(() => {
        const today = dayjs().startOf('day');
        const nextWeek = today.add(7, 'day').endOf('day');
        return tasks.filter((task) => dayjs(task.endDate).isBetween(today, nextWeek, null, '[]') && task.status !== 'DONE')
            .sort((a, b) => dayjs(a.endDate).diff(dayjs(b.endDate)));
    }, [tasks]);
    
    const monthlyStats = useMemo(() => ({
        total: tasksForMonth.length,
        done: tasksForMonth.filter((t) => t.status === 'DONE').length,
        inProgress: tasksForMonth.filter((t) => t.status === 'IN_PROGRESS').length,
        todo: tasksForMonth.filter((t) => t.status === 'TODO').length,
    }), [tasksForMonth]);


    // Handlers
    const handlePanelChange = (date, mode) => {
        setViewDate(date);
        setCalendarMode(mode);
        setClickedDate(null);
    };

    const handleSelect = (date) => {
        if (calendarMode === 'year') {
            handlePanelChange(date, 'month');
        } else {
            if (!date.isSame(viewDate, 'month')) {
                setViewDate(date);
                setClickedDate(null);
            } else {
                setClickedDate(date);
            }
            setSelectedDate(date);
        }
    };

    const handleOpenNoteModal = (note = null) => {
        setEditingNote(note);
        setNoteInput(note ? note.content : '');
        setIsNoteModalOpen(true);
    };

    const handleSaveNote = async () => {
        if (!noteInput.trim()) {
            message.warning('Qeyd boş ola bilməz.');
            return;
        }
        const noteData = { id: editingNote?.id, date: selectedDate.format('YYYY-MM-DD'), content: noteInput.trim() };
        try {
            const response = await notesApi.saveNote(noteData);
            if (editingNote) {
                setNotes(notes.map(n => n.id === editingNote.id ? response.data : n));
                message.success('Qeyd uğurla yeniləndi!');
            } else {
                setNotes([...notes, response.data]);
                message.success('Qeyd uğurla əlavə edildi!');
            }
        } catch (error) {
            message.error('Qeydi saxlamaq mümkün olmadı.', error);
        } finally {
            setIsNoteModalOpen(false);
            setNoteInput('');
            setEditingNote(null);
        }
    };
    
    const handleDeleteNote = async () => {
        if (!selectedDateNote) return;
        try {
            await notesApi.deleteNote(selectedDateNote.id);
            setNotes(notes.filter(n => n.id !== selectedDateNote.id));
            message.success('Qeyd silindi.');
        } catch (error) {
            message.error('Qeydi silmək mümkün olmadı.', error);
        }
    };


    // Renders
    const dateCellRender = (date) => {
        const activeTasks = getTasksForDate(date);
        const note = getNoteForDate(date);
        if (!activeTasks.length && !note) return null;
        return (
            <div className="calendar-events">
                {activeTasks.slice(0, 2).map((task) => (
                    <Tooltip key={task.id} title={<div>...</div>} placement="topLeft">
                        <div className="timeline-task single-day-task" style={{ backgroundColor: getStatusInfo(task.status).color }}>
                            <div className="task-content"><span className="task-title">{task.title}</span></div>
                        </div>
                    </Tooltip>
                ))}
                {note && (
                    <div className="note-indicator">
                        <Tooltip title={note.content}><Badge color="purple" text={<span className="note-text">📝</span>} /></Tooltip>
                    </div>
                )}
                {activeTasks.length > 2 && <div className="more-items">+{activeTasks.length - 2}</div>}
            </div>
        );
    };

    const monthCellRender = (monthDate) => {
        if (!monthDate.isSame(viewDate, 'year')) return null;
        const tasksInMonth = getTasksForMonth(monthDate);
        if (tasksInMonth.length === 0) return null;
        return (
            <div className="month-events">
                <ul className="p-0 m-0 list-none">
                    {tasksInMonth.slice(0, 3).map(task => (
                        <li key={task.id} className="text-xs truncate overflow-hidden">
                            <Badge color={getStatusInfo(task.status).color} /><span className="ml-1">{task.title}</span>
                        </li>
                    ))}
                    {tasksInMonth.length > 3 && <li>...</li>}
                </ul>
            </div>
        );
    };

    if (error) { return <Alert message="Xəta" description={error} type="error" showIcon className="m-4" />; }

    return (
        <ConfigProvider locale={az}>
            <div className='calendar-page'>
                <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Təqvim</h2>
                <Spin spinning={loading} tip="Məlumatlar yüklənir..." size="large">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3">
                            <Card className="shadow-md calendar-card">
                                <AntdCalendar
                                    dateCellRender={dateCellRender}
                                    monthCellRender={monthCellRender}
                                    onSelect={handleSelect}
                                    onPanelChange={handlePanelChange}
                                    value={selectedDate}
                                    className="custom-calendar"
                                />
                            </Card>
                        </div>
                        <CalendarSidebar
                            isDayViewActive={isDayViewActive}
                            clickedDate={clickedDate}
                            viewDate={viewDate}
                            tasksToShow={tasksToShow}
                            calendarMode={calendarMode}
                            selectedDate={selectedDate}
                            selectedDateNote={selectedDateNote}
                            upcomingTasks={upcomingTasks}
                            monthlyStats={monthlyStats}
                            onBackClick={() => setClickedDate(null)}
                            onOpenNoteModal={handleOpenNoteModal}
                            onDeleteNote={handleDeleteNote}
                        />
                    </div>
                </Spin>

                <NoteModal
                    open={isNoteModalOpen}
                    onOk={handleSaveNote}
                    onCancel={() => setIsNoteModalOpen(false)}
                    noteInput={noteInput}
                    onNoteInputChange={(e) => setNoteInput(e.target.value)}
                    selectedDate={selectedDate}
                    editingNote={editingNote}
                />
            </div>
        </ConfigProvider>
    );
}

export default Calendar;