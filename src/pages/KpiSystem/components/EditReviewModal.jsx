import { useState, useEffect } from "react";
import { Input, Rate, message } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import kpiAPI from "../../../api/kpiApi";
import BaseModal from "./BaseModal";
import ScoreDisplay from "./ScoreDisplay";

const { TextArea } = Input;

const EditReviewModal = ({ isOpen, onClose, evaluation }) => {
  const [starRating, setStarRating] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const isSelfEval = evaluation?.evaluation_type === "SELF";
  const maxScore = isSelfEval ? 10 : 100;
  const modalTitle = `Edit Evaluation - ${evaluation?.task?.title || ''}`;

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
      message.success("Evaluation updated successfully!");
      onClose(true); 
    } catch (error) {
      console.error("Failed to update evaluation:", error);
      const errorMessage = error.response?.data?.detail || "Failed to update evaluation.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => onClose(false);

  return (
      <BaseModal open={isOpen} onOk={handleSave} onCancel={handleClose} title={modalTitle} width={600} confirmLoading={loading} okText="Dəyişiklikləri Yadda Saxla">
        <div className="space-y-6">
          <div className="text-center">
            <ScoreDisplay score={starRating} maxScore={maxScore} type={isSelfEval ? "self" : "superior"} size="large" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Qiymətləndirmə (1-{maxScore} arası):</label>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border-2 border-dashed mt-2">
              {isSelfEval ? (
                <Rate count={10} value={starRating} onChange={setStarRating} style={{ fontSize: "32px" }} />
              ) : (
                <div className="w-full max-w-lg">
                  <input type="range" min="1" max="100" value={starRating} onChange={(e) => setStarRating(parseInt(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${starRating}%, #e5e7eb ${starRating}%, #e5e7eb 100%)` }} />
                  <div className="flex justify-between text-xs text-gray-400 mt-3"><span>1</span><span>100</span></div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <MessageOutlined className="mr-2 text-blue-500" /> Qeyd (Comment):
            </label>
            <TextArea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Qeydlərinizi buraya yazın..." rows={4} />
          </div>
        </div>
      </BaseModal>
    );
};

export default EditReviewModal;