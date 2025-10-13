import { useState } from 'react';
import { ConfigProvider, Calendar as AntdCalendar, Badge, Tooltip, Spin, Alert, Card } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/az';
import az from 'antd/locale/az_AZ';
import '../../styles/calendar.css';
import { useCalendarData } from './hooks/useCalendarData';
import { useNoteManager } from './hooks/useNoteManager';
import { useCalendarSelectors } from './hooks/useCalendarSelectors';
import CalendarSidebar from './components/CalendarSidebar';
import NoteModal from './components/NoteModal';
import { statusMap } from './utils/constants';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
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
    const { tasks, notes, loading, error, setNotes } = useCalendarData(viewDate, calendarMode);

    const selectors = useCalendarSelectors({ tasks, notes, viewDate, clickedDate, selectedDate });

    const { noteModalProps, handleOpenNoteModal, handleDeleteNote } = useNoteManager({ selectedDate, notes, setNotes });

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

    const dateCellRender = (date) => {
        const activeTasks = selectors.getTasksForDate(date);
        const note = selectors.getNoteForDate(date);
        if (!activeTasks.length && !note) return null;
        
        return (
            <div className="calendar-events">
                {activeTasks.slice(0, 2).map((task) => {
                    const statusInfo = getStatusInfo(task.status);
                    return (
                        <Tooltip 
                            key={task.id} 
                            title={
                                <div>
                                    <div className="font-medium">{task.title}</div>
                                    <div className="text-xs mt-1">Bitmə Tarixi: {dayjs(task.endDate).format('DD.MM.YYYY')}</div>
                                    <div className="text-xs">Status: {statusInfo.text}</div>
                                </div>
                            } 
                            placement="topLeft"
                        >
                            <div className="timeline-task single-day-task" style={{ backgroundColor: statusInfo.color }}>
                                <div className="task-content"><span className="task-title">{task.title}</span></div>
                            </div>
                        </Tooltip>
                    );
                })}
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
        const tasksInMonth = selectors.getTasksForMonth(monthDate);
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
                                />
                            </Card>
                        </div>
                        <CalendarSidebar
                            isDayViewActive={selectors.isDayViewActive}
                            clickedDate={clickedDate}
                            viewDate={viewDate}
                            tasksToShow={selectors.tasksToShow}
                            calendarMode={calendarMode}
                            selectedDate={selectedDate}
                            selectedDateNote={selectors.selectedDateNote}
                            upcomingTasks={selectors.upcomingTasks}
                            monthlyStats={selectors.monthlyStats}
                            onBackClick={() => setClickedDate(null)}
                            onOpenNoteModal={handleOpenNoteModal}
                            onDeleteNote={() => handleDeleteNote(selectors.selectedDateNote)}
                        />
                    </div>
                </Spin>
                <NoteModal {...noteModalProps} selectedDate={selectedDate} />
            </div>
        </ConfigProvider>
    );
}

export default Calendar;