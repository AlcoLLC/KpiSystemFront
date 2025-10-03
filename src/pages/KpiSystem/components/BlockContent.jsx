import { Card, Button, Tag, Tooltip, Badge } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  StarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  TrophyOutlined,
  FireOutlined,
  ScheduleOutlined
} from "@ant-design/icons";
import { formatDate } from "../../../utils/dateUtils";

const BlockContent = ({
  task,
  onReview,
  evaluationStatus,
  currentUser,
  onViewDetails,
  isPendingForMe,
}) => {
  const getButtonConfig = () => {
    const { hasSelfEval, hasSuperiorEval } = evaluationStatus;

    if (hasSelfEval && hasSuperiorEval) {
      return {
        text: "View Evaluation Details",
        icon: <EyeOutlined />,
        isViewOnly: true,
      };
    }
    if (isPendingForMe) {
      return {
        text: `Evaluate ${task.assignee_details} (1-100)`,
        color: "blue",
        disabled: false,
        icon: <FireOutlined />,
      };
    }
    if (currentUser?.id === task?.assignee && !hasSelfEval) {
      return {
        text: "Self-Evaluate (1-10)",
        color: "orange",
        disabled: false,
        icon: <StarOutlined />,
      };
    }
    if (currentUser?.id === task?.assignee && hasSelfEval) {
      return {
        text: "Awaiting Manager's Review",
        color: "gray",
        disabled: true,
        icon: <ClockCircleOutlined />,
      };
    }
    return {
      text: "Evaluation Pending",
      color: "gray",
      disabled: true,
      icon: <ClockCircleOutlined />,
    };
  };

  const buttonConfig = getButtonConfig();

  const getStatusTags = () => {
    if (!evaluationStatus) return null;
    const { hasSelfEval, hasSuperiorEval, evaluations } = evaluationStatus;
    const tags = [];
    if (hasSelfEval) {
      const selfEval = evaluations.find((e) => e.evaluation_type === "SELF");
      tags.push(
        <Tag key="self" color="orange" className="text-xs flex items-center">
          <UserOutlined className="mr-1" /> {selfEval?.self_score}/10
        </Tag>
      );
    }
    if (hasSuperiorEval) {
      const superiorEval = evaluations.find(
        (e) => e.evaluation_type === "SUPERIOR"
      );
      tags.push(
        <Tag key="superior" color="green" className="text-xs flex items-center">
          <TrophyOutlined className="mr-1" /> Final: {superiorEval?.final_score}
          /100
        </Tag>
      );
    }
    return tags;
  };

  const handleButtonClick = () => {
    if (buttonConfig.isViewOnly) {
      onViewDetails(task);
    } else if (!buttonConfig.disabled) {
      onReview(task);
    }
  };

  return (
    <Card
      className="h-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-600">
            <UserOutlined className="mr-2" />
            <span className="font-bold text-sm">
              {task?.assignee_details || "N/A"}
            </span>
          </div>
          <Badge
            count={task?.priority === "CRITICAL" ? "CRITICAL" : ""}
            style={{ backgroundColor: "#ff4d4f" }}
          />
        </div>
      }
      hoverable
    >
      <div className="space-y-3">
        <div className="flex items-start">
          <ScheduleOutlined className="text-blue-500 mr-2 mt-1" />
          <div className="flex-1">
            <div className="font-medium text-gray-800 text-sm">
              {task?.title}
            </div>
          </div>
        </div>
        <div className="flex items-center text-gray-600">
          <CalendarOutlined className="text-green-500 mr-2" />
          <span className="text-xs">
            {task?.due_date
              ? formatDate(task.due_date)
              : formatDate(task?.created_at)
            }
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tag
            color={
              task?.priority === "CRITICAL"
                ? "red"
                : task?.priority === "HIGH"
                ? "orange"
                : task?.priority === "MEDIUM"
                ? "blue"
                : "green"
            }
            className="text-xs"
          >
            {task?.priority_display || task?.priority}
          </Tag>
          {getStatusTags()}
        </div>
        <Tooltip title={buttonConfig.disabled ? buttonConfig.text : ""}>
          <Button
            type={buttonConfig.isViewOnly ? "default" : "primary"}
            block
            size="large"
            icon={buttonConfig.icon}
            onClick={handleButtonClick}
            disabled={buttonConfig.disabled}
            className={`mt-4 hover:opacity-80 text-xs font-semibold transform transition-all duration-200 ${
              !buttonConfig.disabled && !buttonConfig.isViewOnly
                ? "hover:scale-105 shadow-lg"
                : ""
            }`}
            style={{
              backgroundColor:
                buttonConfig.disabled && !buttonConfig.isViewOnly
                  ? "#d1d5db"
                  : buttonConfig.color === "green"
                  ? "#10B981"
                  : buttonConfig.color === "orange"
                  ? "#F59E0B"
                  : buttonConfig.color === "purple"
                  ? "#8B5CF6"
                  : buttonConfig.color === "gray"
                  ? "#9CA3AF"
                  : "#3B82F6",
              borderColor:
                buttonConfig.disabled && !buttonConfig.isViewOnly
                  ? "#d1d5db"
                  : buttonConfig.color === "green"
                  ? "#10B981"
                  : buttonConfig.color === "orange"
                  ? "#F59E0B"
                  : buttonConfig.color === "purple"
                  ? "#8B5CF6"
                  : buttonConfig.color === "gray"
                  ? "#9CA3AF"
                  : "#3B82F6",
              color: "white",
            }}
          >
            {buttonConfig.text}
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

export default BlockContent;
