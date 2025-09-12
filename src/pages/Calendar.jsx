import React, { useState } from 'react';
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
  Progress
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/az';

const { TextArea } = Input;

dayjs.extend(isBetween);
dayjs.locale('az');

// Sample task data
const tasksData = [
  {
    id: 1,
    title: 'Hotel management system',
    startDate: '2025-09-08',
    endDate: '2025-09-15',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: 'User 1',
    progress: 65,
    description: 'Hotel rezervasyon və otaq idarəetmə sistemi'
  },
  {
    id: 2,
    title: 'Product development',
    startDate: '2025-09-14',
    endDate: '2025-09-20',
    status: 'TODO',
    priority: 'MEDIUM',
    assignee: 'User 2',
    progress: 0,
    description: 'Yeni məhsulun ikinci versiyasının hazırlanması'
  },
  {
    id: 3,
    title: 'Python upgrade',
    startDate: '2025-09-18',
    endDate: '2025-09-25',
    status: 'DONE',
    priority: 'LOW',
    assignee: 'User 3',
    progress: 100,
    description: 'Python versiyasının 3.12-ə yüksəldilməsi'
  },
  {
    id: 4,
    title: 'UI/UX Design Review',
    startDate: '2025-09-22',
    endDate: '2025-09-28',
    status: 'TODO',
    priority: 'HIGH',
    assignee: 'User 1',
    progress: 0,
    description: 'İstifadəçi interfeysi və təcrübə dizaynının yoxlanılması'
  },
  {
    id: 5,
    title: 'Database Optimization',
    startDate: '2025-09-25',
    endDate: '2025-10-02',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    assignee: 'User 2',
    progress: 30,
    description: 'Məlumat bazasının performansının optimallaşdırılması'
  }
];

