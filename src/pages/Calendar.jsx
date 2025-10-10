import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar as AntdCalendar,
  Badge,
  Button,
  Input,
  Tag,
  Card,
  Empty,
  Modal,
  Tooltip,
  Spin,
  Alert,
  message
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/az';
import tasksApi from '../api/tasksApi';
import notesApi from '../api/notesApi';

const { TextArea } = Input;

// --- Day.js Configuration ---
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale('az');

// --- Helper Maps ---
const statusMap = {
    PENDING: { text: "Gözləmədə", color: '#fa8c16' },
    TODO: { text: "Təsdiqlənib", color: '#faad14' },
    IN_PROGRESS: { text: "Davam edir", color: '#1890ff' },
    DONE: { text: "Tamamlanıb", color: '#52c41a' },
    CANCELLED: { text: "Ləğv edilib", color: '#bfbfbf' }
};

const priorityMap = {
    CRITICAL: { text: "Çox vacib", color: 'red' },
    HIGH: { text: "Yüksək", color: 'volcano' },
    MEDIUM: { text: "Orta", color: 'gold' },
    LOW: { text: "Aşağı", color: 'green' }
};

// --- Helper Function to safely get Assignee Name ---
const getAssigneeName = (details) => {
    if (!details) { return 'Təyin edilməyib'; }
    if (typeof details === 'object' && details !== null && details.full_name) { return details.full_name; }
    if (typeof details === 'string' && details.trim() !== '') { return details; }
    return 'Naməlum';
};


