import { Tag } from "antd";

const ScoreDisplay = ({ score, maxScore }) => {
  const percentage = (score && maxScore) ? (score / maxScore) * 100 : 0;

  const getTagStyles = () => {
    if (percentage <= 30) {
      return "bg-red-100 text-red-700";
    }
    if (percentage <= 60) {
      return "bg-orange-100 text-orange-700"; 
    }
    if (percentage <= 80) {
      return "bg-blue-100 text-blue-700"; 
    }
    return "bg-green-100 text-green-700";
  };

  const tagClassName = `
    font-bold 
    border-none 
    px-2.5 py-1 
    text-sm 
    rounded-md
    ${getTagStyles()}
  `;

  return (
    <div className="kpi-container">
      <Tag className={tagClassName.trim()}>
      {score} / {maxScore}
    </Tag>
    </div>
  );
};

export default ScoreDisplay;