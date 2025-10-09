import { Card, Descriptions, Button, Tooltip } from "antd";
import { UserOutlined, StarOutlined, EditOutlined } from "@ant-design/icons";
import ScoreDisplay from "./ScoreDisplay";
import EvaluationHistory from "./EvaluationHistory";
import { formatDate } from './../../../utils/dateUtils';

const cardConfig = {
  self: {
    title: "Şəxsi Dəyərləndirmə",
    icon: <UserOutlined />,
    titleClass: "text-slate-700",
  },
  superior: {
    title: "Yekun Dəyərləndirmə",
    icon: <StarOutlined />,
    titleClass: "text-blue-600",
  },
};

const SingleEvaluationCard = ({ evaluation, type, canEdit, onEdit }) => {
  const config = cardConfig[type];
  const score = type === 'self' ? evaluation.self_score : evaluation.final_score;
  const maxScore = type === 'self' ? 10 : 100;

  return (
    <Card
      size="small"
      title={
        <span className={`flex items-center ${config.titleClass} font-semibold`}>
          {config.icon} <span className="ml-2">{config.title}</span>
        </span>
      }
      extra={
        canEdit && (
          <Tooltip title="Redaktə et">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(evaluation)} />
          </Tooltip>
        )
      }
    >
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Bal">
          <ScoreDisplay score={score} maxScore={maxScore} type={type} />
        </Descriptions.Item>

        {type === 'superior' && (
           <Descriptions.Item label="Dəyərləndirən">
             {evaluation.evaluator?.full_name || evaluation.evaluator?.username}
           </Descriptions.Item>
        )}

        {evaluation.comment && (
          <Descriptions.Item label="Şərh">
            <blockquote className="italic text-slate-600 m-0 p-0">
              "{evaluation.comment}"
            </blockquote>
          </Descriptions.Item>
        )}
        
        <Descriptions.Item label="Tarix">
          {formatDate(evaluation.created_at)}
        </Descriptions.Item>
      </Descriptions>
      <EvaluationHistory history={evaluation.history} />
    </Card>
  );
};

export default SingleEvaluationCard;