import {
    EyeOutlined,
    FireOutlined,
    StarOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

const COLOR_MAP = {
    red: "#EF4444",
    green: "#10B981",
    orange: "#F59E0B",
    purple: "#8B5CF6",
    gray: "#9CA3AF",
    blue: "#3B82F6",
    disabled: "#D1D5DB",
};

const DEFAULT_BUTTON_CONFIG = {
    text: "Dəyərləndirmə Gözlənilir",
    color: "gray",
    disabled: true,
    icon: ClockCircleOutlined,
};

const needsDualEvaluation = (task) => {
    const assigneeRole = task?.assignee_obj?.role;
    
    if (assigneeRole !== 'employee' && assigneeRole !== 'manager') {
        return false;
    }
    
    if (task?.assignee_obj?.evaluation_config) {
        return task.assignee_obj.evaluation_config.is_dual_evaluation === true;
    }
    
    return false;
};

const isEvaluationComplete = (evaluationStatus, task) => {
    const hasSelf = evaluationStatus.hasSelfEval;
    const hasSuperior = evaluationStatus.hasSuperiorEval;
    const hasTop = evaluationStatus.hasTopEval;
    
    if (needsDualEvaluation(task)) {
        return hasSelf && hasSuperior && hasTop; 
    }
    return hasSelf && hasSuperior;
};

const BUTTON_RULES = [
    {
        condition: ({ isPendingForMe }) => isPendingForMe, 
        config: ({ task, currentUser, evaluationStatus }) => {
            const isTopManager = currentUser?.role === 'top_management';
            const isAdmin = currentUser?.role === 'admin';
            const evalConfig = task?.assignee_obj?.evaluation_config;
            let evalType;
            let color = 'red';
            
            const isTMEvaluationPending = needsDualEvaluation(task) && 
                                          evaluationStatus.hasSelfEval && 
                                          evaluationStatus.hasSuperiorEval && 
                                          !evaluationStatus.hasTopEval &&
                                          evalConfig?.tm_evaluator_id === currentUser.id;

            if (isAdmin) {
                evalType = 'Admin Dəyərləndirməsi';
                color = 'green';
            } else if (isTMEvaluationPending) {
                evalType = 'Yuxarı İdarəetmə';
                color = 'purple';
            } else if (isTopManager && evalConfig?.superior_evaluator_id === currentUser.id) {
                evalType = 'Üst Rəhbər';
                color = 'red';
            } else if (evalConfig?.superior_evaluator_id === currentUser.id) {
                evalType = 'Üst Rəhbər';
                color = 'red';
            } else {
                evalType = 'Dəyərləndirmə';
                color = 'red';
            }

            return { 
                text: `${evalType} Dəyərləndirməsi (1-100)`, 
                color: color, 
                icon: FireOutlined,
                isViewOnly: false,
            };
        }
    },
    {
        condition: ({ currentUser, task, evaluationStatus }) => 
            currentUser?.id === task?.assignee && 
            !evaluationStatus.hasSelfEval,
        config: { 
            text: "Özünü Dəyərləndir (1-10)", 
            color: "orange", 
            icon: StarOutlined,
            isViewOnly: false,
        },
    },
    {
    condition: ({ evaluationStatus, task, currentUser }) => {
        if (!evaluationStatus.hasSelfEval || !evaluationStatus.hasSuperiorEval || evaluationStatus.hasTopEval) {
            return false;
        }
        
        if (!needsDualEvaluation(task)) {
            return false; 
        }
        
        const evalConfig = task?.assignee_obj?.evaluation_config;
        const isCurrentUserTMEvaluator = evalConfig?.tm_evaluator_id === currentUser?.id; 
        
        return !isCurrentUserTMEvaluator;
    },
    config: { 
        text: "Yuxarı İdarəetmə Qiymətləndirməsi Gözlənilir",
        color: "purple", 
        disabled: true, 
        icon: ClockCircleOutlined 
    },
    },
    {
        condition: ({ currentUser, task, evaluationStatus }) => 
            currentUser?.id === task?.assignee && 
            evaluationStatus.hasSelfEval && 
            !evaluationStatus.hasSuperiorEval,
        config: { 
            text: "Üst Rəhbər Qiymətləndirməsi Gözlənilir", 
            color: "gray", 
            disabled: true,
            isViewOnly: true, 
            icon: ClockCircleOutlined 
        },
    },
    {
        condition: ({ evaluationStatus, task }) => 
            isEvaluationComplete(evaluationStatus, task),
        config: ({ task, evaluationStatus }) => {
            const isDual = needsDualEvaluation(task);
            const hasTop = evaluationStatus.hasTopEval;
            
            if (isDual && hasTop) {
                return { 
                    text: "Dəyərləndirmə Tamamlandı (Yekun: TM)", 
                    icon: EyeOutlined, 
                    isViewOnly: true, 
                    color: 'purple' 
                };
            }
            
            return { 
                text: "Dəyərləndirmə Tamamlandı (Yekun)", 
                icon: EyeOutlined, 
                isViewOnly: true, 
                color: 'blue'
            };
        },
    },
    {
        condition: ({ evaluationStatus }) => evaluationStatus.hasSelfEval,
        config: { 
            text: "Dəyərləndirmə Detallarına Bax", 
            color: "gray", 
            isViewOnly: true, 
            icon: EyeOutlined 
        },
    },
];

export const determineButtonConfig = (props) => {
    const matchedRule = BUTTON_RULES.find(rule => rule.condition(props));
    
    if (!matchedRule) {
        return DEFAULT_BUTTON_CONFIG;
    }
    
    return typeof matchedRule.config === 'function' 
        ? matchedRule.config(props) 
        : matchedRule.config;
};

export const getButtonStyle = (config) => {
    const backgroundColor = config.disabled 
        ? COLOR_MAP.disabled 
        : COLOR_MAP[config.color] || COLOR_MAP.blue;
    
    return {
        backgroundColor,
        borderColor: backgroundColor,
        color: 'white',
    };
};