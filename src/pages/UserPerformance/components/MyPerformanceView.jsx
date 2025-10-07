// src/pages/PerformancePage/components/MyPerformanceView.js

import React from 'react';
import { Card, Row, Col, Statistic, Typography, Avatar, Empty, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

const MyPerformanceView = ({ userCardData, summaryData, monthlyScores }) => {
  if (!userCardData) {
    return <Empty description="Performans məlumatınız tapılmadı." className="pt-10" />;
  }

  // Qrafik üçün məlumatları hazırlayırıq (tarixə görə artan sırada)
  const chartData = monthlyScores
    .map(item => ({
      ...item,
      // Tarixi 'YYYY-MM' formatına salırıq
      month: new Date(item.evaluation_date).toISOString().substring(0, 7),
    }))
    .reverse();

  return (
    <div className="p-4 bg-white rounded-lg">
      <Row gutter={[24, 24]}>
        {/* Sol tərəf: Profil Məlumatları */}
        <Col xs={24} md={8} lg={7}>
          <Card bordered={false}>
            <div className="text-center">
              <Avatar size={96} src={userCardData.profile_photo} icon={<UserOutlined />} />
              <Title level={4} className="mt-4 mb-1">{`${userCardData.first_name} ${userCardData.last_name}`}</Title>
              <Text type="secondary">{userCardData.role_display}</Text>
              <br />
              <Text>{userCardData.department_name || 'Departament təyin edilməyib'}</Text>
            </div>
            <div className="mt-6 text-center">
                <Text strong>Bu Aykı Nəticə</Text>
                <br/>
                {userCardData.selected_month_evaluation ? (
                    <Tag 
                        color={userCardData.selected_month_evaluation.score > 7 ? 'success' : userCardData.selected_month_evaluation.score > 4 ? 'warning' : 'error'}
                        style={{ fontSize: '24px', padding: '8px 16px', marginTop: '8px' }}
                    >
                        {userCardData.selected_month_evaluation.score} / 10
                    </Tag>
                ) : (
                    <Tag style={{ fontSize: '18px', padding: '8px 16px', marginTop: '8px' }}>Daxil edilməyib</Tag>
                )}
            </div>
          </Card>
        </Col>
        
        {/* Sağ tərəf: Statistikalar və Qrafik */}
        <Col xs={24} md={16} lg={17}>
          <Card bordered={false}>
            <Title level={5} style={{ marginBottom: '24px' }}>Dövrlər üzrə ortalama nəticələr</Title>
            {summaryData ? (
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic title="Son 3 Ay" value={summaryData['3 ay'] || 'Daxil edilməyib'} suffix="/ 10" precision={2} />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic title="Son 6 Ay" value={summaryData['6 ay'] || 'Daxil edilməyib'} suffix="/ 10" precision={2} />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic title="Son 9 Ay" value={summaryData['9 ay'] || 'Daxil edilməyib'} suffix="/ 10" precision={2} />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic title="Son 1 İl" value={summaryData['1 il'] || 'Daxil edilməyib'} suffix="/ 10" precision={2} />
                </Col>
              </Row>
            ) : <Empty description="Statistika tapılmadı." />}
          </Card>
          <Card bordered={false} className="mt-6">
            <Title level={5} style={{ marginBottom: '24px' }}>Aylıq Performansın Gedişatı</Title>
            {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis type="number" domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="score" name="Aylıq Bal" stroke="#1677ff" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            ) : <Empty description="Qrafik üçün ən azı 2 aylıq məlumat lazımdır." />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyPerformanceView;