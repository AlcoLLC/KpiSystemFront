import { Empty } from 'antd';
import { EyeOutlined, FileDoneOutlined } from "@ant-design/icons";
import TaskSection from './TaskSection';

const TaskList = ({ categorizedTasks, selectedFilter, filterOptions, onReview, onViewDetails, currentUser }) => {
    if (!categorizedTasks || Object.keys(categorizedTasks).length === 0) {
        return (
            <div className="text-center py-16">
                <Empty description="Qiymətləndirmə üçün tamamlanmış tapşırıq tapılmadı." />
            </div>
        );
    }
    
    if (selectedFilter === 'all') {
        return (
            <>
                <TaskSection
                    title="Qiymətləndirilməli Tapşırıqlar"
                    tasks={categorizedTasks.combinedTasksToEvaluate || []}
                    icon={<FileDoneOutlined />}
                    onReview={onReview}
                    onViewDetails={onViewDetails}
                    currentUser={currentUser}
                />
                <TaskSection
                    title="Bütün Dəyərləndirilən Tapşırıqlar"
                    tasks={categorizedTasks.combinedOtherTasks || []}
                    icon={<EyeOutlined />}
                    onReview={onReview}
                    onViewDetails={onViewDetails}
                    currentUser={currentUser}
                />
            </>
        );
    }
    
    const selectedOption = filterOptions.find(opt => opt.value === selectedFilter);
    const tasksToShow = categorizedTasks[selectedFilter] || [];
    
    return (
        <TaskSection
            title={selectedOption?.label}
            tasks={tasksToShow}
            icon={selectedOption?.icon}
            onReview={onReview}
            onViewDetails={onViewDetails}
            currentUser={currentUser}
        />
    );
};

export default TaskList;