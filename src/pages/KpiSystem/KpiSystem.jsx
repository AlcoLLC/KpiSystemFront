import { useState, useEffect, useMemo } from "react";
import { Row, Col, message, Spin, Empty, Divider, Select, Space, Flex, Typography } from "antd"; 
import {
  UserOutlined,
  ApartmentOutlined,
  TrophyOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  ProfileOutlined,
  EyeOutlined,
  TeamOutlined,
  AppstoreOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import useAuth from "../../hooks/useAuth";
import kpiAPI from "../../api/kpiApi";

import BlockContent from "./components/BlockContent";
import ReviewModal from "./components/ReviewModal";
import EvaluationDetailsModal from "./components/EvaluationDetailsModal";
import EditReviewModal from "./components/EditReviewModal";
import "../../styles/kpi.css";

// ... (filterOptions, TaskSection, getEvaluationStatus funksiyaları dəyişməz qalır) ...
const filterOptions = [
    { value: 'all', label: 'Bütün Tapşırıqlar', icon: <AppstoreOutlined /> },
    { value: 'pendingForMyEvaluation', label: 'Mənim Qiymətləndirməli Olduqlarım', icon: <FileDoneOutlined /> },
    { value: 'needsSelfEvaluation', label: 'Özünü Qiymətləndirməli Olduqlarım', icon: <ProfileOutlined /> },
    { value: 'pendingSuperiorEvaluation', label: 'Rəhbər Qiymətləndirməsini Gözləyənlər', icon: <ClockCircleOutlined /> },
    { value: 'subordinatesAwaitingEval', label: 'Tabelikdəkilərin Gözləyən Tapşırıqları', icon: <TeamOutlined /> },
    { value: 'evaluatedByMe', label: 'Mənim Qiymətləndirdiklərim', icon: <CheckCircleOutlined /> },
    { value: 'otherTasks', label: 'Digər Tamamlanmış Tapşırıqlar', icon: <EyeOutlined /> },
];

const TaskSection = ({ title, tasks, icon, onReview, onViewDetails, currentUser }) => {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
        <Divider orientation="left" style={{ borderColor: '#9ca3af' }}>
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
                {icon}
                <span className="ml-2">{title}</span>
            </h2>
        </Divider>
      <Row gutter={[16, 16]}>
        {tasks.map((task) => {
          if (!task.assignee) return null;
          const evaluationStatus = getEvaluationStatus(task);
          const isPendingForMe = task.isPendingForMe;

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={task.id}>
              <BlockContent
                task={task}
                onReview={onReview}
                onViewDetails={onViewDetails}
                evaluationStatus={evaluationStatus}
                currentUser={currentUser}
                isPendingForMe={isPendingForMe}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

const getEvaluationStatus = (task) => {
    if (!task || !task.evaluations) {
        return { hasSelfEval: false, hasSuperiorEval: false, evaluations: [] };
    }
    const evaluations = task.evaluations;
    const hasSelfEval = evaluations.some((e) => e.evaluation_type === "SELF");
    const hasSuperiorEval = evaluations.some(
        (e) => e.evaluation_type === "SUPERIOR"
    );
    return { hasSelfEval, hasSuperiorEval, evaluations };
};


function KpiSystem() {
    // ... (bütün state və funksiyalar dəyişməz qalır) ...
    const { user: currentUser } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [evaluationToEdit, setEvaluationToEdit] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');

    const loadData = async () => {
    setLoading(true);
    try {
      const tasksResponse = await kpiAPI.getKpiDashboardTasks();
      let fetchedTasks = tasksResponse.data.results || tasksResponse.data || [];

      if (
        ["admin", "top_management", "department_lead", "manager"].includes(
          currentUser?.role
        )
      ) {
        const pendingResponse = await kpiAPI.getPendingForMe();
        const pendingForMeIds = new Set((pendingResponse.data || []).map(t => t.id));
        
        fetchedTasks = fetchedTasks.map(task => ({
          ...task,
          isPendingForMe: pendingForMeIds.has(task.id)
        }));
      }
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Data could not be loaded:", error);
      message.error("An error occurred while loading data.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);
  
  const taskData = useMemo(() => {
    if (!currentUser) return {};

    const allCategorizedTasks = {
        needsSelfEvaluation: [],
        pendingSuperiorEvaluation: [],
        pendingForMyEvaluation: [],
        subordinatesAwaitingEval: [],
        evaluatedByMe: [],
        otherTasks: [],
    };

    tasks.forEach(task => {
        if (!task || typeof task.assignee === 'undefined' || task.assignee === null) return;

        const { hasSelfEval, hasSuperiorEval, evaluations } = getEvaluationStatus(task);

        if (task.isPendingForMe) {
            allCategorizedTasks.pendingForMyEvaluation.push(task);
            return;
        }
        if (task.assignee === currentUser.id && !hasSelfEval) {
            allCategorizedTasks.needsSelfEvaluation.push(task);
            return;
        }
        if (task.assignee === currentUser.id && hasSelfEval && !hasSuperiorEval) {
            allCategorizedTasks.pendingSuperiorEvaluation.push(task);
            return;
        }
        const superiorEvalByMe = evaluations.find(
            e => e.evaluation_type === 'SUPERIOR' && e.evaluator.id === currentUser.id
        );
        if (superiorEvalByMe) {
            allCategorizedTasks.evaluatedByMe.push(task);
            return;
        }
        if (task.assignee !== currentUser.id && !hasSelfEval) {
            allCategorizedTasks.subordinatesAwaitingEval.push(task);
            return;
        }
        if (hasSelfEval && hasSuperiorEval) {
          allCategorizedTasks.otherTasks.push(task);
        }
    });
    
    const combinedTasksToEvaluate = [
        ...allCategorizedTasks.pendingForMyEvaluation,
        ...allCategorizedTasks.needsSelfEvaluation,
    ];

    const combinedOtherTasks = [
        ...allCategorizedTasks.pendingSuperiorEvaluation,
        ...allCategorizedTasks.subordinatesAwaitingEval,
        ...allCategorizedTasks.evaluatedByMe,
        ...allCategorizedTasks.otherTasks,
    ];

    return { ...allCategorizedTasks, combinedTasksToEvaluate, combinedOtherTasks };

  }, [tasks, currentUser]);
  
  const handleReview = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };
  
  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setDetailsModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTask(null);
    loadData();
  };

  const handleDetailsModalClose = () => {
    setDetailsModalOpen(false);
    setSelectedTask(null);
  };

  const handleEdit = (evaluation) => {
    setEvaluationToEdit(evaluation);
    setDetailsModalOpen(false);
    setEditModalOpen(true);
  };

  const handleEditModalClose = (shouldReload = false) => {
    setEditModalOpen(false);
    setEvaluationToEdit(null);
    if (shouldReload) {
      loadData();
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" tip="Qiymətləndirmələr yüklənir..." />
      </div>
    );
  }

  const isAllTasksEmpty = tasks.length === 0;
  
  const selectedTaskSet = taskData[selectedFilter] || [];
  const selectedOption = filterOptions.find(opt => opt.value === selectedFilter);

  return (
    <div className="kpi-container">
      <div className="mx-auto p-4">
        {/* --- DƏYİŞİKLİK BURADA BAŞLAYIR: YENİ BAŞLIQ DİZAYNI --- */}
        <div className="text-center mb-10">
            <div className="mb-6">
                <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent pb-2">
                    İdarəetmə Sistemi
                </h1>
                <p className="text-lg text-gray-500">
                    Departament üzrə performansın qiymətləndirilməsi portalı
                </p>
            </div>
          
            <div className="flex justify-center items-center space-x-4 mb-6">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg shadow-sm border border-green-200">
                    <TrophyOutlined className="mr-2 text-lg" />
                    <span className="font-medium">
                        Xoş gəlmisiniz, {currentUser?.first_name || currentUser?.username}!
                    </span>
                </div>
                {currentUser?.department && (
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-lg shadow-sm border border-blue-200">
                        <ApartmentOutlined className="mr-2" />
                        <span className="font-medium text-sm">
                            {currentUser.department.name || "Department"}
                        </span>
                    </div>
                )}
            </div>
            
            
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
    <Flex align="center" justify="space-between">
        <Space align="baseline">
            <FilterOutlined style={{ color: '#4b5563', fontSize: '18px' }} />
            <Typography.Text strong className="text-gray-600">
                Tapşırıq Görünüşünü Filtrlə
            </Typography.Text>
        </Space>
        <Select
            size="large"
            style={{ width: 350 }}
            value={selectedFilter}
            onChange={handleFilterChange}
            getPopupContainer={triggerNode => triggerNode.parentNode}
        >
            {filterOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                   <Space>
                       {opt.icon}
                       {opt.label}
                   </Space>
                </Select.Option>
            ))}
        </Select>
    </Flex>
</div>
        
        {isAllTasksEmpty ? (
            <div className="text-center py-16">
                <Empty description="Qiymətləndirmə üçün tamamlanmış tapşırıq tapılmadı." />
            </div>
        ) : (
            <>
              {selectedFilter === 'all' ? (
                <>
                  <TaskSection
                    title="Qiymətləndirilməli Tapşırıqlar"
                    tasks={taskData.combinedTasksToEvaluate || []}
                    icon={<FileDoneOutlined />}
                    onReview={handleReview}
                    onViewDetails={handleViewDetails}
                    currentUser={currentUser}
                  />
                  <TaskSection
                    title="Digər Tapşırıqlar"
                    tasks={taskData.combinedOtherTasks || []}
                    icon={<EyeOutlined />}
                    onReview={handleReview}
                    onViewDetails={handleViewDetails}
                    currentUser={currentUser}
                  />
                </>
              ) : (
                <TaskSection
                  title={selectedOption?.label}
                  tasks={selectedTaskSet}
                  icon={selectedOption?.icon}
                  onReview={handleReview}
                  onViewDetails={handleViewDetails}
                  currentUser={currentUser}
                />
              )}
            </>
        )}
      </div>

      {/* Modals olduğu kimi qalır */}
      <ReviewModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        task={selectedTask}
        currentUser={currentUser}
      />
      <EvaluationDetailsModal
        open={detailsModalOpen}
        onClose={handleDetailsModalClose}
        task={selectedTask}
        evaluations={selectedTask?.evaluations || []}
        onEdit={handleEdit}
      />
      <EditReviewModal
        isOpen={editModalOpen}
        onClose={handleEditModalClose}
        evaluation={evaluationToEdit}
      />
    </div>
  );
}

export default KpiSystem;