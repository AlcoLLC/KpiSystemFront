import { useState, useEffect, useMemo } from "react";
import { message } from "antd";
import kpiAPI from "../../../api/kpiApi";

export const useEditReview = ({ isOpen, onClose, evaluation }) => {
  const [starRating, setStarRating] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const isSelfEval = evaluation?.evaluation_type === "SELF";
  const maxScore = isSelfEval ? 10 : 100;

  useEffect(() => {
    if (isOpen && evaluation) {
      const currentScore = isSelfEval ? evaluation.self_score : evaluation.superior_score;
      setStarRating(currentScore || (isSelfEval ? 5 : 50));
      setNote(evaluation.comment || "");
    }
  }, [isOpen, evaluation, isSelfEval]);

  const handleSave = async () => {
    if (!evaluation) return;
    setLoading(true);

    try {
      const payload = { score: starRating, comment: note.trim() || null };
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
    loading,
    handleSave,
    isSelfEval,
    maxScore,
    scoreDescription,
  };
};