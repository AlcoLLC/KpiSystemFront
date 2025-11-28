import { Empty } from "antd";
import useAuth from "../../../hooks/useAuth";
import BaseModal from "./BaseModal";
import TaskDetailsCard from "./TaskDetailsCard";
import SingleEvaluationCard from "./SingleEvaluationCard";

const EvaluationDetailsModal = ({ open, onClose, task, evaluations, onEdit }) => {
  const { user: currentUser } = useAuth();

  if (!task) return null;

  const selfEvaluation = evaluations.find((e) => e.evaluation_type === "SELF");
  const superiorEvaluation = evaluations.find((e) => e.evaluation_type === "SUPERIOR");
  const topEvaluation = evaluations.find((e) => e.evaluation_type === "TOP_MANAGEMENT");
  const isAdmin = currentUser?.role === 'admin';
  
  const canEditSelf = selfEvaluation && (
    (currentUser?.id === selfEvaluation.evaluator?.id && !topEvaluation) || 
    isAdmin
  );

  const canEditSuperior = superiorEvaluation && (
    (currentUser?.id === superiorEvaluation.evaluator?.id && !topEvaluation) || 
    isAdmin
  );
  
  const canEditTop = topEvaluation && (
    (currentUser?.id === topEvaluation.evaluator?.id) ||
    isAdmin
  );

  return (
    <BaseModal
      open={open}
      onCancel={onClose}
      title={`Dəyərləndirmə Detalları: ${task.title}`}
      width={700}
      onOk={onClose}
      okText="Bağla"
      showCancelButton={false}
    >
      <div className="space-y-4">
        <TaskDetailsCard task={task} />

        {selfEvaluation && (
          <SingleEvaluationCard
            evaluation={selfEvaluation}
            type="self"
            canEdit={canEditSelf}
            onEdit={onEdit}
          />
        )}

        {superiorEvaluation && (
          <SingleEvaluationCard
            evaluation={superiorEvaluation}
            type="superior"
            canEdit={canEditSuperior}
            onEdit={onEdit}
          />
        )}

        {topEvaluation && (
          <SingleEvaluationCard
            evaluation={topEvaluation}
            type="TOP_MANAGEMENT"
            canEdit={canEditTop}
            onEdit={onEdit}
          />
        )}

        {!selfEvaluation && !superiorEvaluation && !topEvaluation && (
          <div className="py-4">
            <Empty description="Bu tapşırıq üçün hələ heç bir dəyərləndirmə edilməyib." />
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default EvaluationDetailsModal;