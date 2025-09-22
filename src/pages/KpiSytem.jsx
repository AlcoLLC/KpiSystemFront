import React, { useState, useContext, useEffect } from "react";
import { Card, Button, Slider, Input, Row, Col, Rate, message, Spin, Empty, Tag, Tooltip } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined
} from "@ant-design/icons";
import BaseModal from "../components/BaseModal";
import AuthContext from "../context/AuthContext";
import kpiAPI from "../api/kpiApi";
import tasksApi from "../api/tasksApi";

const { TextArea } = Input;

const BlockContent = ({ task, user, onReview, evaluationStatus, currentUser }) => {
  const getButtonConfig = () => {
    if (!evaluationStatus) {
      return {
        text: 'Qiymətləndirin',
        color: 'blue',
        disabled: false,
        icon: <StarOutlined />
      };
    }

    const { hasSelfEval, hasSuperiorEval, canEvaluate, evaluationType } = evaluationStatus;
    
    // If current user is the task assignee
    if (currentUser?.id === user?.id) {
      if (hasSelfEval) {
        return {
          text: 'Öz Değerlendirme Tamamlandı',
          color: 'green',
          disabled: true,
          icon: <CheckCircleOutlined />
        };
      } else {
        return {
          text: 'Öz Değerlendirme Yapın',
          color: 'orange',
          disabled: false,
          icon: <StarOutlined />
        };
      }
    }
    
    // If current user is a superior
    if (canEvaluate && evaluationType === 'SUPERIOR') {
      if (hasSuperiorEval) {
        return {
          text: 'Değerlendirildi',
          color: 'green',
          disabled: true,
          icon: <CheckCircleOutlined />
        };
      } else if (!hasSelfEval) {
        return {
          text: 'Öz Değerlendirme Bekleniyor',
          color: 'gray',
          disabled: true,
          icon: <ClockCircleOutlined />
        };
      } else {
        return {
          text: 'Değerlendir',
          color: 'blue',
          disabled: false,
          icon: <StarOutlined />
        };
      }
    }
    
    // Cannot evaluate
    return {
      text: 'Değerlendirme Yapılamaz',
      color: 'gray',
      disabled: true,
      icon: <ExclamationCircleOutlined />
    };
  };

  const buttonConfig = getButtonConfig();

  const getStatusTags = () => {
    if (!evaluationStatus) return null;
    
    const { hasSelfEval, hasSuperiorEval } = evaluationStatus;
    const tags = [];
    
    if (hasSelfEval) {
      tags.push(
        <Tag key="self" color="blue" icon={<UserOutlined />}>
          Öz Değerlendirme ✓
        </Tag>
      );
    }
    
    if (hasSuperiorEval) {
      tags.push(
        <Tag key="superior" color="green" icon={<CheckCircleOutlined />}>
          Üst Değerlendirme ✓
        </Tag>
      );
    }
    
    return tags.length > 0 ? <div className="mt-2">{tags}</div> : null;
  };

  return (
    <Card
      className="h-full bg-white dark:bg-[#1B232D] dark:border dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <UserOutlined className="mr-2" />
            <span className="font-bold">{user?.first_name} {user?.last_name}</span>
          </div>
        </div>
      }
      hoverable
    >
      <div className="space-y-4">
        <div className="flex items-start">
          <MessageOutlined className="text-blue-500 dark:text-blue-400 mr-2 mt-1" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tapşırıq:</div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{task?.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task?.description}</div>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <CalendarOutlined className="text-green-500 dark:text-green-400 mr-2" />
          <span className="text-sm">
            {new Date(task?.due_date || task?.created_at).toLocaleDateString('tr-TR')}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <ClockCircleOutlined className="text-orange-500 dark:text-orange-400 mr-2" />
          <Tag color={task?.status === 'DONE' ? 'green' : 'orange'}>
            {task?.status === 'DONE' ? 'Tamamlandı' : 'Devam Ediyor'}
          </Tag>
        </div>

        {getStatusTags()}

        <Tooltip title={buttonConfig.disabled ? buttonConfig.text : ""}>
          <Button
            type="primary"
            block
            size="large"
            icon={buttonConfig.icon}
            onClick={() => onReview(task, user)}
            disabled={buttonConfig.disabled}
            className={`mt-4 ${
              buttonConfig.color === 'green' ? 'bg-green-500 border-green-500' :
              buttonConfig.color === 'orange' ? 'bg-orange-500 border-orange-500' :
              buttonConfig.color === 'gray' ? 'bg-gray-400 border-gray-400' :
              'bg-blue-500 border-blue-500'
            } hover:opacity-80 disabled:bg-gray-400`}
          >
            {buttonConfig.text}
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

const ReviewModal = ({ isOpen, onClose, task, user, evaluationType, currentUser }) => {
  const [score, setScore] = useState(85);
  const [starRating, setStarRating] = useState(4);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const isOwnEvaluation = currentUser?.id === user?.id;
  const modalTitle = isOwnEvaluation 
    ? `Öz Değerlendirme - ${task?.title}` 
    : `Değerlendirme - ${user?.first_name} ${user?.last_name} - ${task?.title}`;

  const handleSave = async () => {
    if (!task || !user) return;
    
    setLoading(true);
    try {
      const evaluationData = {
        task_id: task.id,
        evaluatee_id: user.id,
        score: starRating * 10, // Convert 1-10 scale to 1-100 scale
        comment: note.trim() || null
      };

      await kpiAPI.createEvaluation(evaluationData);
      
      if (isOwnEvaluation) {
        message.success('Öz değerlendirme başarıyla kaydedildi! Üstünüze bilgilendirme e-postası gönderildi.');
      } else {
        message.success('Değerlendirme başarıyla kaydedildi!');
      }
      
      onClose();
    } catch (error) {
      console.error('Değerlendirme kaydedilemedi:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Bilinmeyen hata';
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          errorMessage = errorData.non_field_errors.join(', ');
        } else if (typeof errorData === 'object') {
          const errors = Object.values(errorData).flat();
          errorMessage = errors.join(', ');
        }
        
        message.error(errorMessage);
      } else {
        message.error('Değerlendirme kaydedilemedi. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setScore(85);
    setStarRating(4);
    setNote("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Modal açıldığında değerleri sıfırla
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

  return (
    <BaseModal
      open={isOpen}
      onOk={handleSave}
      onCancel={handleClose}
      title={modalTitle}
      width={500}
      confirmLoading={loading}
      okText={isOwnEvaluation ? "Öz Değerlendirme Kaydet" : "Değerlendirme Kaydet"}
    >
      <div className="space-y-6">
        {isOwnEvaluation && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center text-blue-700 dark:text-blue-300">
              <UserOutlined className="mr-2" />
              <span className="font-medium">Öz Değerlendirme</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Değerlendirmenizi tamamladıktan sonra üstünüze bilgilendirme e-postası gönderilecek.
            </p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Qiymətləndirmə (1-10 arası):
            </label>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-bold min-w-[60px] text-center shadow-md">
              {starRating}/10
            </div>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="mb-3">
              <StarOutlined className="text-yellow-500 text-lg mr-2" />
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                Puan seçin:
              </span>
            </div>
            <Rate
              count={10}
              value={starRating}
              onChange={setStarRating}
              style={{ fontSize: "28px" }}
            />

            <div className="flex justify-between w-full mt-3 text-xs text-gray-400 dark:text-gray-500 px-2">
              {[...Array(10)].map((_, i) => <span key={i}>{i + 1}</span>)}
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <div className="text-sm">
              {starRating <= 3 && (
                <span className="text-red-500 font-medium">
                  🔴 Performans təkmilləşdirilməlidir
                </span>
              )}
              {starRating > 3 && starRating <= 6 && (
                <span className="text-orange-500 font-medium">
                  🟡 Orta səviyyədə performans
                </span>
              )}
              {starRating > 6 && starRating <= 8 && (
                <span className="text-blue-500 font-medium">
                  🔵 Yaxşı performans
                </span>
              )}
              {starRating > 8 && (
                <span className="text-green-500 font-medium">
                  🟢 Əla performans
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Qeyd (Comment):
          </label>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Qeydlərinizi buraya yazın..."
            rows={4}
            className="resize-none"
          />
        </div>
      </div>
    </BaseModal>
  );
};

function KpiSystem() {
  const { user: currentUser } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvaluationType, setSelectedEvaluationType] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tasks and evaluations
  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksResponse, evaluationsResponse] = await Promise.all([
        tasksApi.getTasks({ status: 'DONE' }),
        kpiAPI.getEvaluations()
      ]);
      
      setTasks(tasksResponse.data.results || tasksResponse.data || []);
      setEvaluations(evaluationsResponse.data.results || evaluationsResponse.data || []);
    } catch (error) {
      console.error('Veri yüklenemedi:', error);
      message.error('Veriler yüklenirken bir hata oluştu');
      
      // Fallback to empty arrays
      setTasks([]);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Get evaluation status for a task
  const getEvaluationStatus = (taskId, userId) => {
    const taskEvaluations = evaluations.filter(evaluation => 
      evaluation.task?.id === taskId && evaluation.evaluatee?.id === userId
    );
    
    const hasSelfEval = taskEvaluations.some(evaluation => evaluation.evaluation_type === 'SELF');
    const hasSuperiorEval = taskEvaluations.some(evaluation => 
      evaluation.evaluation_type === 'SUPERIOR' && evaluation.evaluator?.id === currentUser?.id
    );
    
    // Check if current user can evaluate
    let canEvaluate = false;
    let evaluationType = null;
    
    if (currentUser?.id === userId && !hasSelfEval) {
      canEvaluate = true;
      evaluationType = 'SELF';
    } else if (currentUser?.id !== userId) {
      // Check role hierarchy
      const ROLE_HIERARCHY = {
        "employee": 1,
        "manager": 2,
        "department_lead": 3,
        "top_management": 4,
        "admin": 5
      };
      
      const currentUserLevel = ROLE_HIERARCHY[currentUser?.role] || 0;
      const targetUserLevel = ROLE_HIERARCHY[tasks.find(t => t.id === taskId)?.assigned_to?.role] || 0;
      
      if ((currentUserLevel > targetUserLevel || currentUser?.role === 'admin') && !hasSuperiorEval) {
        canEvaluate = true;
        evaluationType = 'SUPERIOR';
      }
    }
    
    return {
      hasSelfEval,
      hasSuperiorEval,
      canEvaluate,
      evaluationType
    };
  };

  const handleReview = (task, taskUser) => {
    const evaluationStatus = getEvaluationStatus(task.id, taskUser.id);
    
    if (!evaluationStatus.canEvaluate) {
      message.warning('Bu görevi değerlendirme yetkiniz bulunmamaktadır.');
      return;
    }
    
    setSelectedTask(task);
    setSelectedUser(taskUser);
    setSelectedEvaluationType(evaluationStatus.evaluationType);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setSelectedUser(null);
    setSelectedEvaluationType(null);
    // Reload data to reflect changes
    loadData();
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <UserOutlined className="text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            KPI sistemini kullanmak için giriş yapınız.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            KPI İdarəetmə Sistemi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            İşçilərin performansını qiymətləndirin və izləyin
          </p>

          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg">
            <StarOutlined className="mr-2" />
            <span className="font-medium">
              Xoş gəldiniz, {currentUser?.first_name || currentUser?.username}!
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <Empty 
            description="Değerlendirilecek tamamlanmış görev bulunamadı"
            className="mt-8"
          />
        ) : (
          <Row gutter={[24, 24]}>
            {tasks.map((task) => {
              const taskUser = task.assigned_to;
              if (!taskUser) return null;
              
              const evaluationStatus = getEvaluationStatus(task.id, taskUser.id);
              
              return (
                <Col xs={24} sm={12} md={8} key={task.id}>
                  <BlockContent
                    task={task}
                    user={taskUser}
                    onReview={handleReview}
                    evaluationStatus={evaluationStatus}
                    currentUser={currentUser}
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
        user={selectedUser}
        evaluationType={selectedEvaluationType}
        currentUser={currentUser}
      />
    </>
  );
}

export default KpiSystem;