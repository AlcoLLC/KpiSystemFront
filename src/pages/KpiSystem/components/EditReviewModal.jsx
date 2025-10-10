import { Input } from "antd";
import { MessageOutlined, StarOutlined } from "@ant-design/icons";
import { useEditReview } from "../hooks/useEditReview";
import BaseModal from "./BaseModal";
import ScoreDisplay from "./ScoreDisplay";
import ScoreInput from "./ScoreInputKpi";

const { TextArea } = Input;

const EditReviewModal = ({ isOpen, onClose, evaluation }) => {
  const {
    starRating,
    setStarRating,
    note,
    setNote,
    loading,
    handleSave,
    isSelfEval,
    maxScore,
    scoreDescription,
  } = useEditReview({ isOpen, onClose, evaluation });

  const modalTitle = `${isSelfEval ? "Şəxsi" : "Yekun"} Dəyərləndirməni Redaktə Et: ${evaluation?.task?.title || ""}`;

  return (
    <BaseModal
      open={isOpen}
      onOk={handleSave}
      onCancel={() => onClose(false)}
      title={modalTitle}
      width={600}
      confirmLoading={loading}
      okText="Dəyişiklikləri Yadda Saxla"
    >
      <div className="space-y-6">
        <div className="text-center">
          <ScoreDisplay score={starRating} maxScore={maxScore} type={isSelfEval ? "self" : "superior"} size="large" />
        </div>

        <div>
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="mb-4">
              <StarOutlined className="text-yellow-500 text-xl mr-2" />
              <span className="text-gray-700 font-medium">Qiymətləndirin (1-{maxScore}):</span>
            </div>
            <ScoreInput isSelfEval={isSelfEval} value={starRating} onChange={setStarRating} />
          </div>
          <div className="mt-4 text-center">
            <div className={`text-lg font-semibold transition-colors duration-300 ${scoreDescription.className}`}>
              {scoreDescription.text}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <MessageOutlined className="mr-2 text-blue-500" /> Qeyd:
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
  );
};

export default EditReviewModal;