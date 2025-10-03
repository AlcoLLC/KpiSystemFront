import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Card, Statistic, Progress, Avatar, Tag, message, Spin, Empty } from 'antd';
import { UserOutlined, CheckCircleOutlined, WarningOutlined, PercentageOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import tasksApi from '../../../api/tasksApi';
import useAuth from '../../../hooks/useAuth';

const PerformanceDashboard = () => {
  const { slug } = useParams(); // URL-dən slug-ı götürürük
  const { user: currentUser } = useAuth();
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slugToFetch = slug || currentUser?.slug;
    if (!slugToFetch) {
        setLoading(false);
        return;
    };

    const fetchPerformance = async () => {
      setLoading(true);
      try {
        const response = await tasksApi.getPerformanceSummary(slugToFetch);
        setPerformanceData(response.data);
      } catch (error) {
        message.error("Performans məlumatlarını yükləmək mümkün olmadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [slug, currentUser]);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
  }

  if (!performanceData) {
    return <Empty description="Performans məlumatı tapılmadı." />;
  }

  const { user, task_performance } = performanceData;
  const completionRateColor = task_performance.completion_rate >= 80 ? '#52c41a' : task_performance.completion_rate >= 50 ? '#faad14' : '#f5222d';

  return (
    <div className="space-y-6">
      <Link to="/performance" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4">
        <ArrowLeftOutlined className="mr-2" />
        Əməkdaşların Siyahısına Qayıt
      </Link>
      
      {/* İstifadəçi Məlumat Kartı */}
      <Card className="shadow-md bg-white dark:bg-[#1B232D]">
        <div className="flex items-center space-x-4">
          <Avatar size={64} src={user.profile_photo} icon={<UserOutlined />} />
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.full_name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{user.department}</p>
            <Tag color="blue">{user.role}</Tag>
          </div>
        </div>
      </Card>
      
      {/* Tapşırıq Performansı Statistikası */}
      <h3 className="text-lg font-semibold text-black dark:text-white">Tapşırıq Performansı</h3>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} className="text-center">
            <Card className="shadow-sm bg-white dark:bg-[#1B232D] h-full flex flex-col justify-center">
                <Progress 
                    type="dashboard" 
                    percent={task_performance.completion_rate} 
                    strokeColor={completionRateColor}
                    format={(percent) => `${percent}%`}
                />
                <p className="text-lg font-semibold mt-4 text-gray-700 dark:text-gray-300">Vaxtında Tamamlama</p>
            </Card>
        </Col>
        <Col xs={24} md={16}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                    <Card className="shadow-sm bg-white dark:bg-[#1B232D]">
                        <Statistic
                            title="Tamamlanan Tapşırıqlar"
                            value={task_performance.completed_count}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                 <Col xs={24} sm={12}>
                    <Card className="shadow-sm bg-white dark:bg-[#1B232D]">
                        <Statistic
                            title="Gecikmiş Tapşırıqlar"
                            value={task_performance.overdue_count}
                            valueStyle={{ color: '#f5222d' }}
                            prefix={<WarningOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </Col>
      </Row>
    </div>
  );
};

export default PerformanceDashboard;