import { Button, Tag, Avatar } from "antd";
import {
  EditOutlined,
  BarChartOutlined,
  UserOutlined,
  StarFilled,
  EyeOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";

const EVALUATION_TYPES = {
  SUPERIOR: 'SUPERIOR',
  TOP_MANAGEMENT: 'TOP_MANAGEMENT',
};


const UserEvaluationCard = ({ user, onEvaluateClick, onSummaryClick }) => {
  const evaluations = user.selected_month_evaluations || {};
  const superiorEval = evaluations.superior;
  const topManagementEval = evaluations.top_management;

  const isSuperiorEvaluated = !!superiorEval;
  const isTMEvaluated = !!topManagementEval;
  
  const canEvaluateSuperior = user.can_evaluate_superior;
  const canEvaluateTopManagement = user.can_evaluate_top_management;
  
  const evalConfig = user.evaluation_config || {};
  const isDualEvaluation = evalConfig.is_dual_evaluation === true;

  const fullName = `${user.first_name} ${user.last_name}`;

  if (process.env.NODE_ENV === 'development') {
    console.log('👤 User Card Debug:', {
      user: fullName,
      role: user.role_display,
      isDualEvaluation,
      canEvaluateSuperior,
      canEvaluateTopManagement,
      isSuperiorEvaluated,
      isTMEvaluated,
      evalConfig
    });
  }

  useEffect(() => {
    console.log('👤 User Card Debug:', {
      user: fullName,
      role: user.role_display,
      evalConfig,
      isDualEvaluation,
      canEvaluateSuperior,
      canEvaluateTopManagement,
      isSuperiorEvaluated,
      isTMEvaluated,
    });
  }, [user, evalConfig, isDualEvaluation, canEvaluateSuperior, canEvaluateTopManagement]);


  const getSuperiorButtonProps = () => {
    if (!isSuperiorEvaluated) {
      return { text: "Qiymətləndir", icon: <EditOutlined />, type: "primary" };
    }
    if (canEvaluateSuperior) {
      return { text: "Bax/Redaktə", icon: <EditOutlined />, type: "default" };
    }
    return { text: "Balı Gör", icon: <EyeOutlined />, type: "default" };
  };

  const superiorProps = getSuperiorButtonProps();

  const getTMButtonProps = () => {
    if (!isTMEvaluated) {
      return { text: "TM Qiymətləndir", icon: <EditOutlined />, type: "primary" };
    }
    if (canEvaluateTopManagement) {
      return { text: "TM Bax/Redaktə", icon: <EditOutlined />, type: "default" };
    }
    return { text: "TM Balı Gör", icon: <EyeOutlined />, type: "default" };
  };

  const tmProps = getTMButtonProps();

  const isEvaluationComplete = () => {
    if (isDualEvaluation) {
      return isSuperiorEvaluated && isTMEvaluated;
    }
    return isSuperiorEvaluated;
  };

  const evaluationStatus = isEvaluationComplete() 
    ? "Qiymətləndirilib" 
    : "Gözləyir";

  const shouldShowTMButton = isDualEvaluation && (canEvaluateTopManagement || isTMEvaluated);
  const isTMButtonDisabled = !canEvaluateTopManagement && !isTMEvaluated;

  return (
    <div
      className={`
        user-kpi-system-card bg-white rounded-xl shadow-lg p-5 transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
        flex flex-col
        ${evaluationStatus === "Qiymətləndirilib" ? "bg-gray-50 dark:bg-gray-900" : "dark:bg-gray-800"}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <Avatar
            size={64}
            src={user.profile_photo}
            icon={<UserOutlined />}
            className="border-2 border-gray-200 dark:border-gray-600"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{fullName}</h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {user.position_name || "Vəzifə Təyin Edilməyib"}
            </p>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{user.role_display}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          {isSuperiorEvaluated && (
          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
            <StarFilled />
            <span>{superiorEval.score} / 10</span>
          </div>
        )}
        {isDualEvaluation && isTMEvaluated ? (
            <div className="flex justify-start items-center mb-3">
                <div className="flex items-center gap-1 bg-purple-200 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                    <StarFilled />
                    <span>TM: {topManagementEval.score} / 10</span>
                </div>
            </div>
        ) : (
            <div className="h-8 mb-3"></div>
        )}
        </div>
      </div>
      

      <div className="flex justify-between items-center mb-5">
        <Tag color="blue">
          {user.department_name || "Departament Təyin Edilməyib"}
        </Tag>
        <Tag color={evaluationStatus === "Qiymətləndirilib" ? "green" : "orange"}>
          {evaluationStatus}
        </Tag>
      </div>

      <div className="mt-auto space-y-2">
        <Button
          icon={<BarChartOutlined />}
          onClick={onSummaryClick}
          className="w-full h-10 font-semibold dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 hover:dark:bg-gray-600"
        >
          Statistika
        </Button>
        
        <Button
          type={canEvaluateSuperior && !isSuperiorEvaluated ? "primary" : "default"}
          icon={superiorProps.icon}
          onClick={() => onEvaluateClick(user, EVALUATION_TYPES.SUPERIOR, superiorEval)}
          className="w-full h-10 font-semibold dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 hover:dark:bg-gray-600 dark:hover:text-white"
          disabled={!canEvaluateSuperior && !isSuperiorEvaluated}
        >
          {superiorProps.text}
        </Button>
        
        {shouldShowTMButton && (
          <Button
            type={canEvaluateTopManagement && !isTMEvaluated && isSuperiorEvaluated ? "primary" : "default"}
            icon={tmProps.icon}
            onClick={() => onEvaluateClick(user, EVALUATION_TYPES.TOP_MANAGEMENT, topManagementEval)}
            className="w-full h-10 font-semibold dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 hover:dark:bg-gray-600 dark:hover:text-white"
            disabled={isTMButtonDisabled || !isSuperiorEvaluated}
          >
            {tmProps.text}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserEvaluationCard;