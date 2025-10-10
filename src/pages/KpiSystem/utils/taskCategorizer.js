export const categorizeTasks = (tasks, currentUser) => {
    if (!currentUser || !tasks) return {};

    const getEvaluationStatus = (task) => {
        if (!task || !task.evaluations) {
            return { hasSelfEval: false, hasSuperiorEval: false, evaluations: [] };
        }
        const evaluations = task.evaluations;
        const hasSelfEval = evaluations.some((e) => e.evaluation_type === "SELF");
        const hasSuperiorEval = evaluations.some((e) => e.evaluation_type === "SUPERIOR");
        return { hasSelfEval, hasSuperiorEval, evaluations };
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

        const { hasSelfEval, hasSuperiorEval, evaluations } = getEvaluationStatus(task);

        if (task.isPendingForMe) {
            categorized.pendingForMyEvaluation.push(task);
        } else if (task.assignee === currentUser.id && !hasSelfEval) {
            categorized.needsSelfEvaluation.push(task);
        } else if (task.assignee === currentUser.id && hasSelfEval && !hasSuperiorEval) {
            categorized.pendingSuperiorEvaluation.push(task);
        } else if (evaluations.some(e => e.evaluation_type === 'SUPERIOR' && e.evaluator.id === currentUser.id)) {
            categorized.evaluatedByMe.push(task);
        } else if (task.assignee !== currentUser.id && !hasSelfEval) {
            categorized.subordinatesAwaitingEval.push(task);
        } else if (hasSelfEval && hasSuperiorEval) {
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