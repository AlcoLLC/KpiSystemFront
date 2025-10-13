import { TrophyOutlined, ApartmentOutlined } from "@ant-design/icons";

const KpiHeader = ({ currentUser }) => (
    <div className="text-center mb-10">
        <div className="mb-6">
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent pb-2">
                İdarəetmə Sistemi
            </h1>
            <p className="text-lg text-gray-500">
                Departament üzrə performansın qiymətləndirilməsi portalı
            </p>
        </div>
        
        <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg shadow-sm border border-green-200">
                <TrophyOutlined className="mr-2 text-lg" />
                <span className="font-medium">
                    Xoş gəlmisiniz, {currentUser?.first_name || currentUser?.username}!
                </span>
            </div>
           
        </div>
    </div>
);

export default KpiHeader;