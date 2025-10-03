import { Tag } from "antd";

const ScoreDisplay = ({ score, maxScore }) => {
  // Yalnız etibarlı dəyərlər olduqda faizi hesabla
  const percentage = (score && maxScore) ? (score / maxScore) * 100 : 0;

  // Rəng siniflərini (background və text) birlikdə təyin edən funksiya
  const getTagStyles = () => {
    if (percentage <= 30) {
      return "bg-red-100 text-red-700"; // Soft qırmızı
    }
    if (percentage <= 60) {
      return "bg-orange-100 text-orange-700"; // Soft narıncı
    }
    if (percentage <= 80) {
      return "bg-blue-100 text-blue-700"; // Soft mavi
    }
    return "bg-green-100 text-green-700"; // Soft yaşıl
  };

  // Tag üçün ümumi və dinamik sinifləri birləşdir
  const tagClassName = `
    font-bold 
    border-none 
    px-2.5 py-1 
    text-sm 
    rounded-md
    ${getTagStyles()}
  `;

  return (
    <Tag className={tagClassName.trim()}>
      {score} / {maxScore}
    </Tag>
  );
};

export default ScoreDisplay;