export const getAssigneeName = (details) => {
    if (!details) { return 'Təyin edilməyib'; }
    if (typeof details === 'object' && details !== null && details.full_name) { return details.full_name; }
    if (typeof details === 'string' && details.trim() !== '') { return details; }
    return 'Naməlum';
};