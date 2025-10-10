import { Card, Descriptions, Tag } from "antd";
import { formatDate } from './../../../utils/dateUtils';

const priorityColors = {
  CRITICAL: "red",
  HIGH: "orange",
  MEDIUM: "blue",
  LOW: "green",
};

const TaskDetailsCard = ({ task }) => (
  <Card size="small">
    <Descriptions title="Tapşırıq Məlumatları" bordered column={1} size="small">
      <Descriptions.Item label="Başlıq">{task.title}</Descriptions.Item>
      {task.description && (
        <Descriptions.Item label="Tapşırıq detalları">
          <div className="whitespace-pre-wrap">{task.description}</div>
        </Descriptions.Item>
      )}
     <Descriptions.Item label="İşçi">{task.assignee_details}</Descriptions.Item>
      {task.assignee_obj && task.assignee_obj.position_details?.name && (
  <Descriptions.Item label="Vəzifə">
    {task.assignee_obj.position_details.name}
  </Descriptions.Item>
)}
      <Descriptions.Item label="Status">
        <Tag color="blue">{task.status_display}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Prioritet">
        <Tag color={priorityColors[task.priority] || "default"}>
          {task.priority_display}
        </Tag>
      </Descriptions.Item>
      {task.due_date && (
        <Descriptions.Item label="Son Tarix">
          {formatDate(task.due_date)}
        </Descriptions.Item>
      )}
    </Descriptions>
  </Card>
);

export default TaskDetailsCard;