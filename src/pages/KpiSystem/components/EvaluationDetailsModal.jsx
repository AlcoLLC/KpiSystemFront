import { Button, Tag, Tooltip, Card, Descriptions, Empty } from "antd";
import {
  UserOutlined,
  EditOutlined,
  HistoryOutlined,
  StarOutlined,
} from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import BaseModal from "./BaseModal";
import ScoreDisplay from "./ScoreDisplay";
import { formatDate } from './../../../utils/dateUtils';

const EvaluationDetailsModal = ({ open, onClose, task, evaluations, onEdit }) => {
  const { user: currentUser } = useAuth();


  if (!task) return null;

  const selfEvaluation = evaluations.find((e) => e.evaluation_type === "SELF");
  const superiorEvaluation = evaluations.find((e) => e.evaluation_type === "SUPERIOR");

  const canEditSelf = selfEvaluation && currentUser?.id === selfEvaluation.evaluator?.id && !superiorEvaluation;
  const canEditSuperior = superiorEvaluation && currentUser?.id === superiorEvaluation.evaluator?.id;

  const renderHistory = (evaluation) => {
    if (!evaluation?.history || evaluation.history.length === 0) return null;

    return (
      <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <h5 className="font-semibold text-slate-700 mb-2 flex items-center text-sm">
          <HistoryOutlined className="mr-2" /> Dəyişiklik Tarixçəsi
        </h5>
        <ul className="space-y-1.5 list-disc list-inside">
          {evaluation.history.map((entry, index) => (
            <li key={index} className="text-xs text-slate-600">
              <span className="font-medium">{formatDate(entry.timestamp)}</span> - 
              <span className="text-blue-600 font-medium mx-1">{entry.updated_by_name}</span> tərəfindən,
              bal dəyişdirildi: <Tag color="red">{entry.previous_score}</Tag> → <Tag color="green">{entry.new_score}</Tag>.
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const priorityColors = {
    CRITICAL: "red",
    HIGH: "orange",
    MEDIUM: "blue",
    LOW: "green",
  };

  return (
    <div className="kpi-container">
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
        <Card size="small">
          <Descriptions title="Tapşırıq Məlumatları" bordered column={1} size="small">
            <Descriptions.Item label="Başlıq">{task.title}</Descriptions.Item>
            {task.description && (
              <Descriptions.Item label="Tapşırıq detalları">
                <div className="whitespace-pre-wrap">{task.description}</div>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="İşçi">{task.assignee_details}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color="blue">{task.status_display}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Prioritet">
              <Tag color={priorityColors[task.priority] || "default"}>
                {task.priority_display}
              </Tag>
            </Descriptions.Item>
            {task.due_date && (
              <Descriptions.Item label="Son Tarix">
                {formatDate(task.due_date)}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {selfEvaluation && (
        <Card
          size="small"
          title={
            <span className="flex items-center text-slate-700 font-semibold">
              <UserOutlined className="mr-2" /> Şəxsi Dəyərləndirmə
            </span>
          }
          extra={
            canEditSelf && (
              <Tooltip title="Dəyərləndirməni redaktə et">
                <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(selfEvaluation)} />
              </Tooltip>
            )
          }
        >
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Bal">
              <ScoreDisplay score={selfEvaluation.self_score} maxScore={10} type="self" />
            </Descriptions.Item>

            {selfEvaluation.comment && (
               <Descriptions.Item label="Şərh">
                 <blockquote className="italic text-slate-600 m-0 p-0">
                   "{selfEvaluation.comment}"
                 </blockquote>
              </Descriptions.Item>
            )}

            <Descriptions.Item label="Tarix">
                {formatDate(selfEvaluation.created_at)}
            </Descriptions.Item>
          </Descriptions>
          {renderHistory(selfEvaluation)}
        </Card>
      )}

      {superiorEvaluation && (
         <Card
          size="small"
          title={
            <span className="flex items-center text-blue-600 font-semibold">
              <StarOutlined className="mr-2" /> Yekun Dəyərləndirmə
            </span>
          }
          extra={
            canEditSuperior && (
              <Tooltip title="Yekun dəyərləndirməni redaktə et">
                <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(superiorEvaluation)} />
              </Tooltip>
            )
          }
        >
          <Descriptions bordered size="small" column={1}>
             <Descriptions.Item label="Yekun Bal">
              <ScoreDisplay score={superiorEvaluation.final_score} maxScore={100} type="superior" />
            </Descriptions.Item>

            <Descriptions.Item label="Dəyərləndirən">
                {superiorEvaluation.evaluator?.full_name || superiorEvaluation.evaluator?.username}
            </Descriptions.Item>

            {superiorEvaluation.comment && (
               <Descriptions.Item label="Şərh">
                 <blockquote className="italic text-slate-600 m-0 p-0">
                  "{superiorEvaluation.comment}"
                 </blockquote>
              </Descriptions.Item>
            )}
           
             <Descriptions.Item label="Tarix">
               {formatDate(superiorEvaluation.created_at)}
            </Descriptions.Item>
          </Descriptions>
          {renderHistory(superiorEvaluation)}
        </Card>
      )}

        {!selfEvaluation && !superiorEvaluation && (
          <div className="py-4"> 
            <Empty description="Bu tapşırıq üçün hələ heç bir dəyərləndirmə edilməyib." />
          </div>
        )}
      </div>
    </BaseModal>
    </div>
   
  );
};

export default EvaluationDetailsModal;