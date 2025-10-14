import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Radio, message, Button } from 'antd';
import { UserOutlined, TeamOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import tasksApi from '../../api/tasksApi';
import TeamPerformanceView from './components/TeamPerformanceView';
import PerformanceDashboard from './components/PerformanceDashboard';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement,
    LineElement,
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Performance() {
    const { slug } = useParams();
    const { user } = useAuth();
    
    const [viewMode, setViewMode] = useState(user?.role !== 'employee' ? 'team' : 'my');
    
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const isSuperior = user && user.role !== 'employee';
    const isAdmin = user && user.role === 'admin';
    const showViewSwitcher = isSuperior && !isAdmin;

    const fetchPerformance = useCallback(async () => {
        if (viewMode !== 'my' && !slug) return;

        setLoading(true);
        setPerformanceData(null);
        try {
            const response = await tasksApi.getPerformanceSummary(slug || 'me');
            setPerformanceData(response.data);
        } catch (error) {
            message.error("Performans məlumatlarını yükləmək mümkün olmadı.", error);
        } finally {
            setLoading(false);
        }
    }, [slug, viewMode]);

    useEffect(() => {
        fetchPerformance();
    }, [fetchPerformance]);

    const renderContent = () => {
        if (slug || viewMode === 'my') {
            return (
                <PerformanceDashboard
                    loading={loading}
                    performanceData={performanceData}
                />
            );
        }
        return <TeamPerformanceView />;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="px-1 text-2xl font-bold text-gray-800 dark:text-white">
                    Performans İdarəetməsi
                </h2>
                {slug && (
                    <Link to="/performance">
                        <Button icon={<ArrowLeftOutlined />}>Bütün Əməkdaşlar</Button>
                    </Link>
                )}
            </div>

            {showViewSwitcher && !slug && (
                <div>
                    <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                        <Radio.Button value="my">
                            <UserOutlined /> Mənim Performansım
                        </Radio.Button>
                        <Radio.Button value="team">
                            <TeamOutlined /> Əməkdaşların Performansı
                        </Radio.Button>
                    </Radio.Group>
                </div>
            )}

            <div className="p-4 sm:p-6 rounded-lg shadow-md bg-white dark:bg-[#1B232D]">
                {renderContent()}
            </div>
        </div>
    );
}

export default Performance;