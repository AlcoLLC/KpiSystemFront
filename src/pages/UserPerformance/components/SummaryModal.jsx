import { useState, useEffect } from 'react';
import { Modal, Row, Col, Statistic, Spin, Empty, message, Tabs, List, Tag } from 'antd';
import apiService from '../../../api/apiService';
import { formatForAPI, formatForDisplay } from '../../../utils/dateFormatter';

const { TabPane } = Tabs;

const SummaryModal = ({ visible, onClose, user, selectedMonth }) => {
    const [summary, setSummary] = useState(null);
    const [monthlyScores, setMonthlyScores] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllData = async () => {
        if (!user) return;
        setLoading(true);
        setSummary(null);
        setMonthlyScores([]);

        const params = { evaluatee_id: user.id };
        if (selectedMonth) {
            params.date = formatForAPI(selectedMonth).substring(0, 7);
        }

        try {
            const [summaryResponse, scoresResponse] = await Promise.all([
                apiService.get('/performance/user-evaluations/performance-summary/', params),
                apiService.get('/performance/user-evaluations/monthly-scores/', params) 
            ]);

            setSummary(summaryResponse.data.averages);
            setMonthlyScores(scoresResponse.data);

        } catch (error) {
            message.error('Məlumatlar yüklənərkən xəta baş verdi.', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible && user) {
            fetchAllData();
        }
    }, [visible, user, selectedMonth]);

    return (
        <Modal
            title={`${user?.first_name} ${user?.last_name} - Performans Hesabatı`}
            open={visible}
            onCancel={onClose}
            footer={null} 
            width={700}
            className='summary-modal'
        >
            <Spin spinning={loading}>
                {(!summary && !monthlyScores.length && !loading) ? (
                     <Empty description="Göstəriləcək məlumat tapılmadı." />
                ) : (
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Ümumi Statistika" key="1">
                            {summary ? (
                                <Row gutter={[16, 24]} className="pt-4">
                                    <Col span={12}>
                                        <Statistic title="Son 3 Aylıq Ortalama" value={summary['3 ay'] || 'Daxil edilməyib'} precision={2} suffix="/ 10" />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="Son 6 Aylıq Ortalama" value={summary['6 ay'] || 'Daxil edilməyib'} precision={2} suffix="/ 10" />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="Son 9 Aylıq Ortalama" value={summary['9 ay'] || 'Daxil edilməyib'} precision={2} suffix="/ 10" />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="Son 1 İllik Ortalama" value={summary['1 il'] || 'Daxil edilməyib'} precision={2} suffix="/ 10" />
                                    </Col>
                                </Row>
                            ): <Empty description="Statistika məlumatı tapılmadı." />}
                        </TabPane>
                        <TabPane tab="Aylıq Nəticələr" key="2">
                           <List
                                className="pt-4"
                                dataSource={monthlyScores}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={formatForDisplay(item.evaluation_date)}
                                        />
                                        <Tag color={item.score > 7 ? 'green' : item.score > 4 ? 'orange' : 'red'} style={{fontSize: '14px', padding: '4px 8px'}}>
                                            {item.score} bal
                                        </Tag>
                                    </List.Item>
                                )}
                           />
                        </TabPane>
                    </Tabs>
                )}
            </Spin>
        </Modal>
    );
};

export default SummaryModal;