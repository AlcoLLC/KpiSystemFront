import React from 'react';
import TaskActions from '../components/TaskActions';
import { getTaskTableColumns } from '../../../features/tasks/utils/taskUtils.jsx';

export const getTaskColumns = (pagination, actions, permissions, viewMode) => {
  const baseColumns = getTaskTableColumns(permissions);
  const numberColumn = { 
    title: '№', 
    key: 'index', 
    width: 60, 
    render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1 
  };

  const actionsColumn = {
    title: 'Əməliyyatlar', 
    key: 'action', 
    fixed: 'right', 
    width: 150, 
    align: 'center', 
    className: 'dark:bg-[#1B232D]',
    render: (_, record) => (
      <TaskActions 
        record={record}
        onEdit={actions.handleEdit}
        onDelete={actions.handleDelete}
        onStatusChange={actions.handleStatusChange}
        permissions={permissions}
        viewMode={viewMode}
      />
    )
  };

  return [numberColumn, ...baseColumns, actionsColumn];
};