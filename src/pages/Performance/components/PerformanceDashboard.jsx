import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, Progress, Avatar, Tag, Skeleton, Empty, Tooltip } from 'antd';
import { UserOutlined, CheckCircleOutlined, SyncOutlined, WarningOutlined, TrophyOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';


const PerformanceDashboard = ({ loading, performanceData }) => {
    const navigate = useNavigate(); // Naviqasiya üçün hook

    if (loading) return <Skeleton active avatar paragraph={{ rows: 10 }} />;
    if (!performanceData) return <Empty description="Performans məlumatı tapılmadı." />;

    const { user, task_performance } = performanceData;
    const onTimeRateColor = task_performance.on_time_rate >= 80 ? '#52c41a' : task_performance.on_time_rate >= 50 ? '#faad14' : '#f5222d';
    const photoUrl = user.profile_photo;

    const handleCardClick = (filter) => {
        const filterWithAssignee = { ...filter, assignee: user.id };
        navigate('/tasks', { state: { predefinedFilter: filterWithAssignee } });
    };

    return (
        <div className="space-y-6">
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Card className="shadow-lg h-full bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Avatar size={96} src={photoUrl} icon={<UserOutlined />} className="border-4 border-white dark:border-gray-600 shadow-md"/>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.full_name}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{user.department}</p>
                                <Tag color="blue" className="mt-2">{user.role}</Tag>
                            </div>
                            <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-300">İcra Performansı</p>
                                    <Progress 
                                        type="circle" 
                                        percent={task_performance.on_time_rate} 
                                        strokeColor={onTimeRateColor}
                                        format={(percent) => `${percent}%`}
                                    />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <div className="space-y-6">
                        <Row gutter={[16, 16]}>
                            <Col xs={12} sm={12} md={6}>
                                <div onClick={() => handleCardClick({})} className="cursor-pointer">
                                    <Card className="shadow-sm bg-white dark:bg-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#2a384c] transition-all">
                                        <Statistic title="Cəmi Tapşırıq" value={task_performance.total_tasks} prefix={<TrophyOutlined />} valueStyle={{ color: '#fbbf24' }}/>
                                    </Card>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                                <div onClick={() => handleCardClick({ status: 'DONE' })} className="cursor-pointer">
                                    <Card className="shadow-sm bg-white dark:bg-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#2a384c] transition-all">
                                        <Statistic title="Tamamlanmış" value={task_performance.completed_count} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }}/>
                                    </Card>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                                <div onClick={() => handleCardClick({ status: ['TODO', 'IN_PROGRESS'] })} className="cursor-pointer">
                                    <Card className="shadow-sm bg-white dark:bg-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#2a384c] transition-all">
                                        <Statistic title="Aktiv" value={task_performance.active_count} prefix={<SyncOutlined spin />} valueStyle={{ color: '#1677ff' }}/>
                                    </Card>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                                <div onClick={() => handleCardClick({ overdue: true })} className="cursor-pointer">
                                    <Card className="shadow-sm bg-white dark:bg-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#2a384c] transition-all">
                                        <Statistic title="Gecikmiş" value={task_performance.overdue_count} prefix={<WarningOutlined />} valueStyle={{ color: '#f5222d' }}/>
                                    </Card>
                                </div>
                            </Col>
                        </Row>

                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default PerformanceDashboard;