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

const BUTTON_RULES = [
    {
        condition: ({ evaluationStatus }) => evaluationStatus.hasSelfEval && evaluationStatus.hasSuperiorEval,
        config: { text: "Dəyərləndirmə Detalları", icon: EyeOutlined, isViewOnly: true },
    },
    {
        condition: ({ isPendingForMe }) => isPendingForMe,
        config: ({ task }) => ({ text: `Dəyərləndir (1-100): ${task.assignee_details}`, color: "red", icon: FireOutlined }),
    },
    {
        condition: ({ currentUser, task, evaluationStatus }) => currentUser?.id === task?.assignee && !evaluationStatus.hasSelfEval,
        config: { text: "Özünü Dəyərləndir (1-10)", color: "orange", icon: StarOutlined },
    },
    {
        condition: ({ currentUser, task, evaluationStatus }) => currentUser?.id === task?.assignee && evaluationStatus.hasSelfEval && !evaluationStatus.hasSuperiorEval,
        config: { text: "Rəhbər dəyərləndirməsi gözlənilir", color: "purple", isViewOnly: true, icon: EyeOutlined },
    },
    {
        condition: ({ evaluationStatus }) => evaluationStatus.hasSelfEval,
        config: { text: "Rəhbər Dəyərləndirməsi Gözlənilir", color: "gray", disabled: true, icon: ClockCircleOutlined },
    },
];

const DEFAULT_BUTTON_CONFIG = {
    text: "Dəyərləndirmə Gözlənilir",
    color: "gray",
    disabled: true,
    icon: ClockCircleOutlined,
};

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