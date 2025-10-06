import { useState, useEffect } from "react";
import { Input, Rate, message } from "antd";
import { MessageOutlined, StarOutlined } from "@ant-design/icons";
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

  const modalTitle = isSelfEval
    ? `Şəxsi Dəyərləndirməni Redaktə Et: ${evaluation?.task?.title || ""}`
    : `Yekun Dəyərləndirməni Redaktə Et: ${evaluation?.task?.title || ""}`;

  useEffect(() => {
    if (isOpen && evaluation) {
      const currentScore = isSelfEval
        ? evaluation.self_score
        : evaluation.superior_score;
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
      const errorMessage =
        error.response?.data?.detail || "Dəyərləndirməni yeniləmək mümkün olmadı.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => onClose(false);

  const getScoreDescription = () => {
    const score = starRating;
    const thresholds = isSelfEval
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
      okText="Dəyişiklikləri Yadda Saxla"
    >
      <div className="space-y-6">
        <div className="text-center">
          <ScoreDisplay
            score={starRating}
            maxScore={maxScore}
            type={isSelfEval ? "self" : "superior"}
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
              <span className="text-gray-700 font-medium">Qiymətləndirin: </span>
            </div>

            {isSelfEval ? (
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

export default EditReviewModal;