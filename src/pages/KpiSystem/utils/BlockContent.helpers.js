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
        // Dual evaluation (Employee/Manager): Self + Superior + TM
        return hasSelf && hasSuperior && hasTop; 
    }
    // Normal evaluation (DL/TM): Self + Superior
    return hasSelf && hasSuperior;
};

const BUTTON_RULES = [

    // 1. MƏNDƏN GÖZLƏNİLİR (SUPERIOR/TM DƏYƏRLƏNDİRMƏSİ)
    // isPendingForMe true olduğu halda hansı tipdə dəyərləndirmə ediləcəyini göstərir.
    {
        condition: ({ isPendingForMe }) => isPendingForMe, 
        config: ({ task, currentUser, evaluationStatus }) => {
            const isTopManager = currentUser?.role === 'top_management';
            const isAdmin = currentUser?.role === 'admin';
            const evalConfig = task?.assignee_obj?.evaluation_config;
            let evalType;
            let color = 'red';
            
            // TM Dəyərləndirməsi gözlənilirmi? (Superior tamamlanıb amma TM yoxdursa)
            const isTMEvaluationPending = needsDualEvaluation(task) && 
                                          evaluationStatus.hasSelfEval && 
                                          evaluationStatus.hasSuperiorEval && 
                                          !evaluationStatus.hasTopEval &&
                                          evalConfig?.tm_evaluator_id === currentUser.id;

            if (isAdmin) {
                evalType = 'Admin Dəyərləndirməsi';
                color = 'green';
            } else if (isTMEvaluationPending) {
                // Cari istifadəçi TM rolunda və TM dəyərləndirməsi gözlənilirsə
                evalType = 'Yuxarı İdarəetmə';
                color = 'purple';
            } else if (isTopManager && evalConfig?.superior_evaluator_id === currentUser.id) {
                // Cari istifadəçi TM rolunda amma bu tapşırıqda Superior evaluatoridirsə
                evalType = 'Üst Rəhbər';
                color = 'red';
            } else if (evalConfig?.superior_evaluator_id === currentUser.id) {
                // Normal Superior Dəyərləndirməsi
                evalType = 'Üst Rəhbər';
                color = 'red';
            } else {
                 // Digər hallar (CEO, qeyri-standart hallar)
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

    // 2. ÖZ DƏYƏRLƏNDİRMƏSİ GÖZLƏNİLİR (Assignee)
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

    // 3. YUXARI İDARƏETMƏ DƏYƏRLƏNDİRMƏSİ GÖZLƏNİLİR (TM Evaluatoru olmayanlar üçün)
    {
    condition: ({ evaluationStatus, task, currentUser }) => {
        // Self VE Superior olmalı, TM Henüz OLMAMALI
        if (!evaluationStatus.hasSelfEval || !evaluationStatus.hasSuperiorEval || evaluationStatus.hasTopEval) {
            return false;
        }
        
        if (!needsDualEvaluation(task)) {
            return false; // Çift değerlendirme gerekmeli
        }
        
        const evalConfig = task?.assignee_obj?.evaluation_config;
        const isCurrentUserTMEvaluator = evalConfig?.tm_evaluator_id === currentUser?.id; 
        
        return !isCurrentUserTMEvaluator; // Cari istifadəçi TM evaluatoru deyilsə
    },
    config: { 
        text: "Yuxarı İdarəetmə Qiymətləndirməsi Gözlənilir",
        color: "purple", 
        disabled: true, 
        icon: ClockCircleOutlined 
    },
    },

    // 4. ÜST RƏHBƏR DƏYƏRLƏNDİRMƏSİ GÖZLƏNİLİR (Assignee üçün)
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
    
    // 5. DƏYƏRLƏNDİRMƏ TAMAMLANDI (Ən sonda yoxlanılır)
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
    
    // 6. DƏYƏRLƏNDİRMƏ DETALLARI
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