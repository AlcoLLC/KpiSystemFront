import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Radio } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import TeamPerformanceView from './components/TeamPerformanceView';
import PerformanceDashboard from './components/PerformanceDashboard';

function Performance() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('team');

  const isSuperior = user && user.role !== 'employee';
  const isAdmin = user && user.role === 'admin';
  const showViewSwitcher = isSuperior && !isAdmin;

  useEffect(() => {
    if (isAdmin) setViewMode('team');
    else if (!isSuperior) setViewMode('my');
  }, [isAdmin, isSuperior]);

  // Əgər URL-də bir slug varsa, birbaşa həmin işçinin dashboard-unu göstər
  if (slug) {
    return (
        <div>
            <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Əməkdaşın Performansı</h2>
            <div className="p-6 rounded-lg shadow-md bg-white dark:bg-[#1B232D]">
                <PerformanceDashboard />
            </div>
        </div>
    );
  }

  return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Performans</h2>
      
      {showViewSwitcher && (
        <div className="mb-4">
          <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <Radio.Button value="my"><UserOutlined /> Mənim Performansım</Radio.Button>
            <Radio.Button value="team"><TeamOutlined /> Əməkdaşların Performansı</Radio.Button>
          </Radio.Group>
        </div>
      )}

      <div className="p-6 rounded-lg shadow-md bg-white dark:bg-[#1B232D]">
        {viewMode === 'my' ? <PerformanceDashboard /> : <TeamPerformanceView />}
      </div>
    </div>
  );
}

export default Performance;