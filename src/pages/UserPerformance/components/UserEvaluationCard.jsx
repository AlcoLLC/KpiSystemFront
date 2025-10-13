import { Button, Tag, Avatar } from "antd";
import {
  EditOutlined,
  BarChartOutlined,
  UserOutlined,
  StarFilled,
  EyeOutlined,
} from "@ant-design/icons";

const UserEvaluationCard = ({ user, onEvaluateClick, onSummaryClick }) => {
  const evaluationData = user.selected_month_evaluation;
  const isEvaluated = !!evaluationData;
  const fullName = `${user.first_name} ${user.last_name}`;

  const canDirectlyEvaluate = user.can_evaluate;

  const getButtonProps = () => {
    if (!isEvaluated) {
      return { text: "Qiymətləndir", icon: <EditOutlined /> };
    }
    if (canDirectlyEvaluate) {
      return { text: "Bax / Redaktə Et", icon: <EditOutlined /> };
    }
    return { text: "Bax", icon: <EyeOutlined /> };
  };

  const { text: evaluateButtonText, icon: evaluateButtonIcon } =
    getButtonProps();

  return (
    <div
      className={`
        user-kpi-system-card bg-white rounded-xl shadow-lg p-5 transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
        flex flex-col
        ${isEvaluated ? "bg-gray-50" : ""}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <Avatar
            size={64}
            src={user.profile_photo}
            icon={<UserOutlined />}
            className="border-2 border-gray-200"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-800">{fullName}</h3>
            <p className="text-sm font-medium text-gray-600">
              {user.position_name || "Vəzifə Təyin Edilməyib"}
            </p>
            <p className="text-xs text-gray-500 mt-1">{user.role_display}</p>
          </div>
        </div>
        {isEvaluated && (
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
            <StarFilled />
            <span>{evaluationData.score} / 10</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-5">
        <Tag color="blue">
          {user.department_name || "Departament Təyin Edilməyib"}
        </Tag>
        {isEvaluated ? (
          <Tag color="green">Dəyərləndirilib</Tag>
        ) : (
          <Tag color="orange">Gözləyir</Tag>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <Button
          icon={<BarChartOutlined />}
          onClick={onSummaryClick}
          className="w-full"
        >
          Statistika
        </Button>
        <Button
          type={isEvaluated ? "default" : "primary"}
          icon={evaluateButtonIcon}
          onClick={onEvaluateClick}
          className="w-full"
          disabled={!isEvaluated && !canDirectlyEvaluate}
        >
          {evaluateButtonText}
        </Button>
      </div>
    </div>
  );
};

export default UserEvaluationCard;