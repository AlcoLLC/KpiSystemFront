import { Modal, Row, Col, Statistic, Spin, Empty, Tabs, List, Tag } from 'antd';
import { useSummaryData } from '../hooks/useSummaryData';
import { formatForDisplay } from '../../../utils/dateFormatter';

const { TabPane } = Tabs;

const SummaryModal = ({ visible, onClose, user, selectedMonth }) => {
    const { summary, monthlyScores, loading } = useSummaryData({
        userId: user?.id,
        selectedMonth,
        isEnabled: visible,
    });

    const hasData = summary || monthlyScores.length > 0;

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
                {!hasData && !loading ? (
                    <Empty description="Göstəriləcək məlumat tapılmadı." />
                ) : (
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Ümumi Statistika" key="1">
                            {summary ? (
                                <Row gutter={[16, 24]} className="pt-4">
                                    <Col span={12}><Statistic title="Son 3 Aylıq Ortalama" value={summary['3 ay'] || 0} precision={2} suffix="/ 10" /></Col>
                                    <Col span={12}><Statistic title="Son 6 Aylıq Ortalama" value={summary['6 ay'] || 0} precision={2} suffix="/ 10" /></Col>
                                    <Col span={12}><Statistic title="Son 9 Aylıq Ortalama" value={summary['9 ay'] || 0} precision={2} suffix="/ 10" /></Col>
                                    <Col span={12}><Statistic title="Son 1 İllik Ortalama" value={summary['1 il'] || 0} precision={2} suffix="/ 10" /></Col>
                                </Row>
                            ) : <Empty description="Statistika məlumatı tapılmadı." />}
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