// kpi-system-frontend\src\pages\KpiSystem\utils\BlockContent.helpers.js

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

// >>> Düzəliş: DEFAULT_BUTTON_CONFIG əlavə edildi <<<
const DEFAULT_BUTTON_CONFIG = {
    text: "Dəyərləndirmə Gözlənilir",
    color: "gray",
    disabled: true,
    icon: ClockCircleOutlined,
};
// >>> Düzəliş Son <<<

const BUTTON_RULES = [
    {
        // QAYDA 1: Dəyərləndirmə Top Management tərəfindən TAMAMLANIB (Yekun)
        // Bu, Manager/Employee üçün yekun mərhələdir.
        condition: ({ evaluationStatus }) => evaluationStatus.hasTopEval,
        config: { text: "Dəyərləndirmə Detalları (Yekun)", icon: EyeOutlined, isViewOnly: true, color: 'purple' },
    },
    
    // YENİ QAYDA (CEO və TM üçün Zəncir Sonu yoxlaması):
    {
        // QAYDA 2: Superior Qiymətləndirməsi TAMAMLANIB VƏ YEKUNDUR
        // (TM-in CEO tərəfindən və ya D-Lead-in TM tərəfindən qiymətləndirilməsi)
        condition: ({ evaluationStatus, task }) => 
            evaluationStatus.hasSuperiorEval && 
            (task?.assignee_obj?.role === 'top_management' || task?.assignee_obj?.role === 'department_lead') && // 'in' operatoru yerinə dəqiq yoxlama
            !evaluationStatus.hasTopEval, // Manager/Employee üçün topEval varsa, Qayda 1 işləməlidir
        config: { text: "Dəyərləndirmə Tamamlandı (Yekun)", icon: EyeOutlined, isViewOnly: true, color: 'blue' },
    },
    
    {
        // QAYDA 3: Dəyərləndirmə Mənim Tərəfimdən Gözlənilir (Ən yüksək prioritet)
        condition: ({ isPendingForMe }) => isPendingForMe, 
        config: ({ task, currentUser }) => {
            const isTopManager = currentUser?.role === 'top_management';
            const isCEO = currentUser?.role === 'ceo';
            const assigneeRole = task?.assignee_obj?.role;

            let evalType;
            let color = 'red'; // Default Manager/Lead üçün
            
            if (isCEO) {
                // CEO Top Management-i qiymətləndirir (SUPERIOR)
                evalType = 'Üst Rəhbər';
                color = 'red';
            } else if (isTopManager) {
                // TM D-Lead-i qiymətləndirirsə (SUPERIOR)
                if (assigneeRole === 'department_lead') {
                    evalType = 'Üst Rəhbər';
                    color = 'red'; 
                } 
                // TM Manager/Employee-u qiymətləndirirsə (TOP_MANAGEMENT)
                else if (assigneeRole === 'manager' || assigneeRole === 'employee') {
                    evalType = 'Yuxarı İdarəetmə';
                    color = 'purple';
                } else {
                    // Xəta halında (olmamalıdır, amma ehtiyat)
                    evalType = 'Dəyərləndirmə';
                }
            } else {
                // Manager/Lead (SUPERIOR)
                evalType = 'Üst Rəhbər'; 
            }

            return { 
                text: `${evalType} Dəyərləndirməsi (1-100)`, 
                color: color, 
                icon: FireOutlined,
                isViewOnly: false, // Aktiv düymə
            };
        }
    },
    
    {
        // QAYDA 4: Özünü Dəyərləndirmə Gözlənilir
        condition: ({ currentUser, task, evaluationStatus }) => 
            currentUser?.id === task?.assignee && 
            !evaluationStatus.hasSelfEval,
        config: { text: "Özünü Dəyərləndir (1-10)", color: "orange", icon: StarOutlined },
    },
    
    {
        // QAYDA 5: Superior Qiymətləndirməsi TAMAMLANIB, amma Top Management Gözlənilir
        // Yalnız Manager və Employee üçün
        condition: ({ evaluationStatus, task }) => 
            evaluationStatus.hasSelfEval && 
            evaluationStatus.hasSuperiorEval && 
            !evaluationStatus.hasTopEval && 
            (task?.assignee_obj?.role === 'manager' || task?.assignee_obj?.role === 'employee'),
        config: { text: "Yuxarı İdarəetmə Qiymətləndirməsi Gözlənilir", color: "purple", disabled: true, icon: ClockCircleOutlined },
    },
    
    {
        // QAYDA 6: Superior Qiymətləndirməsi Gözlənilir (Assignee-nin özü üçün)
        condition: ({ currentUser, task, evaluationStatus }) => 
            currentUser?.id === task?.assignee && 
            evaluationStatus.hasSelfEval && 
            !evaluationStatus.hasSuperiorEval && 
            !evaluationStatus.hasTopEval,
        config: { text: "Üst Rəhbər Qiymətləndirməsi Gözlənilir", color: "gray", isViewOnly: true, icon: EyeOutlined },
    },
    
    {
        // QAYDA 7: Dəyərləndirmə Edilib (Fallback/Gözləmə)
        condition: ({ evaluationStatus }) => evaluationStatus.hasSelfEval,
        config: { text: "Dəyərləndirmə Detallarına Bax", color: "gray", isViewOnly: true, icon: EyeOutlined },
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