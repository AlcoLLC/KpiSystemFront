export const statusMap = {
    PENDING: { text: "Gözləmədə", color: '#fa8c16' },
    TODO: { text: "Təsdiqlənib", color: '#faad14' },
    IN_PROGRESS: { text: "Davam edir", color: '#1890ff' },
    DONE: { text: "Tamamlanıb", color: '#52c41a' },
    CANCELLED: { text: "Ləğv edilib", color: '#bfbfbf' }
};

export const priorityMap = {
    CRITICAL: { text: "Çox vacib", color: 'red' },
    HIGH: { text: "Yüksək", color: 'volcano' },
    MEDIUM: { text: "Orta", color: 'gold' },
    LOW: { text: "Aşağı", color: 'green' }
};