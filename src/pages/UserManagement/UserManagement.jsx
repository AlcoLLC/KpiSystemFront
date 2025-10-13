import React from 'react';
import { Tabs } from 'antd';
import { UserOutlined, ApartmentOutlined, SolutionOutlined } from '@ant-design/icons';
import UsersTab from './components/UsersTab';
import DepartmentsTab from './components/DepartmentsTab';
import PositionsTab from './components/PositionsTab';

const UserManagement = () => {
    const TabLabel = ({ icon, title }) => (
        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
            {icon}
            {title}
        </span>
    );

    const items = [
        {
            key: '1',
            label: <TabLabel icon={<UserOutlined />} title="İstifadəçilər" />,
            children: <UsersTab />,
        },
        {
            key: '2',
            label: <TabLabel icon={<ApartmentOutlined />} title="Departamentlər" />,
            children: <DepartmentsTab />,
        },
        {
            key: '3',
            label: <TabLabel icon={<SolutionOutlined />} title="Vəzifələr" />,
            children: <PositionsTab />,
        },
    ];

    return (
        <div>
             <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                İstifadəçilər
            </h2>
            <div className="p-4 sm:p-6 rounded-lg shadow-md bg-white dark:bg-[#1B232D]">
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </div>
    );
};

export default UserManagement;