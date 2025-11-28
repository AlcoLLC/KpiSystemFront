import { useState } from "react";
import { Typography, Spin, Tabs } from "antd";
import useAuth from "../../hooks/useAuth";
import { usePerformanceData } from "./hooks/usePerformanceData";
import PerformanceFilters from "./components/PerformanceFilters";
import TeamView from "./components/TeamView";
import MyPerformanceView from "./components/MyPerformanceView";
import UserEvaluationModal from "./components/UserEvaluationModal";
import SummaryModal from "./components/SummaryModal";
import "../../styles/userkpi.css";

const { Title } = Typography;
const { TabPane } = Tabs;

const PerformancePage = () => {
  const { user } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeTab, setActiveTab] = useState("team");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEvalModalVisible, setIsEvalModalVisible] = useState(false);
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [evaluationStatus, setEvaluationStatus] = useState('all'); 

  const [activeEvaluationType, setActiveEvaluationType] = useState(null); 
  const [activeInitialData, setActiveInitialData] = useState(null);

  const {
    myCard,
    mySummary,
    myMonthlyScores,
    subordinates,
    departments,
    loading,
    canEvaluate,
    refetchData,
  } = usePerformanceData(selectedMonth, selectedDepartment, evaluationStatus);

  const handleOpenEvalModal = (userForModal, type, initialData) => {
    setSelectedUser(userForModal);
    setActiveEvaluationType(type);
    setActiveInitialData(initialData);
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
    setActiveEvaluationType(null);
    setActiveInitialData(null);
    if (refresh) {
      refetchData();
    }
  };

  const canEditModal = selectedUser && activeEvaluationType 
    ? (activeEvaluationType === 'SUPERIOR' ? selectedUser.can_evaluate_superior : selectedUser.can_evaluate_top_management) 
    : false;


  const renderContent = () => {
    const hiddenForRoles = ["ceo", "admin"];

    if (!canEvaluate) {
       return (
        <MyPerformanceView
          userCardData={myCard}
          summaryData={mySummary}
          monthlyScores={myMonthlyScores}
        />
      );
    }
    return (
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Komandam" key="team">
          <TeamView
            users={subordinates}
            onEvaluateClick={handleOpenEvalModal} 
            onSummaryClick={handleOpenSummaryModal}
          />
        </TabPane>
        {user && !hiddenForRoles.includes(user.role) && (
          <TabPane tab="Mənim Performansım" key="me">
            <MyPerformanceView
              userCardData={myCard}
              summaryData={mySummary}
              monthlyScores={myMonthlyScores}
            />
          </TabPane>
        )}
      </Tabs>
    );
  };

  return (
    <div className="user-kpi-system p-4 md:p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="mb-6">
        Aylıq Performans Dəyərləndirməsi
      </Title>

      <PerformanceFilters
        user={user}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        departments={departments}
        onDepartmentChange={setSelectedDepartment}
        evaluationStatus={evaluationStatus}
        onEvaluationStatusChange={setEvaluationStatus}
        canEvaluate={canEvaluate} 
        activeTab={activeTab}
      />

      <Spin spinning={loading}>{renderContent()}</Spin>

      {selectedUser && activeEvaluationType && (
        <UserEvaluationModal
            visible={isEvalModalVisible}
            onClose={handleModalClose}
            user={selectedUser}
            initialData={activeInitialData}
            evaluationMonth={selectedMonth}
            evaluationType={activeEvaluationType}
            canEdit={canEditModal}
        />
      )}
      {selectedUser && (
          <SummaryModal
            visible={isSummaryModalVisible}
            onClose={handleModalClose}
            user={selectedUser}
            selectedMonth={selectedMonth}
          />
      )}
    </div>
  );
};

export default PerformancePage;
