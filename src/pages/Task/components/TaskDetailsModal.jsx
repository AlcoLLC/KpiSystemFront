import React from 'react';
import { Modal, Tag, Avatar, Divider } from 'antd';
import { 
    InfoCircleOutlined, 
    UserOutlined, 
    TeamOutlined, 
    CalendarOutlined,
    FlagOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../../features/tasks/utils/taskUtils.jsx';

// Kiçik köməkçi komponentlər
const DetailSection = ({ icon, title, children }) => (
    <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
            {icon}
            <span className="ml-2">{title}</span>
        </h4>
        <div className="pl-6 space-y-2">{children}</div>
    </div>
);

const UserInfo = ({ label, name }) => (
    <div className="flex items-center text-gray-800 dark:text-gray-200">
        <span className="w-24 font-medium text-gray-600 dark:text-gray-400">{label}:</span>
        <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
        <span>{name || '-'}</span>
    </div>
);

const DateInfo = ({ label, date }) => (
    <div className="flex items-center text-gray-800 dark:text-gray-200">
        <span className="w-24 font-medium text-gray-600 dark:text-gray-400">{label}:</span>
        <span>{date ? dayjs(date).format('DD MMMM YYYY') : '-'}</span>
    </div>
);

// Status ikonlarını təyin edən köməkçi funksiya
const getStatusIcon = (status) => {
    switch(status) {
        case 'Tamamlanıb': return <CheckCircleOutlined className="text-green-500" />;
        case 'Davam edir': return <SyncOutlined spin className="text-blue-500" />;
        case 'Gözləmədə': return <ClockCircleOutlined className="text-yellow-500" />;
        case 'Ləğv edilib': return <CloseCircleOutlined className="text-red-500" />;
        default: return <InfoCircleOutlined />;
    }
};

const TaskDetailsModal = ({ open, onCancel, record }) => {
  if (!record) return null;

  return (
    <Modal
        title={
            <div className="flex items-center text-gray-800 dark:text-white">
                <InfoCircleOutlined className="mr-2 text-xl" />
                Tapşırıq Məlumatları
            </div>
        }
        open={open}
        onCancel={onCancel}
        footer={null} // Footer-i ləğv edirik
        width={600}
        destroyOnClose
    >
        <div className="space-y-6 p-4">
            {/* Əsas Məlumat */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{record.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{record.description || 'Təsvir əlavə edilməyib.'}</p>
            </div>
            
            <Divider className="dark:border-gray-600" />

            {/* Status və Prioritet */}
            <div className="flex justify-around">
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <Tag 
                        icon={getStatusIcon(record.status_display)} 
                        color={STATUS_COLORS[record.status_display] || 'default'} 
                        className="text-base px-3 py-1"
                    >
                        {record.status_display}
                    </Tag>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Prioritet</p>
                    <Tag 
                        icon={<FlagOutlined />}
                        color={PRIORITY_COLORS[record.priority_display] || 'default'}
                        className="text-base px-3 py-1"
                    >
                        {record.priority_display}
                    </Tag>
                </div>
            </div>

            <Divider className="dark:border-gray-600" />

            {/* İnsanlar və Tarixlər */}
            <div className="space-y-4">
                <DetailSection icon={<TeamOutlined />} title="">
                    <UserInfo label="Yaradan" name={record.created_by_details} />
                    <UserInfo label="İcraçı" name={record.assignee_details} />
                </DetailSection>

                <DetailSection icon={<CalendarOutlined />} title="">
                    <DateInfo label="Yaradıldı" date={record.created_at} />
                    <DateInfo label="Başlama" date={record.start_date} />
                    <DateInfo label="Bitmə" date={record.due_date} />
                </DetailSection>
            </div>
        </div>
    </Modal>
  );
};

export default TaskDetailsModal;