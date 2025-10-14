import { Button, Tag, Card, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined, CalendarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { statusMap, priorityMap } from '../utils/constants';

const getStatusInfo = (status) => statusMap[status] || { text: status, color: '#d9d9d9' };
const getPriorityInfo = (priority) => priorityMap[priority] || { text: priority, color: 'default' };

const CalendarSidebar = ({
    isDayViewActive,
    clickedDate,
    viewDate,
    tasksToShow,
    calendarMode,
    selectedDate,
    selectedDateNote,
    upcomingTasks,
    monthlyStats,
    onBackClick,
    onOpenNoteModal,
    onDeleteNote
}) => {
    const panelTitle = isDayViewActive ? clickedDate.format('D MMMM YYYY') : viewDate.format('MMMM YYYY');
    const listTitle = isDayViewActive ? 'Günün Tapşırıqları' : 'Ay üzrə Tapşırıqlar';

    const mainCardTitle = calendarMode === 'year'
        ? viewDate.format('YYYY')
        : <div className="flex items-center gap-2"><CalendarOutlined /><span>{panelTitle}</span></div>;

    return (
        <div className="space-y-4">
            <Card
                title={mainCardTitle}
                className="shadow-md"
                size="small"
            >
                {calendarMode !== 'year' ? (
                    <>
                        <div className="mb-4">
                            {isDayViewActive && (
                                <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBackClick} className="p-0 mb-2">
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

                        {isDayViewActive && (
                            <>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                            Şəxsi Qeyd <span className='text-xs text-gray-500'>({selectedDate.format('D MMM')})</span>
                                        </h4>
                                        <Button type="text" size="small" icon={<PlusOutlined />} onClick={() => onOpenNoteModal(selectedDateNote)}>
                                            {selectedDateNote ? "Redaktə et" : "Əlavə et"}
                                        </Button>
                                    </div>
                                    {selectedDateNote ? (
                                        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
                                            <div className="flex items-start justify-between mb-2">
                                                <p className="text-sm text-gray-800 dark:text-gray-200 flex-1 whitespace-pre-wrap">{selectedDateNote.content}</p>
                                                <div className="flex space-x-1 ml-2">
                                                    <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onOpenNoteModal(selectedDateNote)} />
                                                    <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={onDeleteNote} />
                                                </div>
                                            </div>
                                            <span className="text-xs text-purple-600 dark:text-purple-400">📝 Şəxsi qeyd</span>
                                        </div>
                                    ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Seçilən gün üçün qeyd yoxdur" className="my-4" />)}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Təqvumdən bir ay seçin" className="my-4 py-8" />
                )}
            </Card>

            <Card title="Yaxın Tapşırıqlar" className="shadow-md" size="small">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {upcomingTasks.length > 0 ? (upcomingTasks.map((task) => (
                        <div key={task.id} className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate flex-1 pr-2">{task.title}</span>
                                <Tag color={getPriorityInfo(task.priority).color} size="small">{getPriorityInfo(task.priority).text}</Tag>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Bitiş: {dayjs(task.endDate).format('DD MMMM')}</div>
                        </div>
                    ))) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Yaxın tapşırıq yoxdur" className="my-2" />)}
                </div>
            </Card>
            
            {calendarMode !== 'year' && (
                <Card title="Aylıq Statistika (Görünən)" className="shadow-md" size="small">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center"><span className="text-sm text-gray-600 dark:text-gray-400">Cəmi:</span><span className="font-semibold text-blue-600">{monthlyStats.total}</span></div>
                        <div className="flex justify-between items-center"><span className="text-sm text-gray-600 dark:text-gray-400">Tamamlanmış:</span><span className="font-semibold text-green-600">{monthlyStats.done}</span></div>
                        <div className="flex justify-between items-center"><span className="text-sm text-gray-600 dark:text-gray-400">Davam edir:</span><span className="font-semibold text-blue-600">{monthlyStats.inProgress}</span></div>
                        <div className="flex justify-between items-center"><span className="text-sm text-gray-600 dark:text-gray-400">Təsdiqlənib:</span><span className="font-semibold text-orange-600">{monthlyStats.todo}</span></div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default CalendarSidebar;