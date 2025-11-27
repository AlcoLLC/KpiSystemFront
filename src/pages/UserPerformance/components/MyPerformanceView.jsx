// kpi-system-frontend\src\pages\UserPerformance\components\MyPerformanceView.jsx

import { Card, Row, Col, Statistic, Typography, Avatar, Empty, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

const MyPerformanceView = ({ userCardData, summaryData, monthlyScores }) => {
  if (!userCardData) {
    return <Empty description="Performans məlumatınız tapılmadı." className="pt-10" />;
  }

  // selected_month_evaluations obyektindən balları çıxarırıq
  const evaluations = userCardData.selected_month_evaluations || {};
  const superiorEval = evaluations.superior;
  const tmEval = evaluations.top_management;
  
  // Qrafik üçün hələ də tək skor (Superior skorunu istifadə edirik, ya da TM varsa onu)
  // Backend tərəfindən tək bir 'score' qaytarılmalıdır, amma hələlik Superior balını əsas götürürük
  const chartData = monthlyScores
    .map(item => ({
      ...item,
      month: new Date(item.evaluation_date).toISOString().substring(0, 7),
    }))
    .reverse();
    
    // Ən yüksək balı göstərən funksiya (yoxlama balı yoxdursa)
    const displayScore = superiorEval?.score || tmEval?.score;
    const isEvaluated = !!displayScore;

  return (
    <div className="p-4 bg-white rounded-lg">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8} lg={7}>
          <Card bordered={false}>
            <div className="text-center">
              <Avatar size={96} src={userCardData.profile_photo} icon={<UserOutlined />} />
              <Title level={4} className="mt-4 mb-1">{`${userCardData.first_name} ${userCardData.last_name}`}</Title>
              <Text type="secondary" className="performance-view-position" style={{ display: 'block' }}>
                {userCardData.position_name || 'Vəzifə təyin edilməyib'}
              </Text>
              <Text type="secondary" style={{ display: 'block' }}>{userCardData.role_display}</Text>
              <Text className="mt-2" style={{ display: 'block' }}>{userCardData.department_name || 'Departament təyin edilməyib'}</Text>
            </div>
            
            <div className="mt-6 text-center border-t pt-4">
                <Text strong>Bu Aykı Nəticələr</Text>
                <div className="mt-3">
                    {/* Superior Score */}
                    <Text strong style={{ display: 'block' }}>Rəhbər Balı:</Text>
                    {superiorEval ? (
                        <Tag 
                            color={superiorEval.score > 7 ? 'success' : superiorEval.score > 4 ? 'warning' : 'error'}
                            style={{ fontSize: '18px', padding: '4px 12px', marginTop: '4px' }}
                        >
                            {superiorEval.score} / 10
                        </Tag>
                    ) : (
                        <Tag style={{ fontSize: '14px', padding: '4px 12px', marginTop: '4px' }}>-</Tag>
                    )}
                </div>

                <div className="mt-3">
                    {/* Top Management Score */}
                    <Text strong style={{ display: 'block' }}>TM Balı:</Text>
                    {tmEval ? (
                        <Tag 
                            color={tmEval.score > 7 ? 'success' : tmEval.score > 4 ? 'warning' : 'error'}
                            style={{ fontSize: '18px', padding: '4px 12px', marginTop: '4px' }}
                        >
                            {tmEval.score} / 10
                        </Tag>
                    ) : (
                        <Tag style={{ fontSize: '14px', padding: '4px 12px', marginTop: '4px' }}>-</Tag>
                    )}
                </div>
            </div>
          </Card>
        </Col>
        
        {/* ... (Qalan hissə eyni qalır) ... */}
        <Col xs={24} md={16} lg={17}>
          <Card bordered={false}>
            <Title level={5} style={{ marginBottom: '24px' }}>Dövrlər üzrə ortalama nəticələr</Title>
            {summaryData ? (
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic title="Son 3 Ay" value={summaryData['3 ay'] || '-'} suffix="/ 10" precision={2} />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic title="Son 6 Ay" value={summaryData['6 ay'] || '-'} suffix="/ 10" precision={2} />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic title="Son 9 Ay" value={summaryData['9 ay'] || '-'} suffix="/ 10" precision={2} />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic title="Son 1 İl" value={summaryData['1 il'] || '-'} suffix="/ 10" precision={2} />
                </Col>
              </Row>
            ) : <Empty description="Statistika tapılmadı." />}
          </Card>
          <Card bordered={false} className="mt-6">
            <Title level={5} style={{ marginBottom: '24px' }}>Aylıq Performansın Gedişatı</Title>
            {chartData.length > 0 ? ( 
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis type="number" domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        {/* Burada fərz edirik ki, `monthlyScores` hələ də tək bal (məsələn, Superior balı) qaytarır */}
                        <Line type="monotone" dataKey="score" name="Aylıq Bal" stroke="#1677ff" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
              <Empty description="Qrafik üçün heç bir məlumat tapılmadı." />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyPerformanceView;