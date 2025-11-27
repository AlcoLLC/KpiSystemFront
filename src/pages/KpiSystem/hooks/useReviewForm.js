import { useState, useEffect, useMemo, useCallback } from "react"; 
import { message } from "antd";
import kpiAPI from "../../../api/kpiApi";

export const useReviewForm = ({ isOpen, onClose, task, currentUser }) => {
  const [starRating, setStarRating] = useState(5);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const isOwnEvaluation = currentUser?.id === task?.assignee;
  const isTopManager = currentUser?.role === 'top_management';
  const maxScore = isOwnEvaluation ? 10 : 100;

  const resetModal = () => {
    setStarRating(isOwnEvaluation ? 5 : 50); 
    setNote("");
    setFileList([]);
  };

  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen, isOwnEvaluation]); 

  const handleSave = useCallback(async () => {
    if (loading) return;
    
    if (!task) return;
    setLoading(true);

    try {
      const evaluationData = {
        task_id: task.id,
        evaluatee_id: task.assignee,
        score: starRating,
        comment: note.trim() || null,
        attachment: fileList.length > 0 ? fileList[0].originFileObj : null,
      };

      if (isTopManager) {
           evaluationData.evaluation_type = "TOP_MANAGEMENT";
      } else if (!isOwnEvaluation) {
           evaluationData.evaluation_type = "SUPERIOR";
      }

      await kpiAPI.createEvaluation(evaluationData);
      message.success(
        isOwnEvaluation
          ? "Dəyərləndirməniz qeydə alındı! Rəhbərinizə bildiriş göndərildi."
          : "Yekun dəyərləndirmə uğurla qeydə alındı!"
      );
      onClose(true); 
    } catch (error) {
      console.error("Failed to save evaluation:", error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || Object.values(error.response?.data || {})[0] || "Dəyərləndirməni yadda saxlamaq mümkün olmadı.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loading, task, starRating, note, fileList, isOwnEvaluation, isTopManager, onClose]); 

  const scoreDescription = useMemo(() => {
    const thresholds = isOwnEvaluation
      ? { low: 3, mid: 6, high: 8 }
      : { low: 30, mid: 60, high: 80 };

    if (starRating <= thresholds.low) return { text: "🔴 Performans yaxşılaşdırılmalıdır", className: "text-red-600" };
    if (starRating <= thresholds.mid) return { text: "🟡 Orta performans", className: "text-yellow-600" };
    if (starRating <= thresholds.high) return { text: "🔵 Yaxşı performans", className: "text-blue-600" };
    return { text: "🟢 Əla performans", className: "text-green-600" };
  }, [starRating, isOwnEvaluation]);

  return {
    starRating,
    setStarRating,
    note,
    fileList,
    setFileList,
    setNote,
    loading,
    handleSave,
    isOwnEvaluation,
    maxScore,
    scoreDescription,
    resetModal,
  };
};