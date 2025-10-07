import { useState, useEffect, useCallback } from 'react';
import { Typography, message, Spin, Empty, DatePicker, Select, Row, Col, Tabs } from 'antd';
import dayjs from 'dayjs';
import UserEvaluationCard from './components/UserEvaluationCard';
import MyPerformanceView from './components/MyPerformanceView'; 
import UserEvaluationModal from './components/UserEvaluationModal';
import SummaryModal from './components/SummaryModal';
import apiService from '../../api/apiService';
import useAuth from '../../hooks/useAuth';
import { formatForDatePicker, formatForAPI } from '../../utils/dateFormatter';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const managerialRoles = ['admin', 'top_management', 'department_lead', 'manager'];

const PerformancePage = () => {
    const { user } = useAuth();
    const [myCard, setMyCard] = useState(null);
    const [mySummary, setMySummary] = useState(null);
    const [myMonthlyScores, setMyMonthlyScores] = useState([]);
    const [subordinates, setSubordinates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEvalModalVisible, setIsEvalModalVisible] = useState(false);
    const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [activeTab, setActiveTab] = useState('team');

    const canEvaluate = user && managerialRoles.includes(user.role);

    const fetchDepartments = useCallback(async () => {
        if(user && user.role === 'admin') {
            try {
                const response = await apiService.get('/accounts/departments/');
                setDepartments(response.data);
            } catch (error) {
                message.error('Departamentlər yüklənərkən xəta baş verdi.', error);
            }
        }
    }, [user]);

    const fetchAPIData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const dateParam = formatForAPI(selectedMonth).substring(0, 7);
    const departmentParam = user.role === 'admin' ? selectedDepartment : null;

    try {
        const requests = [
            apiService.get('/performance/user-evaluations/my-performance-card/', { date: dateParam }),
            apiService.get('/performance/user-evaluations/performance-summary/', { evaluatee_id: user.id, date: dateParam }),
            apiService.get('/performance/user-evaluations/monthly-scores/', { evaluatee_id: user.id, date: dateParam }),
        ];

        if (canEvaluate) {
            requests.push(apiService.get('/performance/user-evaluations/evaluable-users/', {
                date: dateParam,
                department: departmentParam
            }));
        }

        const [myCardRes, mySummaryRes, myScoresRes, subordinatesRes] = await Promise.all(requests);
        
        setMyCard(myCardRes.data);
        setMySummary(mySummaryRes.data.averages);
        setMyMonthlyScores(myScoresRes.data);

        if (canEvaluate && subordinatesRes) {
            // --- DEĞİŞİKLİK BAŞLANGICI ---
            // Gelen datayı sırala. Değerlendirilmemişler (selected_month_evaluation === null) önce gelsin.
            const sortedSubordinates = [...subordinatesRes.data].sort((a, b) => {
                const aHasEval = !!a.selected_month_evaluation; // Değerlendirme varsa true, yoksa false olur
                const bHasEval = !!b.selected_month_evaluation;

                // boolean'ları sayıya çevirerek sıralama yapıyoruz (false=0, true=1)
                // a değerlendirilmemiş (false), b değerlendirilmiş (true) ise sonuç -1 olur, a önce gelir.
                return aHasEval - bHasEval;
            });
            
            setSubordinates(sortedSubordinates);
            // --- DEĞİŞİKLİK SONU ---
        }

    } catch (error) {
        message.error('Məlumatlar yüklənərkən xəta baş verdi.', error);
    } finally {
        setLoading(false);
    }
}, [selectedMonth, selectedDepartment, canEvaluate, user]);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);
    
    useEffect(() => {
        fetchAPIData();
    }, [fetchAPIData]);
    
    const handleOpenEvalModal = (userForModal) => {
        setSelectedUser(userForModal);
        setIsEvalModalVisible(true);
    };

    const handleOpenSummaryModal = (userForModal) => {
        setSelectedUser(userForModal);
        setIsSummaryModalVisible(true);
    };

    const handleModalClose = (refresh = false) => {
        setIsEvalModalVisible(false);
        setIsSummaryModalVisible(false);
        setSelectedUser(null);
        if (refresh) {
            fetchAPIData();
        }
    };
    
    const handleMonthChange = (date) => {
        setSelectedMonth(date ? date.toDate() : new Date());
    };

    const renderCardGrid = (usersList) => {
        if (!usersList || usersList.length === 0) {
            return <Empty className="pt-10" description="Bu filterlərə uyğun dəyərləndiriləcək işçi tapılmadı." />;
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                {usersList.map(u => (
                    <UserEvaluationCard
                        key={u.id}
                        user={u}
                        onEvaluateClick={() => handleOpenEvalModal(u)}
                        onSummaryClick={() => handleOpenSummaryModal(u)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <Title level={2} className="mb-6">Aylıq Performans Dəyərləndirməsi</Title>
            
            <Row gutter={[16, 16]} className="mb-6 bg-white p-4 rounded-lg shadow">
                <Col xs={24} sm={12} md={8}>
                    <DatePicker 
                        value={dayjs(selectedMonth)}
                        onChange={handleMonthChange}
                        picker="month"
                        style={{ width: '100%' }}
                        format={formatForDatePicker}
                        allowClear={false}
                    />
                </Col>
                {user && user.role === 'admin' && (
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            placeholder="Departament seçin"
                            onChange={(value) => setSelectedDepartment(value)}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            {departments.map(dep => (
                                <Option key={dep.id} value={dep.id}>{dep.name}</Option>
                            ))}
                        </Select>
                    </Col>
                )}
            </Row>

            <Spin spinning={loading}>
                {canEvaluate ? (
                    <Tabs defaultActiveKey="team" activeKey={activeTab} onChange={setActiveTab}>
                        <TabPane tab="Komandam" key="team">
                           {renderCardGrid(subordinates)}
                        </TabPane>
                        <TabPane tab="Mənim Performansım" key="me">
                            <MyPerformanceView
                                userCardData={myCard}
                                summaryData={mySummary}
                                monthlyScores={myMonthlyScores}
                            />
                        </TabPane>
                    </Tabs>
                ) : (
                    <MyPerformanceView
                        userCardData={myCard}
                        summaryData={mySummary}
                        monthlyScores={myMonthlyScores}
                    />
                )}
            </Spin>

            {selectedUser && (
                <>
                    <UserEvaluationModal
                        visible={isEvalModalVisible}
                        onClose={handleModalClose}
                        user={selectedUser}
                        initialData={selectedUser.selected_month_evaluation}
                        evaluationMonth={selectedMonth}
                    />
                    <SummaryModal
                        visible={isSummaryModalVisible}
                        onClose={handleModalClose}
                        user={selectedUser}
                        selectedMonth={selectedMonth}
                    />
                </>
            )}
        </div>
    );
};

export default PerformancePage;