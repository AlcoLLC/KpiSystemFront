import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, message, Spin, Empty } from "antd";
import {
  UserOutlined,
  ApartmentOutlined,
  TrophyOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import useAuth from "../../hooks/useAuth";
import kpiAPI from "../../api/kpiApi";

import BlockContent from "./components/BlockContent";
import ReviewModal from "./components/ReviewModal";
import EvaluationDetailsModal from "./components/EvaluationDetailsModal";
import EditReviewModal from "./components/EditReviewModal";

function KpiSystem() {
  const { user: currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [evaluationToEdit, setEvaluationToEdit] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pendingForMe, setPendingForMe] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const tasksResponse = await kpiAPI.getKpiDashboardTasks();
      setTasks(tasksResponse.data.results || tasksResponse.data || []);

      if (
        ["admin", "top_management", "department_lead", "manager"].includes(
          currentUser?.role
        )
      ) {
        const pendingResponse = await kpiAPI.getPendingForMe();
        setPendingForMe(pendingResponse.data || []);
      }
    } catch (error) {
      console.error("Data could not be loaded:", error);
      message.error("An error occurred while loading data.");
      setTasks([]);
      setPendingForMe([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const pendingForMeTaskIds = useMemo(
    () => new Set(pendingForMe.map((task) => task.id)),
    [pendingForMe]
  );

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

  const handleReview = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
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

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
          <UserOutlined className="text-5xl text-blue-400 mb-4" />
          <p className="text-gray-600 text-lg">
            Please log in to use the KPI system.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Spin size="large" className="mb-4" />
          <p className="text-gray-600">Loading evaluations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            KPI Management System
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Performance evaluation system based on departmental hierarchy.
          </p>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg shadow-sm border border-green-200">
              <TrophyOutlined className="mr-2 text-lg" />
              <span className="font-medium">
                Welcome, {currentUser?.first_name || currentUser?.username}!
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
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 inline-block max-w-2xl">
            <InfoCircleOutlined className="mr-2 text-yellow-600" />
            <strong className="text-yellow-800">
              Departmental Evaluation System:
            </strong>
            <div className="mt-2 text-sm text-yellow-700">
              • <strong>Self-evaluation:</strong>{" "}
              <span className="font-semibold text-orange-600">1-10 scale</span>
              <br />• <strong>Superior evaluation:</strong>{" "}
              <span className="font-semibold text-green-600">
                1-100 scale (Final score)
              </span>
              <br />• Evaluation based on hierarchical structure within the same department.
            </div>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <Empty description="No completed tasks found for evaluation." />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {tasks.map((task) => {
              if (!task.assignee) return null;
              const evaluationStatus = getEvaluationStatus(task);
              const isPendingForMe = pendingForMeTaskIds.has(task.id);

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={task.id}>
                  <BlockContent
                    task={task}
                    onReview={handleReview}
                    onViewDetails={handleViewDetails}
                    evaluationStatus={evaluationStatus}
                    currentUser={currentUser}
                    isPendingForMe={isPendingForMe}
                  />
                </Col>
              );
            })}
          </Row>
        )}
      </div>

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
    </>
  );
}

export default KpiSystem;