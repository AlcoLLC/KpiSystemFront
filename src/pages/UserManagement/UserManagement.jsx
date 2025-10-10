import React from 'react';
import { Tabs } from 'antd';
import { UserOutlined, ApartmentOutlined, SolutionOutlined } from '@ant-design/icons';
import UsersTab from './components/UsersTab';
import DepartmentsTab from './components/DepartmentsTab';
import PositionsTab from './components/PositionsTab';

const UserManagement = () => {
    const items = [
        {
            key: '1',
            label: <span style={{display: 'flex', alignItems: 'center'}}><UserOutlined />İstifadəçilər</span>,
            children: <UsersTab />,
        },
        {
            key: '2',
            label: <span style={{display: 'flex', alignItems: 'center'}}><ApartmentOutlined />Departamentlər</span>,
            children: <DepartmentsTab />,
        },
        {
            key: '3',
            label: <span style={{display: 'flex', alignItems: 'center'}}><SolutionOutlined />Vəzifələr</span>,
            children: <PositionsTab />,
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">İdarəetmə Paneli</h2>
            <div className="p-4 sm:p-6 rounded-lg shadow-md bg-white dark:bg-[#1B232D]">
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </div>
    );
};

export default UserManagement;