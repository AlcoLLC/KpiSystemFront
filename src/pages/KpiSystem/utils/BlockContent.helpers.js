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
        condition: ({ evaluationStatus, task }) => 
            isEvaluationComplete(evaluationStatus, task),
        config: ({ task, evaluationStatus }) => {
            const isDual = needsDualEvaluation(task);
            const hasTop = evaluationStatus.hasTopEval;
            
            if (isDual && hasTop) {
                return { 
                    text: "Dəyərləndirmə Tamamlandı (Yekun)", 
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
        condition: ({ isPendingForMe }) => isPendingForMe, 
        config: ({ task, currentUser }) => {
            const isTopManager = currentUser?.role === 'top_management';
            const isCEO = currentUser?.role === 'ceo';
            const assigneeRole = task?.assignee_obj?.role;

            let evalType;
            let color = 'red';
            
            if (isCEO) {
                evalType = 'Üst Rəhbər';
                color = 'red';
            } else if (isTopManager) {
                const evalConfig = task?.assignee_obj?.evaluation_config;
                
                if (evalConfig?.superior_evaluator_id === currentUser.id) {
                    evalType = 'Üst Rəhbər';
                    color = 'red';
                }
                else if (evalConfig?.tm_evaluator_id === currentUser.id) {
                    evalType = 'Yuxarı İdarəetmə';
                    color = 'purple';
                }
                else {
                    if (assigneeRole === 'department_lead') {
                        evalType = 'Üst Rəhbər';
                        color = 'red';
                    } else if (assigneeRole === 'manager' || assigneeRole === 'employee') {
                        if (needsDualEvaluation(task)) {
                            evalType = 'Yuxarı İdarəetmə';
                            color = 'purple';
                        } else {
                            evalType = 'Üst Rəhbər';
                            color = 'red';
                        }
                    } else {
                        evalType = 'Dəyərləndirmə';
                    }
                }
            } else {
                evalType = 'Üst Rəhbər'; 
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
        config: { text: "Özünü Dəyərləndir (1-10)", color: "orange", icon: StarOutlined },
    },
    
    {
        condition: ({ evaluationStatus, task }) => 
            evaluationStatus.hasSelfEval && 
            evaluationStatus.hasSuperiorEval && 
            !evaluationStatus.hasTopEval && 
            needsDualEvaluation(task), 
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
            isViewOnly: true, 
            icon: EyeOutlined 
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
    if (!matchedRule) return DEFAULT_BUTTON_CONFIG;
    
    return typeof matchedRule.config === 'function' ? matchedRule.config(props) : matchedRule.config;
};

export const getButtonStyle = (config) => {
    const backgroundColor = config.disabled ? COLOR_MAP.disabled : COLOR_MAP[config.color] || COLOR_MAP.blue;
    return {
        backgroundColor,
        borderColor: backgroundColor,
        color: 'white',
    };
};