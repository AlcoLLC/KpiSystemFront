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
    
    // YENİ KÖMƏKÇİ FUNKSİYA: Aylıq nəticələri qruplaşdırmaq və formatlamaq
    const formatMonthlyScores = (scores) => {
        const grouped = {};
        
        scores.forEach(item => {
            const monthKey = item.evaluation_date.substring(0, 7); // YYYY-MM
            
            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
            }
            
            const evaluatorName = item.evaluator?.full_name || 'Naməlum Rəhbər';
            
            // DÜZƏLİŞ 1: evaluation_type yerinə evaluation_type_display istifadə edirik
            const evaluationText = item.evaluation_type_display; 
            
            // DÜZƏLİŞ 2: Sıralama üçün hələ də orijinal evaluation_type model dəyərini tapmalıyıq. 
            // Əgər siz back-end-də evaluation_type-i də göndərmirsinizsə, burada 'evaluationText'-ə əsasən müəyyən edirik.
            const isSuperior = evaluationText.includes('Üst Rəhbər');
            
            grouped[monthKey].push({
                ...item,
                evaluatorName,
                evaluationText,
                // Sıralama üçün: Üst Rəhbər (1) hər zaman Top Management (2)-dən əvvəl gəlsin
                sortOrder: isSuperior ? 1 : 2 
            });
        });

        // Nəticələri tarixə görə azalan, hər ayın daxilində isə Superior/TM sırasına görə düzənlə
        const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

        const finalData = [];
        sortedKeys.forEach(key => {
            const monthName = formatForDisplay(key + '-01');
            grouped[key].sort((a, b) => a.sortOrder - b.sortOrder);
            
            finalData.push({ month: monthName, evaluations: grouped[key] });
        });

        return finalData;
    };
    
    const monthlyData = formatMonthlyScores(monthlyScores);


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
                                dataSource={monthlyData} // Dəyişdirildi: formatlanmış data
                                locale={{ emptyText: <Empty description="Aylıq nəticələr tapılmadı." /> }}
                                renderItem={monthItem => (
                                    <List.Item className="flex-col items-start pt-3 pb-3 border-b">
                                        <h4 className="text-base font-semibold text-gray-800 mb-2">
                                            {monthItem.month}
                                        </h4>
                                        <div className='w-full space-y-2'>
                                            {monthItem.evaluations.map((item, index) => (
                                                <div key={index} className='flex justify-between items-center bg-gray-50 p-3 rounded-lg border'>
                                                    {/* Sol tərəf: Evaluator və Növ */}
                                                    <div className='text-sm text-gray-600'>
                                                        <span className='font-medium'>{item.evaluationText}</span> 
                                                        <span className='text-gray-400'> ({item.evaluatorName})</span>
                                                    </div>
                                                    
                                                    {/* Sağ tərəf: Bal */}
                                                    <Tag color={item.score > 7 ? 'green' : item.score > 4 ? 'orange' : 'red'} style={{fontSize: '14px', padding: '4px 8px'}}>
                                                        {item.score} bal
                                                    </Tag>
                                                </div>
                                            ))}
                                        </div>
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