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
    setActiveInitialData(initialData); // Superior və ya TM balını ötürür
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
    setActiveEvaluationType(null); // Təmizlə
    setActiveInitialData(null); // Təmizlə
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
      // ... (canEvaluate false olduqda)
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
        canEvaluate={canEvaluate} // Bu filter üçün lazımdır
        activeTab={activeTab} // Bu filter üçün lazımdır
      />

      <Spin spinning={loading}>{renderContent()}</Spin>

      {selectedUser && activeEvaluationType && (
        <UserEvaluationModal
            visible={isEvalModalVisible}
            onClose={handleModalClose}
            user={selectedUser}
            initialData={activeInitialData} // Dəyişdirildi
            evaluationMonth={selectedMonth}
            evaluationType={activeEvaluationType} // Dəyişdirildi
            canEdit={canEditModal} // Dəyişdirildi
        />
      )}
      {/* SummaryModal dəyişməz qalır */}
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