function Calendar() {
  const [notes, setNotes] = useState({
    '2025-09-18': 'Marketinq departamenti ilə iclas.',
    '2025-09-25': 'Rüblük hesabatı təqdim etmək.',
    '2025-09-30': 'Yeni layihə planlaması'
  });

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  // Status colors
  const getStatusColor = (status) => {
    const colors = {
      TODO: '#faad14',
      IN_PROGRESS: '#1890ff',
      DONE: '#52c41a',
      CRITICAL: '#ff4d4f'
    };
    return colors[status] || '#d9d9d9';
  };

  // Priority colors
  const getPriorityColor = (priority) => {
    const colors = {
      CRITICAL: 'red',
      HIGH: 'volcano',
      MEDIUM: 'gold',
      LOW: 'green'
    };
    return colors[priority] || 'default';
  };

  // Get progress color
  const getProgressColor = (progress) => {
    if (progress === 100) return '#52c41a';
    if (progress >= 70) return '#1890ff';
    if (progress >= 40) return '#faad14';
    return '#ff7875';
  };

  // Check if task is active on specific date
  const isTaskActiveOnDate = (task, date) => {
    const start = dayjs(task.startDate);
    const end = dayjs(task.endDate);
    return date.isBetween(start, end, 'day', '[]');
  };

  // Get tasks for date
  const getTasksForDate = (date) => {
    return tasksData.filter((task) => isTaskActiveOnDate(task, date));
  };

  // Get notes for date
  const getNotesForDate = (date) => {
    const dateString = date.format('YYYY-MM-DD');
    return notes[dateString] || null;
  };

  // Get task timeline position
  const getTaskTimeline = (task, date) => {
    const start = dayjs(task.startDate);
    const end = dayjs(task.endDate);
    const totalDays = end.diff(start, 'day') + 1;
    const currentDay = date.diff(start, 'day') + 1;

    let position = 'middle';
    if (date.isSame(start, 'day')) position = 'start';
    else if (date.isSame(end, 'day')) position = 'end';

    return { position, currentDay, totalDays };
  };

  // Calendar cell render
  const dateCellRender = (date) => {
    const activeTasks = getTasksForDate(date);
    const note = getNotesForDate(date);

    if (activeTasks.length === 0 && !note) return null;

    return (
      <div className="calendar-events">
        {/* Tasks */}
        {activeTasks.slice(0, 2).map((task) => {
          const timeline = getTaskTimeline(task, date);
          const statusColor = getStatusColor(task.status);

          return (
            <Tooltip
              key={task.id}
              title={
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs mt-1">
                    {dayjs(task.startDate).format('DD.MM')} - {dayjs(task.endDate).format('DD.MM')}
                  </div>
                  <div className="text-xs">
                    Status:{' '}
                    {task.status === 'TODO'
                      ? 'Gözləyir'
                      : task.status === 'IN_PROGRESS'
                      ? 'İcrada'
                      : 'Tamamlandı'}
                  </div>
                  {task.progress > 0 && <div className="text-xs">İrəliləyiş: {task.progress}%</div>}
                </div>
              }
              placement="topLeft"
            >
              <div
                className={`timeline-task ${timeline.position}`}
                style={{
                  backgroundColor: statusColor,
                  opacity: task.status === 'DONE' ? 0.6 : 0.9
                }}
              >
                <div className="task-content">
                  <span className="task-title">{task.title}</span>
                  {timeline.position === 'start' && (
                    <span className="task-days">({timeline.totalDays} gün)</span>
                  )}
                </div>
                {task.progress > 0 && task.status !== 'DONE' && (
                  <div className="task-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${task.progress}%`,
                        backgroundColor: 'rgba(255,255,255,0.8)'
                      }}
                    />
                  </div>
                )}
              </div>
            </Tooltip>
          );
        })}

        {/* Note indicator */}
        {note && (
          <div className="note-indicator">
            <Badge color="purple" text={<span className="note-text">📝</span>} />
          </div>
        )}

        {/* More items indicator */}
        {activeTasks.length > 2 && (
          <div className="more-items">
            <span>+{activeTasks.length - 2}</span>
          </div>
        )}
      </div>
    );
  };

  // Handle date select
  const handleSelect = (date) => {
    setSelectedDate(date);
  };

  // Note modal handlers
  const handleOpenNoteModal = (note = null) => {
    setEditingNote(note);
    setNoteInput(note || '');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = () => {
    const dateString = selectedDate.format('YYYY-MM-DD');
    const newNotes = { ...notes };

    if (noteInput && noteInput.trim() !== '') {
      newNotes[dateString] = noteInput.trim();
    } else {
      delete newNotes[dateString];
    }

    setNotes(newNotes);
    setIsNoteModalOpen(false);
    setNoteInput('');
    setEditingNote(null);
  };

  const handleDeleteNote = () => {
    const dateString = selectedDate.format('YYYY-MM-DD');
    const newNotes = { ...notes };
    delete newNotes[dateString];
    setNotes(newNotes);
    setIsNoteModalOpen(false);
    setNoteInput('');
    setEditingNote(null);
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const selectedDateNote = getNotesForDate(selectedDate);

  // Get upcoming tasks (next 7 days)
  const getUpcomingTasks = () => {
    const today = dayjs();
    const nextWeek = today.add(7, 'day');

    return tasksData.filter((task) => {
      const startDate = dayjs(task.startDate);
      const endDate = dayjs(task.endDate);
      return (
        (startDate.isBetween(today, nextWeek, 'day', '[]') ||
          endDate.isBetween(today, nextWeek, 'day', '[]') ||
          today.isBetween(startDate, endDate, 'day', '[]')) &&
        task.status !== 'DONE'
      );
    });
  };

  const upcomingTasks = getUpcomingTasks();

  return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Təqvim</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card className="shadow-md calendar-card">
            <AntdCalendar
              dateCellRender={dateCellRender}
              onSelect={handleSelect}
              value={selectedDate}
              className="custom-calendar"
            />
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Selected Date Info */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <CalendarOutlined />
                <span>{selectedDate.format('D MMMM YYYY')}</span>
              </div>
            }
            className="shadow-md"
            size="small"
          >
            {/* Tasks */}
            <div className="mb-4">
              <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ClockCircleOutlined />
                Aktiv Tapşırıqlar ({selectedDateTasks.length})
              </h4>

              {selectedDateTasks.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm text-gray-800 dark:text-gray-200 flex-1">
                          {task.title}
                        </h5>
                        <Tag color={getPriorityColor(task.priority)} size="small">
                          {task.priority}
                        </Tag>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between mb-2">
                        <Tag color={getStatusColor(task.status).replace('#', '')} size="small">
                          {task.status === 'TODO'
                            ? 'Gözləyir'
                            : task.status === 'IN_PROGRESS'
                            ? 'İcrada'
                            : 'Tamamlandı'}
                        </Tag>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.assignee}
                        </span>
                      </div>

                      {task.progress > 0 && task.status !== 'DONE' && (
                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500">İrəliləyiş</span>
                            <span className="text-xs text-gray-500">{task.progress}%</span>
                          </div>
                          <Progress
                            percent={task.progress}
                            size="small"
                            strokeColor={getProgressColor(task.progress)}
                            showInfo={false}
                          />
                        </div>
                      )}

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {dayjs(task.startDate).format('DD.MM')} -{' '}
                        {dayjs(task.endDate).format('DD.MM')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Bu gün üçün tapşırıq yoxdur"
                  className="my-4"
                />
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Şəxsi Qeyd</h4>
                <Button
                  type="text"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => handleOpenNoteModal()}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Əlavə et
                </Button>
              </div>

              {selectedDateNote ? (
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-800 dark:text-gray-200 flex-1">
                      {selectedDateNote}
                    </p>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenNoteModal(selectedDateNote)}
                        className="text-blue-500 hover:text-blue-600"
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteNote}
                        className="text-red-500 hover:text-red-600"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-purple-600 dark:text-purple-400">
                    📝 Şəxsi qeyd
                  </span>
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Bu gün üçün qeyd yoxdur"
                  className="my-4"
                />
              )}
            </div>
          </Card>

          {/* Upcoming Tasks */}
          <Card title="Yaxın Tapşırıqlar" className="shadow-md" size="small">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate flex-1">
                        {task.title}
                      </span>
                      <Tag color={getPriorityColor(task.priority)} size="small">
                        {task.priority}
                      </Tag>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(task.startDate).format('DD.MM')} -{' '}
                      {dayjs(task.endDate).format('DD.MM')}
                    </div>
                  </div>
                ))
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Yaxın tapşırıq yoxdur"
                  className="my-2"
                />
              )}
            </div>
          </Card>

          {/* Monthly Stats */}
          <Card title="Aylıq Statistika" className="shadow-md" size="small">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cəmi:</span>
                <span className="font-semibold text-blue-600">{tasksData.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tamamlanmış:</span>
                <span className="font-semibold text-green-600">
                  {tasksData.filter((t) => t.status === 'DONE').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">İcrada:</span>
                <span className="font-semibold text-blue-600">
                  {tasksData.filter((t) => t.status === 'IN_PROGRESS').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gözləyir:</span>
                <span className="font-semibold text-orange-600">
                  {tasksData.filter((t) => t.status === 'TODO').length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Note Modal */}
      <Modal
        title={editingNote ? 'Qeydi Redaktə et' : 'Yeni Qeyd Əlavə et'}
        open={isNoteModalOpen}
        onOk={handleSaveNote}
        onCancel={() => setIsNoteModalOpen(false)}
        okText="Saxla"
        cancelText="Ləğv et"
        okButtonProps={{ disabled: !noteInput.trim() }}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {selectedDate.format('D MMMM YYYY')} tarixinə qeyd əlavə edin
        </p>
        <TextArea
          rows={4}
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Məsələn: Həftəlik iclas, xatırlatma..."
        />
      </Modal>

      <style jsx>{`
        .calendar-card .ant-picker-calendar {
          background: transparent;
        }

        .calendar-events {
          padding: 2px;
          min-height: 24px;
        }

        .timeline-task {
          margin: 1px 0;
          padding: 2px 4px;
          border-radius: 3px;
          color: white;
          font-size: 10px;
          line-height: 1.2;
          position: relative;
          overflow: hidden;
        }

        .timeline-task.start {
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
          margin-right: -2px;
        }

        .timeline-task.end {
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
          margin-left: -2px;
        }

        .timeline-task.middle {
          border-radius: 0;
          margin: 1px -2px;
        }

        .task-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .task-title {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .task-days {
          font-size: 9px;
          opacity: 0.8;
          margin-left: 4px;
        }

        .task-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.2);
        }

        .progress-bar {
          height: 100%;
          transition: width 0.3s ease;
        }

        .note-indicator {
          margin: 1px 0;
        }

        .note-indicator .ant-badge {
          font-size: 10px;
        }

        .note-text {
          color: #722ed1;
          font-size: 10px;
        }

        .more-items {
          text-align: center;
          font-size: 9px;
          color: #666;
          margin-top: 1px;
        }

        .ant-picker-calendar-date-content {
          height: auto !important;
          min-height: 60px;
        }
      `}</style>
    </div>
  );
}

export default Calendar;
