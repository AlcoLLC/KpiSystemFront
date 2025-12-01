// kpi-system-frontend\src\pages\KpiSystem\hooks\useReviewForm.js

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
  const isAdmin = currentUser?.role === 'admin';
  
  // Max skor: Öz dəyərləndirməsi üçün 10, başqaları üçün 100
  const maxScore = isOwnEvaluation ? 10 : 100;

    // Dəyərləndirmə Konfiqurasiyasını çəkmək
    const evalConfig = task?.assignee_obj?.evaluation_config;
    
    // Yuxarı İdarəetmə Dəyərləndirməsi gözlənilirmi?
    const isTMEvaluationPending = useMemo(() => {
        // Dual evaluation tələb olunmursa, yox
        if (!evalConfig || !evalConfig.is_dual_evaluation) return false;

        // Cari istifadəçi TM evaluatorudursa
        const isCurrentUserTMEvaluator = evalConfig.tm_evaluator_id === currentUser.id;

        // Tələb olunan: Self və Superior tamamlanıb, TM hələ yox
        const hasTopEval = task?.evaluation_status?.hasTopEval;
        const hasSuperiorEval = task?.evaluation_status?.hasSuperiorEval;
        
        // Cari istifadəçi TM evaluatorudursa VƏ Superior tamamlanıbsa VƏ TM hələ edilməyibsə
        return isCurrentUserTMEvaluator && hasSuperiorEval && !hasTopEval;
    }, [evalConfig, currentUser?.id, task?.evaluation_status]);


  const resetModal = useCallback(() => {
    setStarRating(isOwnEvaluation ? 5 : 50); 
    setNote("");
    setFileList([]);
  }, [isOwnEvaluation]);

  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen, resetModal]); 

  const handleSave = useCallback(async () => {
    if (loading) return;
    
    if (!task) {
      message.error("Task məlumatı tapılmadı");
      return;
    }
    
    setLoading(true);

    try {
        let evaluationType = '';

        const evaluationData = {
            task_id: task.id,
            evaluatee_id: task.assignee,
            score: starRating,
            comment: note.trim() || null,
        };

      // File attachment varsa əlavə et
      if (fileList.length > 0 && fileList[0].originFileObj) {
        evaluationData.attachment = fileList[0].originFileObj;
      }

      // Evaluation type-ı təyin et
      if (isOwnEvaluation) {
        evaluationType = "SELF";
      } else {
        // evalConfig yuxarıda hook-un scope-unda təyin edilib
        if (isAdmin) {
          // Admin özü seçə bilər, amma default olaraq SUPERIOR göndər
          evaluationType = "SUPERIOR";
        } else if (isTopManager && evalConfig) {
          // Top Management-in hansı rol ilə dəyərləndirdiyini təyin et
          if (evalConfig.tm_evaluator_id === currentUser.id) {
            evaluationType = "TOP_MANAGEMENT";
          } else if (evalConfig.superior_evaluator_id === currentUser.id) {
            evaluationType = "SUPERIOR";
          } else {
            message.error("Bu tapşırığı dəyərləndirməyə icazəniz yoxdur.");
            setLoading(false);
            return;
          }
        } else {
          // Digər rollarda SUPERIOR
          evaluationType = "SUPERIOR";
        }
      }

      evaluationData.evaluation_type = evaluationType;

      await kpiAPI.createEvaluation(evaluationData);
      
      // Uğur mesajı
      let successMessage = "Dəyərləndirmə uğurla qeydə alındı!";
      if (isOwnEvaluation) {
        successMessage = "Öz dəyərləndirməniz qeydə alındı! Rəhbərinizə bildiriş göndərildi.";
      } else if (evaluationType === "TOP_MANAGEMENT") {
        successMessage = "Yuxarı İdarəetmə dəyərləndirməsi (yekun) qeydə alındı!";
      } else {
        successMessage = "Üst rəhbər dəyərləndirməsi qeydə alındı!";
      }
      
      message.success(successMessage);
      onClose(true); // Modal-ı bağla və data yenilə
    } catch (error) {
      console.error("Failed to save evaluation:", error);
      
      // Error mesajını göstər
      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.non_field_errors?.[0] || 
        Object.values(error.response?.data || {})[0] || 
        "Dəyərləndirməni yadda saxlamaq mümkün olmadı.";
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loading, task, starRating, note, fileList, isOwnEvaluation, isTopManager, isAdmin, currentUser, onClose, evalConfig]); 

  // Skor təsviri (rəngli feedback)
  const scoreDescription = useMemo(() => {
    const thresholds = isOwnEvaluation
      ? { low: 3, mid: 6, high: 8 }
      : { low: 30, mid: 60, high: 80 };

    if (starRating <= thresholds.low) {
      return { 
        text: "🔴 Performans yaxşılaşdırılmalıdır", 
        className: "text-red-600" 
      };
    }
    if (starRating <= thresholds.mid) {
      return { 
        text: "🟡 Orta performans", 
        className: "text-yellow-600" 
      };
    }
    if (starRating <= thresholds.high) {
      return { 
        text: "🔵 Yaxşı performans", 
        className: "text-blue-600" 
      };
    }
    return { 
      text: "🟢 Əla performans", 
      className: "text-green-600" 
    };
  }, [starRating, isOwnEvaluation]);

const isCurrentUserTMEvaluator = useMemo(() => {
    return evalConfig?.tm_evaluator_id === currentUser?.id;
}, [evalConfig, currentUser?.id]);

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
    isTMEvaluationPending,
    isCurrentUserTMEvaluator
  };
};