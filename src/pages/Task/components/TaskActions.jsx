import React from 'react';
import { Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowRightOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined  } from '@ant-design/icons';
import { STATUS_TRANSITIONS } from '../utils/taskConstants';

const ActionButton = ({ icon, tooltip, onClick, colorClass }) => (
  <Tooltip title={tooltip}>
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      className={`flex h-8 w-8 items-center justify-center rounded-md ${colorClass} transition-colors`}
    >
      {icon}
    </button>
  </Tooltip>
);

const TaskActions = ({ record, onEdit, onDelete, onStatusChange, permissions }) => {
  if (record.status === 'DONE') {
    return <CheckCircleOutlined style={{ fontSize: '22px', color: '#52c41a' }} />;
  }

  if (record.status === 'CANCELLED') {
    return (
        <CloseCircleOutlined style={{ fontSize: '22px', color: '#ff4d4f' }} />
    );
  }
  const transition = STATUS_TRANSITIONS[record.status];
  const hasAnyActions = transition && permissions.canChangeStatus(record) || permissions.canEdit(record) || permissions.canDelete(record);

  if (hasAnyActions) {
  return (
    <Space size={4} wrap>
      {transition && permissions.canChangeStatus(record) && (
        <ActionButton
          icon={<ArrowRightOutlined style={{ fontSize: '20px' }} />}
          tooltip={transition.label}
          onClick={() => onStatusChange(record)}
          colorClass="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
        />
      )}
      {permissions.canEdit(record) && (
        <ActionButton
          icon={<EditOutlined style={{ fontSize: '20px' }} />}
          onClick={() => onEdit(record)}
          colorClass="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
        />
      )}
      {permissions.canDelete(record) && (
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