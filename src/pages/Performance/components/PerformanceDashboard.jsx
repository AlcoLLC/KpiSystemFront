import React from 'react';
import { Row, Col, Card, Statistic, Progress, Avatar, Tag, Skeleton, Empty, Tooltip } from 'antd';
import { UserOutlined, CheckCircleOutlined, SyncOutlined, WarningOutlined, TrophyOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';

// Helper for the Priority Completion Chart
const PriorityCompletionChart = ({ data, priorityMap }) => {
    const chartLabels = ['Aşağı', 'Orta', 'Yüksək', 'Çox Vacib'];
    const dataMap = new Map(data.map(item => [priorityMap[item.priority], item.count]));

    const chartData = {
        labels: chartLabels,
        datasets: [{
            label: 'Tamamlanmış Tapşırıq Sayı',
            data: chartLabels.map(label => dataMap.get(label) || 0),
            backgroundColor: ['rgba(82, 196, 26, 0.7)', 'rgba(22, 119, 255, 0.7)', 'rgba(250, 140, 22, 0.7)', 'rgba(245, 34, 45, 0.7)'],
            borderColor: ['rgb(82, 196, 26)', 'rgb(22, 119, 255)', 'rgb(250, 140, 22)', 'rgb(245, 34, 45)'],
            borderWidth: 1,
        }]
    };
    const options = { responsive: true, plugins: { legend: { display: false } } };
    return <Bar options={options} data={chartData} />;
}

const PerformanceDashboard = ({ loading, performanceData }) => {
    if (loading) return <Skeleton active avatar paragraph={{ rows: 10 }} />;
    if (!performanceData) return <Empty description="Performans məlumatı tapılmadı." />;

    const { user, task_performance } = performanceData;
    const onTimeRateColor = task_performance.on_time_rate >= 80 ? '#52c41a' : task_performance.on_time_rate >= 50 ? '#faad14' : '#f5222d';
    const priorityMap = { 'CRITICAL': 'Çox Vacib', 'HIGH': 'Yüksək', 'MEDIUM': 'Orta', 'LOW': 'Aşağı' };

    // Construct the full image URL
    const photoUrl = user.profile_photo ? `${import.meta.env.VITE_API_BASE_URL}${user.profile_photo}` : null;

    return (
        <div className="space-y-6">
            {/* User Info Header with better design */}
            <Card className="shadow-lg bg-gradient-to-r from-white to-gray-50 dark:from-[#1F2937] dark:to-[#111827] border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Avatar size={80} src={photoUrl} icon={<UserOutlined />} className="border-4 border-white dark:border-gray-600 shadow-md"/>
                    <div className="text-center sm:text-left">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{user.full_name}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{user.department}</p>
                        <Tag color="blue" className="mt-2">{user.role}</Tag>
                    </div>
                </div>
            </Card>
            
            <Row gutter={[24, 24]}>
                {/* Main Performance Score */}
                <Col xs={24} md={8} lg={6}>
                    <Tooltip title="Bitmə tarixi təyin edilmiş tapşırıqların neçə faizinin vaxtında tamamlandığını göstərir.">
                        <Card className="shadow-md h-full text-center flex flex-col justify-center items-center bg-white dark:bg-[#1F2937]">
                            <p className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">Vaxtında Tamamlama</p>
                            <Progress 
                                type="circle" 
                                percent={task_performance.on_time_rate} 
                                strokeColor={onTimeRateColor}
                                format={(percent) => `${percent}%`}
                                size={140}
                            />
                        </Card>
                    </Tooltip>
                </Col>

                {/* Key Statistics */}
                <Col xs={24} md={16} lg={18}>
                     <Row gutter={[16, 16]}>
                        <Col xs={12} sm={8} lg={6}>
                             <Card className="shadow-sm bg-white dark:bg-[#1F2937]">
                                <Statistic title="Cəmi Tapşırıq" value={task_performance.total_tasks} prefix={<TrophyOutlined />}/>
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} lg={6}>
                             <Card className="shadow-sm bg-white dark:bg-[#1F2937]">
                                <Statistic title="Tamamlanmış" value={task_performance.completed_count} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }}/>
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} lg={6}>
                            <Card className="shadow-sm bg-white dark:bg-[#1F2937]">
                                <Statistic title="Aktiv" value={task_performance.active_count} prefix={<SyncOutlined spin />} valueStyle={{ color: '#1677ff' }}/>
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} lg={6}>
                             <Card className="shadow-sm bg-white dark:bg-[#1F2937]">
                                <Statistic title="Gecikmiş" value={task_performance.overdue_count} prefix={<WarningOutlined />} valueStyle={{ color: '#f5222d' }}/>
                            </Card>
                        </Col>
                     </Row>
                </Col>

                {/* Priority Chart */}
                <Col xs={24}>
                    <Card title="Tamamlanmış Tapşırıqların Prioritetə Görə Bölgüsü" className="shadow-md bg-white dark:bg-[#1F2937]">
                        <PriorityCompletionChart data={task_performance.priority_completion} priorityMap={priorityMap}/>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PerformanceDashboard;