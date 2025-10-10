import { Row, Col, Divider } from "antd";
const getEvaluationStatus = (task) => {
    if (!task || !task.evaluations) {
        return { hasSelfEval: false, hasSuperiorEval: false, evaluations: [] };
    }
    const evaluations = task.evaluations;
    const hasSelfEval = evaluations.some((e) => e.evaluation_type === "SELF");
    const hasSuperiorEval = evaluations.some(
        (e) => e.evaluation_type === "SUPERIOR"
    );
    return { hasSelfEval, hasSuperiorEval, evaluations };
};

import BlockContent from "./BlockContent"; 

const TaskSection = ({ title, tasks, icon, onReview, onViewDetails, currentUser }) => {
    if (!tasks || tasks.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <Divider orientation="left" style={{ borderColor: '#9ca3af' }}>
                <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
                    {icon}
                    <span className="ml-2">{title}</span>
                </h2>
            </Divider>
            <Row gutter={[16, 16]}>
                {tasks.map((task) => {
                    if (!task.assignee) return null;
                    const evaluationStatus = getEvaluationStatus(task);
                    const isPendingForMe = task.isPendingForMe;

                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={task.id}>
                            <BlockContent
                                task={task}
                                onReview={onReview}
                                onViewDetails={onViewDetails}
                                evaluationStatus={evaluationStatus}
                                currentUser={currentUser}
                                isPendingForMe={isPendingForMe}
                            />
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default TaskSection;