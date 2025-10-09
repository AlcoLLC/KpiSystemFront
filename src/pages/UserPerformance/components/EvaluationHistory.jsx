import { Timeline } from 'antd';
import { formatForHistory } from '../../../utils/dateFormatter';

const EvaluationHistory = ({ history }) => {
    if (!history || history.length === 0) {
        return null;
    }

    return (
        <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Dəyişiklik Tarixçəsi</h4>
            <Timeline>
                {history.map((entry, index) => (
                    <Timeline.Item key={index}>
                        <p className="text-sm text-gray-600">
                            <strong>{entry.updated_by_name}</strong> tərəfindən dəyişdirildi
                        </p>
                        <p className="text-xs text-gray-400">
                            {formatForHistory(entry.timestamp)}
                        </p>
                        <div className="mt-1">
                            <span className="text-red-500 line-through">{entry.previous_score} bal</span>
                            <span className="mx-2">→</span>
                            <span className="text-green-600 font-bold">{entry.new_score} bal</span>
                        </div>
                    </Timeline.Item>
                ))}
            </Timeline>
        </div>
    );
};

export default EvaluationHistory;