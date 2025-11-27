// kpi-system-frontend\src\pages\KpiSystem\components\SingleEvaluationCard.jsx

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
  superior: { // Üst Rəhbər (Artıq yeganə yekun deyil)
    title: "Üst Rəhbər Dəyərləndirməsi", // Başlığı dəqiqləşdirin
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

    // YENİLƏNMİŞ MƏNTİQ: Balı düzgün sahədən oxu
    if (type === 'self') {
        score = evaluation.self_score;
    } else if (type === 'superior') {
        score = evaluation.superior_score; // İndi Superior üçün öz bal sahəsi var
    } else if (type === 'TOP_MANAGEMENT') {
        // TM qiymətləndirməsində final_score (və ya top_management_score) istifadə olunur
        score = evaluation.top_management_score || evaluation.final_score; 
        
        // Front-end-də tipi "top" kimi ötürülə bilər, amma buradakı 'type' propu API-dən gələn 'evaluation_type' ilə uyğunlaşdırılmalıdır (TOP_MANAGEMENT)
        // Lakin cardConfig-də 'top' istifadə etdiyiniz üçün onu düzəldirik
        if (config.title === "Naməlum Dəyərləndirmə") {
            // Əgər API-dən gələn 'type' "TOP_MANAGEMENT" idisə və 'type' propu "top" kimi gəlməyibsə, onu düzəldək.
            // Ən yaxşısı EvaluationDetailsModal-da 'type' propunu "top" olaraq göndərməkdir. 
            // Burada sadəcə konfiqurasiya key-ni düzgün tapmaq üçün yoxlamaq olar:
            if (type === 'TOP_MANAGEMENT') {
                score = evaluation.top_management_score || evaluation.final_score;
            }
        }
    } else {
        score = evaluation.final_score; 
    }
    
    const maxScore = type === 'self' ? 10 : 100;
    
    // Yuxarıdakı config məntiqindəki xətanın qarşısını almaq üçün 'type' propunu 'top' ilə yoxlamaq daha əlverişlidir:
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

        {/* Superior və Top Management üçün dəyərləndirəni göstər */}
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
        {/* Qalan hissə eynidir */}
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