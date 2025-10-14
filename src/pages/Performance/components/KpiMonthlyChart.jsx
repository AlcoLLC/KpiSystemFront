import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Button, Spin, message, Card, Empty, Radio } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/az';
import kpiAPI from '../../../api/performanceAPI';  

dayjs.locale('az');

const getChartOptions = (isDark, evaluations) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: isDark ? '#333' : '#fff',
            titleColor: isDark ? '#fff' : '#333',
            bodyColor: isDark ? '#ddd' : '#555',
            padding: 12,
            cornerRadius: 6,
            callbacks: {
                title: function(context) {
                    const index = context[0].dataIndex;
                    const evaluation = evaluations[index];
                    return evaluation ? dayjs(evaluation.completed_at).format('DD MMMM YYYY') : '';
                },
                label: function(context) {
                    const index = context.dataIndex;
                    const evaluation = evaluations[index];
                    if (evaluation) {
                        return `${evaluation.task_title}: ${evaluation.score} bal`;
                    }
                    return `Bal: ${context.parsed.y}`;
                }
            }
        }
    },
    scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: isDark ? '#a0aec0' : '#4a5568' } },
        x: { ticks: { color: isDark ? '#a0aec0' : '#4a5568' } }
    },
    elements: {
        line: { tension: 0.4 }, 
        point: { radius: 5, hoverRadius: 8, backgroundColor: '#fff' }
    }
});

const createGradient = (ctx, chartArea, isDark) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    if (isDark) {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)');
    } else {
        gradient.addColorStop(0, 'rgba(191, 219, 254, 0.2)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.5)');
    }
    return gradient;
};

const KpiMonthlyChart = ({ userSlug, isDark }) => {
    const [period, setPeriod] = useState('3m'); 
    const [chartData, setChartData] = useState(null);
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userSlug) return;
        
        const fetchChartData = async () => {
            setLoading(true);
            try {
                let params = {};
                if (period === '3m') {
                    params = {
                        start_date: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
                        end_date: dayjs().format('YYYY-MM-DD')
                    };
                } else {
                    params = { year: period.year(), month: period.month() + 1 };
                }
                
                const response = await kpiAPI.getKpiMonthlySummary(userSlug, params);
                
                const evals = response.data.evaluations || [];
                setEvaluations(evals);

                if (evals.length > 0) {
                    setChartData({
                        labels: evals.map(e => dayjs(e.completed_at).format('DD MMM')), 
                        datasets: [{
                            label: 'Yekun Bal',
                            data: evals.map(e => e.score),
                            borderColor: '#3b82f6',
                            borderWidth: 3,
                            fill: true,
                            backgroundColor: (context) => {
                                const { ctx, chartArea } = context.chart;
                                if (!chartArea) return null;
                                return createGradient(ctx, chartArea, isDark);
                            },
                        }]
                    });
                } else {
                    setChartData(null);
                }
            } catch (error) {
                message.error('KPI statistikasını yükləmək mümkün olmadı.', error);
                setChartData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [userSlug, period, isDark]);

    const handlePeriodChange = (e) => setPeriod(e.target.value);
    const handlePrevMonth = () => setPeriod(current => (current === '3m' ? dayjs().subtract(1, 'month') : current.subtract(1, 'month')));
    const handleNextMonth = () => setPeriod(current => (current === '3m' ? dayjs() : current.add(1, 'month')));
    
    const getTitle = () => {
        if (period === '3m') return 'Son 3 Ayın Nəticələri';
        const monthName = period.format('MMMM YYYY');
        return monthName.charAt(0).toUpperCase() + monthName.slice(1);
    };
    
    return (
        <Card title="Aylıq KPI Performans Qrafiki" className="shadow-md bg-white dark:bg-[#1F2937]">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center">
                    <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
                    <p className="font-semibold text-lg dark:text-white mx-4 text-center">{getTitle()}</p>
                    <Button icon={<RightOutlined />} onClick={handleNextMonth} />
                </div>
                <Radio.Group value={period} onChange={handlePeriodChange}>
                    <Radio.Button value="3m">Son 3 Ay</Radio.Button>
                    <Radio.Button value={dayjs()}>Bu Ay</Radio.Button>
                </Radio.Group>
            </div>
            <div className="relative h-80"> 
                {loading ? <div className="absolute inset-0 flex justify-center items-center"><Spin /></div> : (
                    chartData ? <Line options={getChartOptions(isDark, evaluations)} data={chartData} /> : <Empty description="Göstərilən period üçün heç bir KPI balı tapılmadı." />
                )}
            </div>
        </Card>
    );
};

export default KpiMonthlyChart;