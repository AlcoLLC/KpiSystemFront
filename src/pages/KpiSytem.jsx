import React, { useState, useEffect } from "react";
import { Card, Button, Input, Row, Col, Rate, message, Spin, Empty, Tag, Tooltip, Modal, Badge, Progress, Divider } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  ApartmentOutlined,
  TrophyOutlined,
  FireOutlined
} from "@ant-design/icons";
import useAuth from "../hooks/useAuth";
import kpiAPI from "../api/kpiApi";
import tasksApi from "../api/tasksApi";

const { TextArea } = Input;

// Base Modal Component
const BaseModal = ({ open, onOk, onCancel, title, children, confirmLoading, okText, width }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto`} 
           style={{ width: width || 520, maxWidth: '90vw' }}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <Button onClick={onCancel} className="px-4 py-2">
            İmtina
          </Button>
          <Button 
            type="primary" 
            onClick={onOk}
            loading={confirmLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
          >
            {okText || 'Tamam'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Score Display Component
const ScoreDisplay = ({ score, maxScore, type, size = 'normal' }) => {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = () => {
    if (percentage <= 30) return '#ef4444'; // red
    if (percentage <= 60) return '#f59e0b'; // yellow
    if (percentage <= 80) return '#3b82f6'; // blue
    return '#10b981'; // green
  };

  const getScoreIcon = () => {
    if (percentage <= 30) return '🔴';
    if (percentage <= 60) return '🟡';
    if (percentage <= 80) return '🔵';
    return '🟢';
  };

  const sizeClass = size === 'large' ? 'text-2xl px-6 py-3' : 'text-lg px-4 py-2';
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className={`${sizeClass} rounded-lg font-bold text-white shadow-lg transform transition-all duration-300 hover:scale-105`}
        style={{ backgroundColor: getScoreColor() }}
      >
        {score}/{maxScore}
      </div>
      <div className="flex items-center space-x-1 text-sm">
        <span>{getScoreIcon()}</span>
        <span className="text-gray-600">
          {type === 'self' ? 'Öz Qiymət' : 'Final Skor'}
        </span>
      </div>
      {size === 'large' && (
        <Progress 
          percent={percentage} 
          strokeColor={getScoreColor()}
          size="small"
          showInfo={false}
          className="w-full max-w-[200px]"
        />
      )}
    </div>
  );
};

// Evaluation Details Modal
const EvaluationDetailsModal = ({ open, onClose, task, evaluations }) => {
  if (!task) return null;

  const selfEvaluation = evaluations.find(e => e.evaluation_type === 'SELF');
  const superiorEvaluation = evaluations.find(e => e.evaluation_type === 'SUPERIOR');

  return (
    <BaseModal
      open={open}
      onCancel={onClose}
      title={`Dəyərləndirmə Detalları - ${task.title}`}
      width={700}
      onOk={onClose}
      okText="Bağla"
    >
      <div className="space-y-6">
        {/* Task Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
            <ApartmentOutlined className="mr-2 text-lg" />
            Tapşırıq Məlumatları
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
            <div><strong>Başlıq:</strong> {task.title}</div>
            <div><strong>İşçi:</strong> {task.assignee_details}</div>
            <div>
              <strong>Status:</strong> 
              <Tag color="green" className="ml-2">{task.status_display}</Tag>
            </div>
            <div>
              <strong>Prioritet:</strong>
              <Tag color={
                task.priority === 'CRITICAL' ? 'red' : 
                task.priority === 'HIGH' ? 'orange' :
                task.priority === 'MEDIUM' ? 'blue' : 'green'
              } className="ml-2">
                {task.priority_display}
              </Tag>
            </div>
            {task.due_date && (
              <div className="col-span-2">
                <strong>Son tarix:</strong> {new Date(task.due_date).toLocaleDateString('az-AZ')}
              </div>
            )}
          </div>
        </div>

        {/* Score Summary */}
        {(selfEvaluation || superiorEvaluation) && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
              <TrophyOutlined className="mr-2 text-lg" />
              Skor Özeti
            </h4>
            <div className="flex justify-around items-center">
              {selfEvaluation && (
                <ScoreDisplay 
                  score={selfEvaluation.self_score} 
                  maxScore={10} 
                  type="self"
                  size="large"
                />
              )}
              {superiorEvaluation && (
                <ScoreDisplay 
                  score={superiorEvaluation.final_score} 
                  maxScore={100} 
                  type="superior"
                  size="large"
                />
              )}
            </div>
          </div>
        )}

        <Divider />

        {/* Self Evaluation Details */}
        {selfEvaluation && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-4 flex items-center">
              <UserOutlined className="mr-2 text-lg" />
              Öz Dəyərləndirmə Detalları
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-orange-700 font-medium">Skor:</span>
                <ScoreDisplay 
                  score={selfEvaluation.self_score} 
                  maxScore={10} 
                  type="self"
                />
              </div>
              {selfEvaluation.comment && (
                <div className="bg-orange-100 p-4 rounded-lg">
                  <div className="text-orange-800 font-medium mb-2">Qeyd:</div>
                  <div className="text-orange-700 italic">"{selfEvaluation.comment}"</div>
                </div>
              )}
              <div className="text-sm text-orange-600 flex items-center">
                <CalendarOutlined className="mr-2" />
                Tarix: {new Date(selfEvaluation.created_at).toLocaleDateString('az-AZ')}
              </div>
            </div>
          </div>
        )}

        {/* Superior Evaluation Details */}
        {superiorEvaluation && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-4 flex items-center">
              <StarOutlined className="mr-2 text-lg" />
              Üst Dəyərləndirmə Detalları
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-medium">Final Skor:</span>
                <ScoreDisplay 
                  score={superiorEvaluation.final_score} 
                  maxScore={100} 
                  type="superior"
                />
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="text-green-800 font-medium mb-2">Dəyərləndirən:</div>
                <div className="text-green-700 flex items-center">
                  <UserOutlined className="mr-2" />
                  {superiorEvaluation.evaluator?.full_name || superiorEvaluation.evaluator?.username}
                </div>
              </div>
              {superiorEvaluation.comment && (
                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="text-green-800 font-medium mb-2">Qeyd:</div>
                  <div className="text-green-700 italic">"{superiorEvaluation.comment}"</div>
                </div>
              )}
              <div className="text-sm text-green-600 flex items-center">
                <CalendarOutlined className="mr-2" />
                Tarix: {new Date(superiorEvaluation.created_at).toLocaleDateString('az-AZ')}
              </div>
            </div>
          </div>
        )}

        {/* No Evaluation Message */}
        {!selfEvaluation && !superiorEvaluation && (
          <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200">
            <ExclamationCircleOutlined className="text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600 text-lg">Hələ ki dəyərləndirmə edilməyib</p>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

const BlockContent = ({ task, onReview, evaluationStatus, currentUser, onViewDetails }) => {
  const getButtonConfig = () => {
    if (!evaluationStatus) {
      return {
        text: 'Məlumat Yoxdur',
        color: 'gray',
        disabled: true,
        icon: <ExclamationCircleOutlined />
      };
    }
  
    const { hasSelfEval, hasSuperiorEval, canEvaluate, evaluationType } = evaluationStatus;

    if (hasSelfEval && hasSuperiorEval) {
      return {
        text: 'Dəyərləndirmə Detalları',
        color: 'purple',
        disabled: false,
        icon: <EyeOutlined />,
        isViewOnly: true
      };
    }
  
    if (currentUser?.id === task?.assignee) {
      if (hasSelfEval) {
        return {
          text: 'Rəhbər Dəyərləndirməsi Gözlənilir',
          color: 'gray',
          disabled: true,
          icon: <ClockCircleOutlined />
        };
      } else {
        return {
          text: 'Özünü Dəyərləndir (1-10)',
          color: 'orange',
          disabled: false,
          icon: <StarOutlined />
        };
      }
    }
  
    // Department based hierarchy check
    if (canEvaluate && evaluationType === 'SUPERIOR') {
      if (!hasSelfEval && currentUser.role !== 'admin') {
        return {
          text: 'İşçinin Öz Dəyərləndirməsi Gözlənilir',
          color: 'gray',
          disabled: true,
          icon: <ClockCircleOutlined />
        };
      } else {
        return {
          text: `${task.assignee_details} dəyərləndir (1-100)`,
          color: 'blue',
          disabled: false,
          icon: <FireOutlined />
        };
      }
    }
  
    if (hasSelfEval || hasSuperiorEval) {
        return {
          text: 'Dəyərləndirmə Detalları',
          color: 'gray',
          disabled: false,
          icon: <EyeOutlined />,
          isViewOnly: true
        };
    }
    
    return {
      text: 'Dəyərləndirmə Mövcud Deyil',
      color: 'gray',
      disabled: true,
      icon: <ExclamationCircleOutlined />
    };
  };

  const buttonConfig = getButtonConfig();

  const getStatusTags = () => {
    if (!evaluationStatus) return null;
    
    const { hasSelfEval, hasSuperiorEval, evaluations } = evaluationStatus;
    const tags = [];
    
    if (hasSelfEval) {
      const selfEval = evaluations.find(e => e.evaluation_type === 'SELF');
      tags.push(
        <Tag key="self" color="orange" className="text-xs flex items-center">
          <UserOutlined className="mr-1" />
          Öz: {selfEval?.self_score}/10
        </Tag>
      );
    }
    
    if (hasSuperiorEval) {
      const superiorEval = evaluations.find(e => e.evaluation_type === 'SUPERIOR');
      tags.push(
        <Tag key="superior" color="green" className="text-xs flex items-center">
          <TrophyOutlined className="mr-1" />
          Final: {superiorEval?.final_score}/100
        </Tag>
      );
    }
    
    return tags.length > 0 ? <div className="mt-3 flex flex-wrap gap-1">{tags}</div> : null;
  };

  const handleButtonClick = () => {
    if (buttonConfig.isViewOnly) {
      onViewDetails(task);
    } else {
      onReview(task);
    }
  };

  return (
    <Card
      className="h-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-600">
            <UserOutlined className="mr-2" />
            <span className="font-bold text-sm">{task?.assignee_details || 'N/A'}</span>
          </div>
          <Badge 
            count={task?.priority === 'CRITICAL' ? 'CRITICAL' : ''} 
            style={{ backgroundColor: '#ff4d4f' }}
          />
        </div>
      }
      hoverable
    >
      <div className="space-y-3">
        <div className="flex items-start">
          <MessageOutlined className="text-blue-500 mr-2 mt-1" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Tapşırıq:</div>
            <div className="font-medium text-gray-800 text-sm">{task?.title}</div>
            {task?.description && (
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</div>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-gray-600">
          <CalendarOutlined className="text-green-500 mr-2" />
          <span className="text-xs">
            {task?.due_date 
              ? new Date(task.due_date).toLocaleDateString('az-AZ')
              : new Date(task?.created_at).toLocaleDateString('az-AZ')
            }
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Tag color={task?.status === 'DONE' ? 'green' : 'orange'} className="text-xs">
            {task?.status_display || 'Tamamlandı'}
          </Tag>
          
          <Tag color={
            task?.priority === 'CRITICAL' ? 'red' : 
            task?.priority === 'HIGH' ? 'orange' :
            task?.priority === 'MEDIUM' ? 'blue' : 'green'
          } className="text-xs">
            {task?.priority_display || task?.priority}
          </Tag>
        </div>

        {getStatusTags()}

        <Tooltip title={buttonConfig.disabled ? buttonConfig.text : ""}>
          <Button
            type={buttonConfig.isViewOnly ? "default" : "primary"}
            block
            size="large"
            icon={buttonConfig.icon}
            onClick={handleButtonClick}
            disabled={buttonConfig.disabled}
            className={`mt-4 hover:opacity-80 text-xs font-semibold transform transition-all duration-200 ${
              !buttonConfig.disabled && !buttonConfig.isViewOnly ? 'hover:scale-105 shadow-lg' : ''
            }`}
            style={{
                backgroundColor: buttonConfig.disabled && !buttonConfig.isViewOnly ? '#d1d5db' : 
                                 buttonConfig.color === 'green' ? '#10B981' :
                                 buttonConfig.color === 'orange' ? '#F59E0B' :
                                 buttonConfig.color === 'purple' ? '#8B5CF6' :
                                 buttonConfig.color === 'gray' ? '#9CA3AF' : '#3B82F6',
                borderColor: buttonConfig.disabled && !buttonConfig.isViewOnly ? '#d1d5db' : 
                             buttonConfig.color === 'green' ? '#10B981' :
                             buttonConfig.color === 'orange' ? '#F59E0B' :
                             buttonConfig.color === 'purple' ? '#8B5CF6' :
                             buttonConfig.color === 'gray' ? '#9CA3AF' : '#3B82F6',
                color: 'white'
            }}
          >
            {buttonConfig.text}
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

const ReviewModal = ({ isOpen, onClose, task, evaluationType, currentUser }) => {
  const [starRating, setStarRating] = useState(5);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const isOwnEvaluation = currentUser?.id === task?.assignee;
  const maxScore = isOwnEvaluation ? 10 : 100;
  const modalTitle = isOwnEvaluation 
    ? `Özünü Dəyərləndir (1-10) - ${task?.title}` 
    : `${task?.assignee_details} dəyərləndir (1-100) - ${task?.title}`;

  const handleSave = async () => {
    if (!task) return;
    
    setLoading(true);
    try {
      const evaluationData = {
        task_id: task.id,
        evaluatee_id: task.assignee,
        score: starRating,
        comment: note.trim() || null
      };

      await kpiAPI.createEvaluation(evaluationData);
      
      if (isOwnEvaluation) {
        message.success('Öz dəyərləndirmə uğurla qeydə alındı! Rəhbərə məlumat e-poçtu göndərildi.');
      } else {
        message.success('Üst dəyərləndirmə uğurla qeydə alındı! Bu skor final skor olaraq sayılacaq.');
      }
      
      onClose();
    } catch (error) {
      console.error('Dəyərləndirmə qeydə alına bilmədi:', error);
      const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.non_field_errors?.[0] ||
                           Object.values(error.response?.data || {})[0] ||
                           'Dəyərləndirmə qeydə alına bilmədi. Zəhmət olmasa yenidən cəhd edin.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStarRating(isOwnEvaluation ? 5 : 50);
    setNote("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen, isOwnEvaluation]);

  const getScoreDescription = () => {
    if (isOwnEvaluation) {
      if (starRating <= 3) return "🔴 Performans təkmilləşdirilməlidir";
      if (starRating <= 6) return "🟡 Orta səviyyədə performans";
      if (starRating <= 8) return "🔵 Yaxşı performans";
      return "🟢 Əla performans";
    } else {
      if (starRating <= 30) return "🔴 Performans təkmilləşdirilməlidir";
      if (starRating <= 60) return "🟡 Orta səviyyədə performans";
      if (starRating <= 80) return "🔵 Yaxşı performans";
      return "🟢 Əla performans";
    }
  };

  return (
    <BaseModal
      open={isOpen}
      onOk={handleSave}
      onCancel={handleClose}
      title={modalTitle}
      width={600}
      confirmLoading={loading}
      okText={isOwnEvaluation ? "Öz Dəyərləndirməni Qeyd Et" : "Üst Dəyərləndirməni Qeyd Et"}
    >
      <div className="space-y-6">
        {/* Department Hierarchy Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center text-indigo-700">
            <ApartmentOutlined className="mr-2 text-lg" />
            <span className="font-medium">
              {isOwnEvaluation ? 'Departmental Öz Dəyərləndirmə' : 'Departmental Hiyerarxik Dəyərləndirmə'}
            </span>
          </div>
          <p className="text-sm text-indigo-600 mt-2">
            {isOwnEvaluation 
              ? 'Eyni departamentdəki rəhbərinizə məlumat göndəriləcək.'
              : 'Departamentinizin hiyerarxiyasına uyğun dəyərləndirmə edirsiniz.'
            }
          </p>
        </div>

        {isOwnEvaluation && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center text-orange-700">
              <UserOutlined className="mr-2" />
              <span className="font-medium">Öz Dəyərləndirmə (1-10 skala)</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Dəyərləndirməni tamamladıqdan sonra departament rəhbərinə məlumat e-poçtu göndəriləcək.
            </p>
          </div>
        )}

        {!isOwnEvaluation && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center text-green-700">
              <StarOutlined className="mr-2" />
              <span className="font-medium">Üst Dəyərləndirmə (1-100 skala)</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Bu dəyərləndirmə final skor olaraq qeydə alınacaq və sistemdə görünəcək.
            </p>
          </div>
        )}

        {/* Current Score Display */}
        <div className="text-center">
          <ScoreDisplay 
            score={starRating} 
            maxScore={maxScore} 
            type={isOwnEvaluation ? 'self' : 'superior'} 
            size="large"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">
              Qiymətləndirmə (1-{maxScore} arası):
            </label>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="mb-4">
              <StarOutlined className="text-yellow-500 text-xl mr-2" />
              <span className="text-gray-700 font-medium">
                Puan seçin:
              </span>
            </div>
            
            {isOwnEvaluation ? (
              <div className="w-full max-w-md">
                <Rate
                  count={10}
                  value={starRating}
                  onChange={setStarRating}
                  style={{ fontSize: "32px" }}
                  className="flex justify-center"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-3 px-2">
                  {[...Array(10)].map((_, i) => <span key={i}>{i + 1}</span>)}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-lg">
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={starRating}
                    onChange={(e) => setStarRating(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-4 focus:ring-blue-300"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${starRating}%, #e5e7eb ${starRating}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-3">
                  <span>1</span>
                  <span>20</span>
                  <span>40</span>
                  <span>60</span>
                  <span>80</span>
                  <span>100</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {getScoreDescription()}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <MessageOutlined className="mr-2 text-blue-500" />
            Qeyd (Comment):
          </label>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Qeydlərinizi buraya yazın... (məcburi deyil)"
            rows={4}
            className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </BaseModal>
  );
};

function KpiSystem() {
  const { user: currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEvaluationType, setSelectedEvaluationType] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Veri yüklənmədi:', error);
      message.error('Verilər yüklənərkən xəta baş verdi');
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

  const getEvaluationStatus = (taskId, assigneeId) => {
    const taskEvaluations = evaluations.filter(evaluation => 
      evaluation.task?.id === taskId && evaluation.evaluatee?.id === assigneeId
    );
    
    const hasSelfEval = taskEvaluations.some(evaluation => evaluation.evaluation_type === 'SELF');
    const superiorEvaluation = taskEvaluations.find(evaluation => evaluation.evaluation_type === 'SUPERIOR');
    const hasSuperiorEval = !!superiorEvaluation;
    
    let canEvaluate = false;
    let evaluationType = null;
    
    if (Number(currentUser?.id) === Number(assigneeId) && !hasSelfEval) {
      canEvaluate = true;
      evaluationType = 'SELF';
    } else if (currentUser?.id !== assigneeId && !hasSuperiorEval) {
        // Departamental hiyerarxiya yoxlaması - backend təsdiqləyəcək
        const isSuperiorOrAdmin = ['admin', 'top_management', 'department_lead', 'manager'].includes(currentUser?.role);
        if(isSuperiorOrAdmin){
            canEvaluate = true;
            evaluationType = 'SUPERIOR';
        }
    }
    
    return {
      hasSelfEval,
      hasSuperiorEval,
      canEvaluate,
      evaluationType,
      evaluations: taskEvaluations
    };
  };

  const handleReview = (task) => {
    const evaluationStatus = getEvaluationStatus(task.id, task.assignee);
    
    setSelectedTask(task);
    setSelectedEvaluationType(evaluationStatus.evaluationType);
    setModalOpen(true);
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setDetailsModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setSelectedEvaluationType(null);
    loadData();
  };

  const handleDetailsModalClose = () => {
    setDetailsModalOpen(false);
    setSelectedTask(null);
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
          <UserOutlined className="text-5xl text-blue-400 mb-4" />
          <p className="text-gray-600 text-lg">
            KPI sistemini istifadə etmək üçün daxil olun.
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
          <p className="text-gray-600">Dəyərləndirmələr yüklənir...</p>
        </div>
      </div>
    );
  }

  const getSelectedTaskEvaluations = () => {
    if (!selectedTask) return [];
    return evaluations.filter(evaluation => 
      evaluation.task?.id === selectedTask.id && evaluation.evaluatee?.id === selectedTask.assignee
    );
  };

  return (
    <>
      <div className="mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            KPI İdarəetmə Sistemi
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Departamental hiyerarxiyaya uyğun performans qiymətləndirmə sistemi
          </p>

          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg shadow-sm border border-green-200">
              <TrophyOutlined className="mr-2 text-lg" />
              <span className="font-medium">
                Xoş gəldiniz, {currentUser?.first_name || currentUser?.username}!
              </span>
            </div>
            
            {currentUser?.department && (
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-lg shadow-sm border border-blue-200">
                <ApartmentOutlined className="mr-2" />
                <span className="font-medium text-sm">
                  {currentUser.department.name || 'Departament'}
                </span>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 inline-block max-w-2xl">
            <InfoCircleOutlined className="mr-2 text-yellow-600" />
            <strong className="text-yellow-800">Departamental Qiymətləndirmə Sistemi:</strong>
            <div className="mt-2 text-sm text-yellow-700">
              • <strong>Öz dəyərləndirmə:</strong> <span className="font-semibold text-orange-600">1-10 skala</span>
              <br />
              • <strong>Üst dəyərləndirmə:</strong> <span className="font-semibold text-green-600">1-100 skala (Final skor)</span>
              <br />
              • Eyni departamentdəki hiyerarxik quruluşa uyğun dəyərləndirmə
            </div>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <Empty 
              description={
                <div>
                  <p className="text-lg text-gray-600 mb-2">Dəyərləndirilməli tamamlanmış tapşırıq tapılmadı</p>
                  <p className="text-sm text-gray-500">Tapşırıqlar tamamlandıqda burada görünəcək</p>
                </div>
              }
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8"
            />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {tasks.map((task) => {
              if (!task.assignee) return null;
              
              const evaluationStatus = getEvaluationStatus(task.id, task.assignee);
              
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={task.id}>
                  <BlockContent
                    task={task}
                    onReview={handleReview}
                    onViewDetails={handleViewDetails}
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
        evaluationType={selectedEvaluationType}
        currentUser={currentUser}
      />

      <EvaluationDetailsModal
        open={detailsModalOpen}
        onClose={handleDetailsModalClose}
        task={selectedTask}
        evaluations={getSelectedTaskEvaluations()}
      />
    </>
  );
}

export default KpiSystem;