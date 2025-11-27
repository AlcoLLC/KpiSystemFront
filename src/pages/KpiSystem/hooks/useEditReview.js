import { useState, useEffect, useMemo } from "react";
import { message } from "antd";
import kpiAPI from "../../../api/kpiApi";

export const useEditReview = ({ isOpen, onClose, evaluation }) => {
  const [starRating, setStarRating] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const isSelfEval = evaluation?.evaluation_type === "SELF";
  const isTopEval = evaluation?.evaluation_type === "TOP_MANAGEMENT"; // YENİ
  const maxScore = isSelfEval ? 10 : 100;

  useEffect(() => {
    if (isOpen && evaluation) {
      let currentScore;
        if (isSelfEval) {
            currentScore = evaluation.self_score;
        } else if (isTopEval) {
            currentScore = evaluation.top_management_score; 
        } else {
            currentScore = evaluation.superior_score;
        }

      setStarRating(currentScore || (isSelfEval ? 5 : 50));
      setNote(evaluation.comment || "");
      if (evaluation.attachment) {
        setFileList([{
          uid: '-1',
          name: evaluation.attachment.split('/').pop(),
          status: 'done',
          url: evaluation.attachment,
        }]);
      } else {
        setFileList([]);
      }
    }
  }, [isOpen, evaluation, isSelfEval, isTopEval]);

  const handleSave = async () => {
    if (!evaluation) return;
    setLoading(true);

    try {
      const payload = { score: starRating, comment: note.trim() || null };
      if (fileList.length > 0 && fileList[0].originFileObj) {
        payload.attachment = fileList[0].originFileObj;
      } 
      else if (fileList.length === 0 && evaluation.attachment) {
        payload.attachment = null;
      }

      await kpiAPI.updateEvaluation(evaluation.id, payload);
      message.success("Dəyərləndirmə uğurla yeniləndi!");
      onClose(true);
    } catch (error) {
      console.error("Failed to update evaluation:", error);
      const errorMessage = error.response?.data?.detail || "Dəyərləndirməni yeniləmək mümkün olmadı.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const scoreDescription = useMemo(() => {
    const thresholds = isSelfEval
      ? { low: 3, mid: 6, high: 8 }
      : { low: 30, mid: 60, high: 80 };

    if (starRating <= thresholds.low) return { text: "🔴 Performans yaxşılaşdırılmalıdır", className: "text-red-600" };
    if (starRating <= thresholds.mid) return { text: "🟡 Orta performans", className: "text-yellow-600" };
    if (starRating <= thresholds.high) return { text: "🔵 Yaxşı performans", className: "text-blue-600" };
    return { text: "🟢 Əla performans", className: "text-green-600" };
  }, [starRating, isSelfEval]);

  return {
    starRating,
    setStarRating,
    note,
    setNote,
    fileList,
    setFileList,
    loading,
    handleSave,
    isSelfEval,
    isTopEval,
    maxScore,
    scoreDescription,
  };
};