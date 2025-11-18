import { Card, Button, Tag, Tooltip } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { formatDate } from "../../../utils/dateUtils";
import { determineButtonConfig, getButtonStyle } from "../utils/BlockContent.helpers";

const EvaluationTags = ({ evaluationStatus }) => {
  if (!evaluationStatus) return null;
  const { hasSelfEval, hasSuperiorEval, evaluations } = evaluationStatus;

  return (
    <>
      {hasSelfEval && (
        <Tag color="orange" className="text-xs flex items-center">
          <UserOutlined className="mr-1" />
          {evaluations.find(e => e.evaluation_type === "SELF")?.self_score}/10
        </Tag>
      )}
      {hasSuperiorEval && (
        <Tag color="green" className="text-xs flex items-center">
          <TrophyOutlined className="mr-1" />
          Yekun: {evaluations.find(e => e.evaluation_type === "SUPERIOR")?.final_score}/100
        </Tag>
      )}
    </>
  );
};

const BlockContent = ({ task, onReview, evaluationStatus, currentUser, onViewDetails, isPendingForMe }) => {
    
  const buttonConfig = useMemo(() => 
    determineButtonConfig({ task, evaluationStatus, currentUser, isPendingForMe }),
    [task, evaluationStatus, currentUser, isPendingForMe]
  );

  const handleButtonClick = () => {
    if (buttonConfig.isViewOnly) {
      onViewDetails(task);
    } else if (!buttonConfig.disabled) {
      onReview(task);
    }
  };

  const priorityColor = {
      CRITICAL: "red",
      HIGH: "orange",
      MEDIUM: "blue",
  }[task?.priority] || "green";

  const IconComponent = buttonConfig.icon;

  return (
    <Card
      className="h-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 flex flex-col"
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      title={
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-blue-600 flex items-center">
            <UserOutlined className="mr-2" />
            {task?.assignee_details || "-"}
          </span>
         
        </div>
      }
      hoverable
    >
      <div className="space-y-3 flex-grow">
        <div className="flex items-start">
          <ScheduleOutlined className="text-blue-500 mr-2 mt-1" />
          <p className="font-medium text-gray-800 text-sm flex-1">{task?.title}</p>
        </div>
        <div className="flex items-center text-gray-600">
          <CalendarOutlined className="text-green-500 mr-2" />
          <span className="text-xs">
            {formatDate(task?.due_date || task?.created_at)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tag color={priorityColor} className="text-xs">
            {task?.priority_display || task?.priority}
          </Tag>
          <EvaluationTags evaluationStatus={evaluationStatus} />
        </div>
      </div>

      <Tooltip title={buttonConfig.disabled ? buttonConfig.text : ""}>
        <Button
          type={buttonConfig.isViewOnly ? "default" : "primary"}
          block
          size="large"
          icon={IconComponent ? <IconComponent /> : null}
          onClick={handleButtonClick}
          disabled={buttonConfig.disabled}
          className="mt-4 text-xs font-semibold"
          style={getButtonStyle(buttonConfig)}
        >
          {buttonConfig.text}
        </Button>
      </Tooltip>
    </Card>
  );
};

export default BlockContent;