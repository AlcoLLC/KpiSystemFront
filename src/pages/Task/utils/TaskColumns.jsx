import React from 'react';
import { Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { STATUS_COLORS, PRIORITY_COLORS } from './taskConstants';
import TaskActions from '../components/TaskActions';

export const getTaskColumns = (pagination, actions, permissions) => {
  const allColumns = [
    {
      title: '№',
      key: 'index',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: 'Başlıq',
      dataIndex: 'title',
      key: 'title',
      width: 220,
      render: (text) =>
        text && text.length > 100 ? (
          <Tooltip title={text}>{`${text.substring(0, 100)}...`}</Tooltip>
        ) : (
          text
        )
    },
    {
      title: 'İcraçı',
      dataIndex: 'assignee_details',
      key: 'assignee_details',
      width: 120
    },
    {
      title: 'Status',
      dataIndex: 'status_display',
      key: 'status',
      width: 120,
      render: (status) => <Tag color={STATUS_COLORS[status] || 'default'}>{status}</Tag>
    },
    {
      title: 'Prioritet',
      dataIndex: 'priority_display',
      key: 'priority',
      width: 100,
      render: (priority) => <Tag color={PRIORITY_COLORS[priority] || 'default'}>{priority}</Tag>
    },
    {
      title: 'Başlama',
      dataIndex: 'start_date',
      key: 'start_date',
      width: 100,
      render: (date) => (date ? dayjs(date).format('DD MMM YYYY') : '-')
    },
    {
      title: 'Bitmə',
      dataIndex: 'due_date',
      key: 'due_date',
      width: 100,
      render: (date) => (date ? dayjs(date).format('DD MMM YYYY') : '-')
    },
    {
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
        />
      )
    }
  ];

  // İcazəyə görə "İcraçı" sütununu gizlət
  if (!permissions.showAssigneeColumn) {
    return allColumns.filter((col) => col.key !== 'assignee_details');
  }

  return allColumns;
};
