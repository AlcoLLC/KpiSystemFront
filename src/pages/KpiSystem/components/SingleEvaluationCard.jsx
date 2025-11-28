import { Card, Descriptions, Button, Tooltip, Tag } from "antd";
import { UserOutlined, StarOutlined, EditOutlined, PaperClipOutlined, CrownOutlined  } from "@ant-design/icons";
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
    title: "Üst Rəhbər Dəyərləndirməsi",
    icon: <StarOutlined />,
    titleClass: "text-blue-600",
  },
  TOP_MANAGEMENT: { 
    title: "Yuxarı İdarəetmə Dəyərləndirməsi (Yekun)",
    icon: <CrownOutlined />,
    titleClass: "text-purple-600",
  },
};

const SingleEvaluationCard = ({ evaluation, type, canEdit, onEdit }) => {
    const config = cardConfig[type] || { title: "Naməlum Dəyərləndirmə", icon: null, titleClass: "text-gray-500" };
    
    let score;

    if (type === 'self') {
        score = evaluation.self_score;
    } else if (type === 'superior') {
        score = evaluation.superior_score;
    } else if (type === 'TOP_MANAGEMENT') {
        score = evaluation.top_management_score || evaluation.final_score; 
        
        if (config.title === "Naməlum Dəyərləndirmə") {
            if (type === 'TOP_MANAGEMENT') {
                score = evaluation.top_management_score || evaluation.final_score;
            }
        }
    } else {
        score = evaluation.final_score; 
    }
    
    const maxScore = type === 'self' ? 10 : 100;
    
    const displayConfig = cardConfig[type === 'TOP_MANAGEMENT' ? 'top' : type] || config;

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

        {(type === 'superior' || type === 'top') && (
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
        {evaluation.attachment && (
          <Descriptions.Item label="Əlavə">
            <a href={evaluation.attachment} target="_blank" rel="noopener noreferrer">
              <Tag icon={<PaperClipOutlined />} color="blue">
                Əlavə edilmiş fayl
              </Tag>
            </a>
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