function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewDate, setViewDate] = useState(dayjs());
  const [calendarMode, setCalendarMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [clickedDate, setClickedDate] = useState(null);

  const [notes, setNotes] = useState([]); // Will hold array of note objects: [{id, date, content}, ...]
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [editingNote, setEditingNote] = useState(null); // Will hold the full note object being edited

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

  const fetchData = useCallback(async (date, mode) => {
    try {
      setLoading(true);
      setError(null);
      let startRange, endRange;

      if (mode === 'year') {
        startRange = date.startOf('year').format('YYYY-MM-DD');
        endRange = date.endOf('year').format('YYYY-MM-DD');
      } else {
        startRange = date.startOf('month').subtract(1, 'week').format('YYYY-MM-DD');
        endRange = date.endOf('month').add(1, 'week').format('YYYY-MM-DD');
      }
      
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

  const getTasksForMonth = (monthDate) => tasks.filter(task => dayjs(task.endDate).isSame(monthDate, 'month'));
  const getTasksForDate = (date) => tasks.filter((task) => dayjs(date).isSame(dayjs(task.endDate), 'day'));
  const getNoteForDate = (date) => notes.find(note => dayjs(note.date).isSame(date, 'day'));
  
  const getStatusInfo = (status) => statusMap[status] || { text: status, color: '#d9d9d9' };
  const getPriorityInfo = (priority) => priorityMap[priority] || { text: priority, color: 'default' };
  
  const dateCellRender = (date) => {
    const activeTasks = getTasksForDate(date);
    const note = getNoteForDate(date);
    if (!activeTasks.length && !note) return null;
    return (
      <div className="calendar-events">
        {activeTasks.slice(0, 2).map((task) => {
          const statusInfo = getStatusInfo(task.status);
          return (
            <Tooltip key={task.id} title={
              <div>
                <div className="font-medium">{task.title}</div>
                <div className="text-xs mt-1">Bitiş Tarixi: {dayjs(task.endDate).format('DD.MM.YYYY')}</div>
                <div className="text-xs">Status: {statusInfo.text}</div>
              </div>
            } placement="topLeft">
              <div className="timeline-task single-day-task" style={{ backgroundColor: statusInfo.color, opacity: task.status === 'DONE' ? 0.6 : 0.9 }}>
                <div className="task-content">
                  <span className="task-title">{task.title}</span>
                </div>
              </div>
            </Tooltip>
          );
        })}
        {note && (
          <div className="note-indicator">
             <Tooltip title={note.content}>
               <Badge color="purple" text={<span className="note-text">📝</span>} />
            </Tooltip>
          </div>
        )}
        {activeTasks.length > 2 && (
          <div className="more-items">
            <span>+{activeTasks.length - 2}</span>
          </div>
        )}
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
              <Badge color={getStatusInfo(task.status).color} />
              <span className="ml-1">{task.title}</span>
            </li>
          ))}
          {tasksInMonth.length > 3 && <li>...</li>}
        </ul>
      </div>
    );
  };

  const handleOpenNoteModal = (note = null) => {
    setEditingNote(note);
    setNoteInput(note ? note.content : '');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async () => {
    const dateString = selectedDate.format('YYYY-MM-DD');
    if (!noteInput.trim()) {
        message.warning('Qeyd boş ola bilməz.');
        return;
    }

    const noteData = {
        id: editingNote ? editingNote.id : null,
        date: dateString,
        content: noteInput.trim()
    };

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
        message.error('Qeydi saxlamaq mümkün olmadı.');
        console.error("Failed to save note:", error);
    } finally {
        setIsNoteModalOpen(false);
        setNoteInput('');
        setEditingNote(null);
    }
  };

  const handleDeleteNote = async () => {
    const noteToDelete = getNoteForDate(selectedDate);
    if (!noteToDelete) return;

    try {
        await notesApi.deleteNote(noteToDelete.id);
        setNotes(notes.filter(n => n.id !== noteToDelete.id));
        message.success('Qeyd silindi.');
    } catch (error) {
        message.error('Qeydi silmək mümkün olmadı.');
        console.error("Failed to delete note:", error);
    } finally {
        setIsNoteModalOpen(false);
        setNoteInput('');
        setEditingNote(null);
    }
  };

  const getUpcomingTasks = () => {
    const today = dayjs().startOf('day');
    const nextWeek = today.add(7, 'day').endOf('day');
    return tasks.filter((task) => {
      const endDate = dayjs(task.endDate);
      return endDate.isBetween(today, nextWeek, null, '[]') && task.status !== 'DONE';
    }).sort((a, b) => dayjs(a.endDate).diff(dayjs(b.endDate)));
  };

  if (error) { return <Alert message="Xəta" description={error} type="error" showIcon className="m-4" />; }

  const isDayViewActive = !!clickedDate;
  const tasksForMonth = getTasksForMonth(viewDate).sort((a, b) => dayjs(a.endDate).diff(dayjs(b.endDate)));
  const tasksForDay = isDayViewActive ? getTasksForDate(clickedDate) : [];
  const tasksToShow = isDayViewActive ? tasksForDay : tasksForMonth;
  const panelTitle = isDayViewActive ? clickedDate.format('D MMMM YYYY') : viewDate.format('MMMM YYYY');
  const listTitle = isDayViewActive ? 'Günün Tapşırıqları' : 'Ay üzrə Tapşırıqlar';
  const selectedDateNote = getNoteForDate(selectedDate);
  const upcomingTasks = getUpcomingTasks();
  const monthlyStats = {
    total: tasksForMonth.length,
    done: tasksForMonth.filter((t) => t.status === 'DONE').length,
    inProgress: tasksForMonth.filter((t) => t.status === 'IN_PROGRESS').length,
    todo: tasksForMonth.filter((t) => t.status === 'TODO').length,
  };
  
  return (
    <div>
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
          <div className="space-y-4">
            <Card
              title={
                <div className="flex items-center gap-2">
                  <CalendarOutlined />
                  <span>{panelTitle}</span>
                </div>
              }
              className="shadow-md" size="small"
            >
              <div className="mb-4">
                {isDayViewActive && (
                    <Button 
                      type="link" 
                      icon={<ArrowLeftOutlined />} 
                      onClick={() => setClickedDate(null)}
                      className="p-0 mb-2"
                    >
                      Bütün aya bax
                    </Button>
                )}
                <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ClockCircleOutlined />
                  {listTitle} ({tasksToShow.length})
                </h4>
                {tasksToShow.length > 0 ? (
                  <div className="space-y-3 max-h-[22rem] overflow-y-auto pr-1">
                    {tasksToShow.map((task) => (
                      <div key={task.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm">
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="font-medium text-sm text-gray-800 dark:text-gray-200 break-words">{task.title}</h5>
                          {!isDayViewActive && <Tag className="shrink-0 font-mono">{dayjs(task.endDate).format('DD.MM')}</Tag>}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{task.description}</p>
                        <hr className="my-2 border-gray-200 dark:border-gray-600" />
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs items-center">
                          <span>Status:</span>
                          <div className="text-right"><Tag color={getStatusInfo(task.status).color} size="small" className="m-0">{getStatusInfo(task.status).text}</Tag></div>
                          <span>Prioritet:</span>
                          <div className="text-right"><Tag color={getPriorityInfo(task.priority).color} size="small" className="m-0">{getPriorityInfo(task.priority).text}</Tag></div>
                          <span>İcraçı:</span>
                          <span className="font-medium text-right">{task.assignee}</span>
                          <span className="text-gray-500 dark:text-gray-400">Başlama tarixi:</span>
                          <span className="font-medium text-right">{dayjs(task.startDate).format('DD.MM.YYYY')}</span>
                          <span className="text-gray-500 dark:text-gray-400">Bitmə tarixi:</span>
                          <span className="font-medium text-right">{dayjs(task.endDate).format('DD.MM.YYYY')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : ( 
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={isDayViewActive ? "Bu gün üçün tapşırıq yoxdur" : "Bu ay üçün tapşırıq yoxdur"} className="my-4" /> 
                )}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">
                    Şəxsi Qeyd <span className='text-xs text-gray-500'>({selectedDate.format('D MMM')})</span>
                  </h4>
                  <Button type="text" size="small" icon={<PlusOutlined />} onClick={() => handleOpenNoteModal(selectedDateNote)}>
                    {selectedDateNote ? "Redaktə et" : "Əlavə et"}
                  </Button>
                </div>
                {selectedDateNote ? (
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
                      <div className="flex items-start justify-between mb-2">
                          <p className="text-sm text-gray-800 dark:text-gray-200 flex-1 whitespace-pre-wrap">{selectedDateNote.content}</p>
                          <div className="flex space-x-1 ml-2">
                              <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleOpenNoteModal(selectedDateNote)}/>
                              <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={handleDeleteNote}/>
                          </div>
                      </div>
                      <span className="text-xs text-purple-600 dark:text-purple-400">📝 Şəxsi qeyd</span>
                  </div>
                ) : ( <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Seçilən gün üçün qeyd yoxdur" className="my-4" /> )}
              </div>
            </Card>

            <Card title="Yaxın Tapşırıqlar" className="shadow-md" size="small">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {upcomingTasks.length > 0 ? ( upcomingTasks.map((task) => ( <div key={task.id} className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"> <div className="flex items-center justify-between mb-1"> <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate flex-1 pr-2">{task.title}</span> <Tag color={getPriorityInfo(task.priority).color} size="small">{getPriorityInfo(task.priority).text}</Tag> </div> <div className="text-xs text-gray-500 dark:text-gray-400">Bitiş: {dayjs(task.endDate).format('DD MMMM')}</div> </div> )) ) : ( <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Yaxın tapşırıq yoxdur" className="my-2"/> )}
                </div>
            </Card>

            <Card title="Aylıq Statistika (Görünən)" className="shadow-md" size="small">
                <div className="space-y-3">
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600 dark:text-gray-400">Cəmi:</span><span className="font-semibold text-blue-600">{monthlyStats.total}</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600 dark:text-gray-400">Tamamlanmış:</span><span className="font-semibold text-green-600">{monthlyStats.done}</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600 dark:text-gray-400">Davam edir:</span><span className="font-semibold text-blue-600">{monthlyStats.inProgress}</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600 dark:text-gray-400">Təsdiqlənib:</span><span className="font-semibold text-orange-600">{monthlyStats.todo}</span></div>
                </div>
            </Card>
          </div>
        </div>
      </Spin>

      <Modal 
        title={editingNote ? 'Qeydi Redaktə et' : 'Yeni Qeyd Əlavə et'} 
        open={isNoteModalOpen} 
        onOk={handleSaveNote} 
        onCancel={() => setIsNoteModalOpen(false)} 
        okText="Yadda saxla" 
        cancelText="Ləğv et" 
        okButtonProps={{ disabled: !noteInput.trim() }}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{selectedDate.format('D MMMM YYYY')} tarixinə qeyd əlavə edin</p>
        <TextArea rows={4} value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Məsələn: Həftəlik iclas, xatırlatma..."/>
      </Modal>

      <style jsx global>{`
        .timeline-task { margin: 1px 0; padding: 2px 4px; border-radius: 3px; color: white; font-size: 10px; line-height: 1.2; position: relative; overflow: hidden; }
        .task-content { display: flex; align-items: center; justify-content: space-between; }
        .task-title { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
        .note-indicator { margin: 1px 0; }
        .note-text { color: #722ed1; font-size: 10px; }
        .more-items { text-align: center; font-size: 9px; color: #666; margin-top: 1px; }
        .single-day-task { border-radius: 6px !important; margin: 1px 0 !important; }
        .ant-picker-calendar-date-content { height: auto !important; min-height: 70px; }
      `}</style>
    </div>
  );
}

export default Calendar;