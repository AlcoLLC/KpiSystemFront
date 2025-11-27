import { Button, Tag, Avatar } from "antd";
import {
  EditOutlined,
  BarChartOutlined,
  UserOutlined,
  StarFilled,
  EyeOutlined,
} from "@ant-design/icons";

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

  const fullName = `${user.first_name} ${user.last_name}`;

  // Düymə mətnlərini təyin et
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

  // TM düyməsi - Yalnız Employee və Manager üçün "TM" prefiksi
  const getTMButtonProps = () => {
    const isEmployeeOrManager = ['İşçi', 'Menecer'].includes(user.role_display);
    const prefix = isEmployeeOrManager ? "TM " : "";
    
    if (!isTMEvaluated) {
      return { text: `${prefix}Qiymətləndir`, icon: <EditOutlined />, type: "primary" };
    }
    if (canEvaluateTopManagement) {
      return { text: `${prefix}Bax/Redaktə`, icon: <EditOutlined />, type: "default" };
    }
    return { text: `${prefix}Balı Gör`, icon: <EyeOutlined />, type: "default" };
  };

  const tmProps = getTMButtonProps();
  
  // YENİ: TM qiymətləndirməsinin tətbiq edildiyi rollar
  const isTMEvaluationApplicable = ['İşçi', 'Menecer'].includes(user.role_display);

  // YENİ: TM qiymətləndirməsinin edilməsi üçün SUPERIOR qiymətləndirməsinin mövcudluğunu yoxlayır
  const isSuperiorEvalRequired = isTMEvaluationApplicable; // Sadece Employee ve Manager üçün TM lazımdır
  const isSuperiorEvaluationComplete = !isSuperiorEvalRequired || isSuperiorEvaluated;
  // Qiymətləndirmə statusu
  const getEvaluationStatus = () => {
    // Əgər TM qiymətləndirməsi tələb olunmursa (role employee və ya manager deyil)
    if (!canEvaluateTopManagement && !isTMEvaluated) {
      // Yalnız Superior qiymətləndirməsi yoxlanır
      return isSuperiorEvaluated ? "Qiymətləndirilib" : "Gözləyir";
    }
    // TM qiymətləndirməsi tələb olunursa, hər ikisi yoxlanır
    return (isSuperiorEvaluated && isTMEvaluated) ? "Tam Qiymətləndirilib" : "Gözləyir";
  };

  const evaluationStatus = getEvaluationStatus();

  return (
    <div
      className={`
        user-kpi-system-card bg-white rounded-xl shadow-lg p-5 transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
        flex flex-col
        ${evaluationStatus === "Tam Qiymətləndirilib" || evaluationStatus === "Qiymətləndirilib" ? "bg-gray-50" : ""}
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
        {isSuperiorEvaluated && (
          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            <StarFilled />
            <span>{superiorEval.score} / 10</span>
          </div>
        )}
      </div>
      
      {/* TM Balı (Yalnız TM qiymətləndirməsi varsa göstərilir) */}
      {isTMEvaluated && (
         <div className="flex justify-end items-center mb-5">
             <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                <StarFilled />
                <span>TM: {topManagementEval.score} / 10</span>
            </div>
         </div>
      )}

      <div className="flex justify-between items-center mb-5">
        <Tag color="blue">
          {user.department_name || "Departament Təyin Edilməyib"}
        </Tag>
        <Tag color={evaluationStatus.includes("Qiymətləndirilib") ? "green" : "orange"}>
          {evaluationStatus}
        </Tag>
      </div>

      <div className="mt-auto space-y-3">
        {/* Statistika düyməsi */}
        <Button
          icon={<BarChartOutlined />}
          onClick={onSummaryClick}
          className="w-full"
        >
          Statistika
        </Button>
        
        {/* Superior Qiymətləndirmə */}
        <Button
          type={canEvaluateSuperior && !isSuperiorEvaluated ? "primary" : "default"}
          icon={superiorProps.icon}
          onClick={() => onEvaluateClick(user, EVALUATION_TYPES.SUPERIOR, superiorEval)}
          className="w-full"
          disabled={!canEvaluateSuperior && !isSuperiorEvaluated}
        >
          {superiorProps.text}
        </Button>
        
        {/* TM Qiymətləndirmə (Yalnız icazə varsa və ya bal varsa) */}
        {isTMEvaluationApplicable && (canEvaluateTopManagement || isTMEvaluated) && (
             <Button
                type={canEvaluateTopManagement && !isTMEvaluated ? "primary" : "default"}
                icon={tmProps.icon}
                onClick={() => onEvaluateClick(user, EVALUATION_TYPES.TOP_MANAGEMENT, topManagementEval)}
                className="w-full"
                // DÜZƏLİŞ: Düymənin deaktivasiya şərtinə Superior qiymətləndirməsinin olub-olmamasını əlavə edirik
                disabled={
                    (!canEvaluateTopManagement && !isTMEvaluated) || // Əvvəlki məntiq
                    (canEvaluateTopManagement && !isSuperiorEvaluationComplete) // Yalnız qiymətləndirməyə icazə var VƏ Superior tamamlanmayıbsa
                }
             >
                {tmProps.text}
             </Button>
        )}
      </div>
    </div>
  );
};

export default UserEvaluationCard;