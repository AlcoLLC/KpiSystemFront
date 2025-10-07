import React from 'react';
import { Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowRightOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { STATUS_TRANSITIONS } from '../../../features/tasks/utils/taskUtils.jsx';

const ActionButton = ({ icon, tooltip, onClick, colorClass }) => (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      className={`flex h-8 w-8 items-center justify-center rounded-md ${colorClass} transition-colors`}
    >
      {icon}
    </button>
);

const TaskActions = ({ record, onEdit, onDelete, onStatusChange, permissions }) => {
  const isAdmin = permissions.userRole === 'admin';

  if (!isAdmin) {
    if (record.status === 'DONE') {
      return (
          <CheckCircleOutlined style={{ fontSize: '22px', color: '#52c41a' }} />
      );
    }
    if (record.status === 'CANCELLED') {
      return (
          <CloseCircleOutlined style={{ fontSize: '22px', color: '#ff4d4f' }} />
      );
    }
  }

  const transition = STATUS_TRANSITIONS[record.status];
  const canChangeStatus = transition && permissions.canChangeStatus(record);
  const canEdit = permissions.canEdit(record);
  const canDelete = permissions.canDelete(record);
  const hasAnyActions = canChangeStatus || canEdit || canDelete;


  if (hasAnyActions) {
    return (
      <Space size={4} wrap>
        {canChangeStatus && (
          <ActionButton
            icon={<ArrowRightOutlined style={{ fontSize: '20px' }} />}
            tooltip={transition.label}
            onClick={() => onStatusChange(record)}
            colorClass="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
          />
        )}
        {canEdit && (
          <ActionButton
            icon={<EditOutlined style={{ fontSize: '20px' }} />}
            onClick={() => onEdit(record)}
            colorClass="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
          />
        )}
        {canDelete && (
          <ActionButton
            icon={<DeleteOutlined style={{ fontSize: '20px' }} />}
            onClick={() => onDelete(record)}
            colorClass="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
          />
        )}
      </Space>
    );
  }

  return (
      <ClockCircleOutlined  style={{ fontSize: '22px', color: '#faad14' }} />
  );
};

export default TaskActions;