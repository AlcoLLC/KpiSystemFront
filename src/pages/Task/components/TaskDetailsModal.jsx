import React from 'react';
import { Modal, Tag, Avatar, Divider, Row, Col } from 'antd';
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

// --- BÜTÜN KÖMƏKÇİ FUNKSİYALAR VƏ KOMPONENTLƏR BURADA, ƏSAS KOMPONENTDƏN ƏVVƏL TƏYİN OLUNUR ---

const DetailSection = ({ icon, title, children }) => (
    <div>
        <h4 className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
            {icon}
            <span className="ml-2">{title}</span>
        </h4>
        <div className="pl-6 space-y-2">{children}</div>
    </div>
);

const UserCard = ({ user, role }) => (
    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <Avatar size={48} src={user?.profile_photo} icon={<UserOutlined />} />
        <p className="font-semibold mt-2 text-gray-800 dark:text-gray-200">
            {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '-'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
    </div>
);

const DateInfo = ({ label, date }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <span className="font-medium text-gray-600 dark:text-gray-400">{label}:</span>
        <span className="text-gray-800 dark:text-gray-200">{date ? dayjs(date).format('DD MMMM YYYY') : '-'}</span>
    </div>
);

// DÜZƏLİŞ: Bu funksiyanı modal komponentindən əvvələ köçürdük
const getStatusIcon = (status) => {
    switch(status) {
        case 'Tamamlanıb': return <CheckCircleOutlined className="text-green-500" />;
        case 'Davam edir': return <SyncOutlined spin className="text-blue-500" />;
        case 'Gözləmədə': return <ClockCircleOutlined className="text-yellow-500" />;
        case 'Ləğv edilib': return <CloseCircleOutlined className="text-red-500" />;
        case 'Təsdiqlənib': return <CheckCircleOutlined className="text-green-500" />;
        default: return <InfoCircleOutlined />;
    }
};

// --- ƏSAS KOMPONENT ---

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
        footer={null}
        width={600}
        destroyOnClose
    >
        <div className="space-y-6 p-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{record.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{record.description || 'Təsvir əlavə edilməyib.'}</p>
            </div>
            
            <Divider className="dark:border-gray-600" />

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

            <div>
                <Row gutter={16}>
                    <Col span={12}>
                        <UserCard user={record.created_by_obj} role="Təyinatçı" />
                    </Col>
                    <Col span={12}>
                        <UserCard user={record.assignee_obj} role="İcraçı" />
                    </Col>
                </Row>
            </div>

            <div>
                 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <DateInfo label="Yaradıldı" date={record.created_at} />
                    <DateInfo label="Başlama" date={record.start_date} />
                    <DateInfo label="Bitmə" date={record.due_date} />
                </div>
            </div>
        </div>
    </Modal>
  );
};

export default TaskDetailsModal;