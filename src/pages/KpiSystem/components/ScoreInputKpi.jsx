import { Rate } from "antd";

const ScoreInput = ({ isSelfEval, value, onChange }) => {
  if (isSelfEval) {
    return (
      <div className="w-full max-w-md">
        <Rate
          count={10}
          value={value}
          onChange={onChange}
          style={{ fontSize: "32px" }}
          className="flex justify-center"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-3 px-2">
          {[...Array(10)].map((_, i) => <span key={i}>{i + 1}</span>)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="relative">
        <input
          type="range"
          min="1"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-3">
        <span>1</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
      </div>
    </div>
  );
};

export default ScoreInput;