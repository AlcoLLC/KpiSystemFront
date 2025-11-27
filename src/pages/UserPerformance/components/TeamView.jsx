// kpi-system-frontend\src\pages\UserPerformance\components\TeamView.jsx

import { Empty } from 'antd';
import UserEvaluationCard from './UserEvaluationCard';

const TeamView = ({ users, onEvaluateClick, onSummaryClick }) => {
    if (!users || users.length === 0) {
        return <Empty className="pt-10" description="Bu filterlərə uyğun dəyərləndiriləcək işçi tapılmadı." />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pt-4">
            {users.map(u => (
                <UserEvaluationCard
                    key={u.id}
                    user={u}
                    // onEvaluateClick artıq 3 arqument qəbul edir: user, type, initialData
                    onEvaluateClick={onEvaluateClick} 
                    onSummaryClick={() => onSummaryClick(u)}
                />
            ))}
        </div>
    );
};

export default TeamView;