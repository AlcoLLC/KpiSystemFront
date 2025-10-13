import { useState, useMemo } from "react";
import { Spin } from "antd"; 
import {
    AppstoreOutlined, FileDoneOutlined, ProfileOutlined, ClockCircleOutlined,
    TeamOutlined, CheckCircleOutlined, EyeOutlined
} from "@ant-design/icons";

import { useKpiData } from "./hooks/useKpiData";
import { categorizeTasks } from "./utils/taskCategorizer";
import KpiHeader from "./components/KpiHeader";
import KpiFilter from "./components/KpiFilter";
import TaskList from "./components/TaskList";
import ReviewModal from "./components/ReviewModal";
import EvaluationDetailsModal from "./components/EvaluationDetailsModal";
import EditReviewModal from "./components/EditReviewModal";
import "../../styles/kpi.css";

const filterOptions = [
    { value: 'all', label: 'Bütün Tapşırıqlar', icon: <AppstoreOutlined /> },
    { value: 'pendingForMyEvaluation', label: 'Mənim Qiymətləndirməli Olduqlarım', icon: <FileDoneOutlined /> },
    { value: 'needsSelfEvaluation', label: 'Özünü Qiymətləndirməli Olduqlarım', icon: <ProfileOutlined /> },
    { value: 'pendingSuperiorEvaluation', label: 'Rəhbər Qiymətləndirməsini Gözləyənlər', icon: <ClockCircleOutlined /> },
    { value: 'subordinatesAwaitingEval', label: 'Tabelikdəkilərin Gözləyən Tapşırıqları', icon: <TeamOutlined /> },
    { value: 'evaluatedByMe', label: 'Mənim Qiymətləndirdiyim', icon: <CheckCircleOutlined /> },
    { value: 'otherTasks', label: 'Digər Tamamlanmış Tapşırıqlar', icon: <EyeOutlined /> },
];

function KpiSystem() {
    const { tasks, loading, reloadData, currentUser } = useKpiData();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedTask, setSelectedTask] = useState(null);
    const [evaluationToEdit, setEvaluationToEdit] = useState(null);
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const categorizedTasks = useMemo(() => categorizeTasks(tasks, currentUser), [tasks, currentUser]);

    const handleReview = (task) => {
        setSelectedTask(task);
        setReviewModalOpen(true);
    };

    const handleViewDetails = (task) => {
        setSelectedTask(task);
        setDetailsModalOpen(true);
    };

    const handleEdit = (evaluation) => {
        setEvaluationToEdit(evaluation);
        setDetailsModalOpen(false);
        setEditModalOpen(true);
    };

    const handleReviewModalClose = () => {
        setReviewModalOpen(false);
        setSelectedTask(null);
        reloadData();
    };

    const handleEditModalClose = (shouldReload = false) => {
        setEditModalOpen(false);
        setEvaluationToEdit(null);
        if (shouldReload) {
            reloadData();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spin size="large" tip="Qiymətləndirmələr yüklənir..." />
            </div>
        );
    }

    return (
        <div className="kpi-container p-4">
            <KpiHeader currentUser={currentUser} />
            
            <KpiFilter
                selectedFilter={selectedFilter}
                onChange={setSelectedFilter}
                options={filterOptions}
            />
            
            <TaskList
                categorizedTasks={categorizedTasks}
                selectedFilter={selectedFilter}
                filterOptions={filterOptions}
                onReview={handleReview}
                onViewDetails={handleViewDetails}
                currentUser={currentUser}
            />

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={handleReviewModalClose}
                task={selectedTask}
                currentUser={currentUser}
            />
            <EvaluationDetailsModal
                open={isDetailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                task={selectedTask}
                evaluations={selectedTask?.evaluations || []}
                onEdit={handleEdit}
            />
            <EditReviewModal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                evaluation={evaluationToEdit}
            />
        </div>
    );
}

export default KpiSystem;