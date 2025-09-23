import React from 'react';
import BaseModal from '../../../components/BaseModal';
import Details from '../../../components/Details';
import { generateDetailsItems } from '../../../features/tasks/utils/taskUtils.jsx';

const TaskDetailsModal = ({ open, onCancel, record }) => {
  return (
    <BaseModal title="Tapşırıq Məlumatları" open={open} onCancel={onCancel} footer={null}>
      <Details items={generateDetailsItems(record)} />
    </BaseModal>
  );
};

export default TaskDetailsModal;