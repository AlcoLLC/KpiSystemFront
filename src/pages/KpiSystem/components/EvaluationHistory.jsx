import { HistoryOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { formatDate } from './../../../utils/dateUtils';

const EvaluationHistory = ({ history }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
      <h5 className="font-semibold text-slate-700 mb-2 flex items-center text-sm">
        <HistoryOutlined className="mr-2" /> Dəyişiklik Tarixçəsi
      </h5>
      <ul className="space-y-1.5 list-disc list-inside">
        {history.map((entry, index) => (
          <li key={index} className="text-xs text-slate-600">
            <span className="font-medium">{formatDate(entry.timestamp)}</span> - 
            <span className="text-blue-600 font-medium mx-1">{entry.updated_by_name}</span> tərəfindən,
            bal dəyişdirildi: <Tag color="red">{entry.previous_score}</Tag> → <Tag color="green">{entry.new_score}</Tag>.
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EvaluationHistory;