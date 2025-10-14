import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { message } from 'antd';
import ReusableTable from '../../../components/ReusableTable';
import TaskDetailsModal from '../../Task/components/TaskDetailsModal';
import tasksApi from '../../../api/tasksApi';
import useAuth from '../../../hooks/useAuth';
import { getTaskTableColumns } from '../../../features/tasks/utils/taskUtils.jsx';

const RecentTasksTable = () => {
  const { user } = useAuth(); 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  
  const permissions = useMemo(() => {
    if (!user) return { showAssigneeColumn: false };
    return {
      showAssigneeColumn: user.role !== 'employee'
    };
  }, [user]);

  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        const response = await tasksApi.getTasks({ page_size: 5, ordering: '-created_at' });
        const responseData = response.data;
        setTasks(responseData.results || responseData || []);
      } catch (error) {
        message.error('Son tapşırıqları yükləmək mümkün olmadı.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentTasks();
  }, []);

  const handleRowClick = (record) => {
    setCurrentRecord(record);
    setIsViewOpen(true);
  };

  const columns = useMemo(() => getTaskTableColumns(permissions), [permissions]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Son Tapşırıqlar</h3>
      <ReusableTable
        columns={columns}
        dataSource={tasks}
        onRowClick={handleRowClick}
        pagination={false}
        loading={loading}
        rowKey="id"
      />
      <div className="mt-4 flex justify-end">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-black transition-colors duration-500"
        >
          Bütün tapşırıqlar
          <FaArrowRight size={14} />
        </Link>
      </div>

      <TaskDetailsModal 
        open={isViewOpen} 
        onCancel={() => setIsViewOpen(false)} 
        record={currentRecord} 
      />
    </div>
  );
};

export default React.memo(RecentTasksTable);