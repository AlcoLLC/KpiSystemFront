import { useState, useEffect } from "react";
import { Input, Rate, message } from "antd";
import { 
    MessageOutlined, 
    UserOutlined, 
    StarOutlined,
    InfoCircleOutlined 
} from "@ant-design/icons";
import kpiAPI from "../../../api/kpiApi";
import BaseModal from "./BaseModal";
import ScoreDisplay from "./ScoreDisplay";

const { TextArea } = Input;

const ReviewModal = ({ isOpen, onClose, task, currentUser }) => {
  const [starRating, setStarRating] = useState(5);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const isOwnEvaluation = currentUser?.id === task?.assignee;
  const maxScore = isOwnEvaluation ? 10 : 100;
  const modalTitle = isOwnEvaluation 
    ? `Şəxsi Dəyərləndirmə (1-10) - ${task?.title}` 
    : `Dəyərləndirmə: ${task?.assignee_details} (1-100) - ${task?.title}`;

  const handleSave = async () => {
    if (!task) return;
    setLoading(true);
    try {
      const evaluationData = {
        task_id: task.id,
        evaluatee_id: task.assignee,
        score: starRating,
        comment: note.trim() || null,
      };
      await kpiAPI.createEvaluation(evaluationData);
      message.success(isOwnEvaluation 
        ? "Dəyərləndirməniz qeydə alındı! Rəhbərinizə bildiriş göndərildi." 
        : "Yekun dəyərləndirmə uğurla qeydə alındı!");
      onClose(true); 
    } catch (error) {
      console.error("Failed to save evaluation:", error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || Object.values(error.response?.data || {})[0] || "Dəyərləndirməni yadda saxlamq mümkün olmadı.";
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
    onClose(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen, isOwnEvaluation]);

    const getScoreDescription = () => {
    const score = starRating;
    const thresholds = isOwnEvaluation
      ? { low: 3, mid: 6, high: 8 }
      : { low: 30, mid: 60, high: 80 };

    if (score <= thresholds.low) {
      return {
        text: "🔴 Performans yaxşılaşdırılmalıdır",
        className: "text-red-600 dark:text-red-400",
      };
    }
    if (score <= thresholds.mid) {
      return {
        text: "🟡 Orta performans",
        className: "text-yellow-600 dark:text-yellow-400",
      };
    }
    if (score <= thresholds.high) {
      return {
        text: "🔵 Yaxşı performans",
        className: "text-blue-600 dark:text-blue-400",
      };
    }
    return {
      text: "🟢 Əla performans",
      className: "text-green-600 dark:text-green-400",
    };
  };

  return (
    <div className="kpi-container">
      <BaseModal
        open={isOpen}
        onOk={handleSave}
        onCancel={handleClose}
        title={modalTitle}
        width={600}
        confirmLoading={loading}
        okText={
          isOwnEvaluation
            ? "Öz Dəyərləndirməni Qeyd Et"
            : "Yekun Dəyərləndirməni Qeyd Et"
        }
      >
        <div className="space-y-6">
  
          {isOwnEvaluation && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center text-orange-700">
                <UserOutlined className="mr-2" />
                <span className="font-medium">Öz Dəyərləndirmə (1-10 şkala)</span>
              </div>
              <p className="text-sm text-orange-600 mt-1">
                Dəyərləndirməni tamamladıqdan sonra departament rəhbərinə məlumat
                e-poçtu göndəriləcək.
              </p>
            </div>
          )}
  
          {!isOwnEvaluation && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center text-green-700">
                <StarOutlined className="mr-2" />
                <span className="font-medium">
                  Yekun Dəyərləndirmə
                </span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Bu dəyərləndirmə yekun dəyərləndirmə olaraq qeydə alınacaq və sistemdə
                görünəcək.
              </p>
            </div>
          )}
  
          {task?.description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center text-blue-800 font-semibold mb-2">
                    <InfoCircleOutlined className="mr-2 text-lg" />
                    <span>Tapşırıq Detalları</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {task.description}
                </p>
            </div>
          )}

          <div className="text-center">
            <ScoreDisplay
              score={starRating}
              maxScore={maxScore}
              type={isOwnEvaluation ? "self" : "superior"}
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
                <span className="text-gray-700 font-medium">Dəyərləndirin:</span>
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
                    {[...Array(10)].map((_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
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
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${starRating}%, #e5e7eb ${starRating}%, #e5e7eb 100%)`,
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
  {(() => {
    const { text, className } = getScoreDescription();
    return (
      <div className={`text-lg font-semibold transition-colors duration-300 ${className}`}>
        {text}
      </div>
    );
  })()}
</div>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <MessageOutlined className="mr-2 text-blue-500" />
              Qeyd:
            </label>
            <TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Qeydlərinizi buraya yaza bilərsiniz..."
              rows={4}
              className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </BaseModal>
    </div>
      
    );
};

export default ReviewModal;