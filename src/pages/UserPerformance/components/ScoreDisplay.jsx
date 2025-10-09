const ScoreDisplay = ({ score }) => (
    <div className="flex justify-center items-center my-4">
        <span className="text-3xl font-bold text-green-600 bg-green-100 px-4 py-2 rounded-lg">
            {score || 0} / 10
        </span>
    </div>
);

export default ScoreDisplay;