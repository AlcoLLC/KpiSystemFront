import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, message } from 'antd';
import {
  ClockCircleOutlined,
  RedoOutlined, 
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import tasksApi from '../../../api/tasksApi'; 

function TaskStatsCards() {
  const navigate = useNavigate();
  const [taskStats, setTaskStats] = useState({
    pending: 0,
    in_progress: 0,
    cancelled: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await tasksApi.getHomeStats();
        setTaskStats(response.data);
      } catch (error) {
        message.error("Tapşırıq statistikasını yükləmək mümkün olmadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleCardClick = (filter) => {
    navigate('/tasks', { state: { predefinedFilter: filter } });
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div onClick={() => handleCardClick({ status: 'PENDING' })} className="cursor-pointer">
            <Card className="shadow-sm bg-white dark:bg-[#1B232D]">
              <Statistic
                title="Gözləmədə olan"
                value={taskStats.pending}
                loading={loading}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div onClick={() => handleCardClick({ status: 'IN_PROGRESS' })} className="cursor-pointer">
            <Card className="shadow-sm bg-white dark:bg-[#1B232D]">
              <Statistic
                title="Davam edən"
                value={taskStats.in_progress}
                loading={loading}
                valueStyle={{ color: '#1890ff' }}
                prefix={<RedoOutlined />} 
              />
            </Card>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div onClick={() => handleCardClick({ status: 'CANCELLED' })} className="cursor-pointer">
            <Card className="shadow-sm bg-white dark:bg-[#1B232D]">
              <Statistic
                title="Ləğv edilən"
                value={taskStats.cancelled}
                loading={loading}
                valueStyle={{ color: '#8c8c8c' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div onClick={() => handleCardClick({ overdue: true })} className="cursor-pointer">
            <Card className="shadow-sm bg-white dark:bg-[#1B232D]">
              <Statistic
                title="Gecikmiş tapşırıqlar"
                value={taskStats.overdue}
                loading={loading}
                valueStyle={{ color: '#cf1322' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default TaskStatsCards;