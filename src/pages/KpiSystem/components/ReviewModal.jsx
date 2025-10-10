import { Input } from "antd";
import { 
    MessageOutlined, 
    UserOutlined, 
    StarOutlined,
    InfoCircleOutlined 
} from "@ant-design/icons";
import { useReviewForm } from "../hooks/useReviewForm";
import BaseModal from "./BaseModal";
import ScoreDisplay from "./ScoreDisplay";
import ScoreInput from "./ScoreInputKpi";

const { TextArea } = Input;

const ReviewModal = ({ isOpen, onClose, task, currentUser }) => {
  const {
    starRating,
    setStarRating,
    note,
    setNote,
    loading,
    handleSave,
    isOwnEvaluation,
    maxScore,
    scoreDescription,
    resetModal,
  } = useReviewForm({ isOpen, onClose, task, currentUser });

  const modalTitle = isOwnEvaluation 
    ? `Şəxsi Dəyərləndirmə (1-10) - ${task?.title}` 
    : `Dəyərləndirmə: ${task?.assignee_details?.name || task?.assignee_details} (1-100) - ${task?.title}`;

  const handleClose = () => {
    resetModal();
    onClose(false);
  };
  
  const okText = isOwnEvaluation ? "Öz Dəyərləndirməni Qeyd Et" : "Yekun Dəyərləndirməni Qeyd Et";

  return (
    <BaseModal
      open={isOpen}
      onOk={handleSave}
      onCancel={handleClose}
      title={modalTitle}
      width={600}
      confirmLoading={loading}
      okText={okText}
    >
      <div className="space-y-6">
        {isOwnEvaluation && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center text-orange-700">
              <UserOutlined className="mr-2" />
              <span className="font-medium">Öz Dəyərləndirmə (1-10 şkala)</span>
            </div>
          </div>
        )}
        {!isOwnEvaluation && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center text-green-700">
              <StarOutlined className="mr-2" />
              <span className="font-medium">Yekun Dəyərləndirmə</span>
            </div>
          </div>
        )}
        {task?.description && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center text-blue-800 font-semibold mb-2">
                  <InfoCircleOutlined className="mr-2 text-lg" />
                  <span>Tapşırıq Detalları</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}
        <div className="text-center">
          <ScoreDisplay score={starRating} maxScore={maxScore} type={isOwnEvaluation ? "self" : "superior"} size="large" />
        </div>
        <div>
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="mb-4">
              <StarOutlined className="text-yellow-500 text-xl mr-2" />
              <span className="text-gray-700 font-medium">Qiymətləndirin (1-{maxScore}):</span>
            </div>
            <ScoreInput isSelfEval={isOwnEvaluation} value={starRating} onChange={setStarRating} />
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

export default ReviewModal;