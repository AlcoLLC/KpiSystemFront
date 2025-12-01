// kpi-system-frontend\src\pages\KpiSystem\utils\taskCategorizer.js

export const categorizeTasks = (tasks, currentUser) => {
    if (!currentUser || !tasks) return {};

    const getEvaluationStatus = (task) => {
        if (!task || !task.evaluations) {
            return { hasSelfEval: false, hasSuperiorEval: false, hasTopEval: false, evaluations: [] };
        }
        const evaluations = task.evaluations;
        const hasSelfEval = evaluations.some((e) => e.evaluation_type === "SELF");
        const hasSuperiorEval = evaluations.some((e) => e.evaluation_type === "SUPERIOR");
        const hasTopEval = evaluations.some((e) => e.evaluation_type === "TOP_MANAGEMENT");
        return { hasSelfEval, hasSuperiorEval, hasTopEval, evaluations };
    };

    const categorized = {
        needsSelfEvaluation: [],
        pendingSuperiorEvaluation: [],
        pendingForMyEvaluation: [],
        subordinatesAwaitingEval: [],
        evaluatedByMe: [],
        otherTasks: [],
    };

    tasks.forEach(task => {
        if (!task?.assignee) return;

        const { hasSelfEval, hasSuperiorEval, hasTopEval, evaluations } = getEvaluationStatus(task);

        const isEvaluatedByMe = evaluations.some(e => 
            (e.evaluation_type === 'SUPERIOR' || e.evaluation_type === 'TOP_MANAGEMENT') && e.evaluator?.id === currentUser.id
        );

        const isCompletedByAssignee = task.assignee === currentUser.id;

        if (task.isPendingForMe) {
            categorized.pendingForMyEvaluation.push(task);
        } else if (isCompletedByAssignee && !hasSelfEval) {
            categorized.needsSelfEvaluation.push(task);
        } else if (isCompletedByAssignee && hasSelfEval && !hasSuperiorEval) {
            categorized.pendingSuperiorEvaluation.push(task); 
        } else if (isEvaluatedByMe) {
            categorized.evaluatedByMe.push(task);
        } else if (task.assignee !== currentUser.id && hasSelfEval && !hasTopEval) {
            categorized.subordinatesAwaitingEval.push(task);
        } else {
            categorized.otherTasks.push(task);
        }
    });
    
    categorized.all = tasks;
    categorized.combinedTasksToEvaluate = [
        ...categorized.pendingForMyEvaluation,
        ...categorized.needsSelfEvaluation,
    ];
    categorized.combinedOtherTasks = [
        ...categorized.pendingSuperiorEvaluation,
        ...categorized.subordinatesAwaitingEval,
        ...categorized.evaluatedByMe,
        ...categorized.otherTasks,
    ];

    return categorized;
};