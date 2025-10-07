import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Button, Spin, message, Card, Empty } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/az';
import kpiAPI from '../../../api/kpiApi';

dayjs.locale('az');

// Chart üçün detallı konfiqurasiya
const getChartOptions = (isDark, evaluations) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: isDark ? '#333' : '#fff',
            titleColor: isDark ? '#fff' : '#333',
            bodyColor: isDark ? '#ddd' : '#555',
            padding: 10,
            cornerRadius: 5,
            callbacks: {
                // Hər nöqtənin üzərində göstəriləcək mətn
                label: function(context) {
                    const index = context.dataIndex;
                    const evaluation = evaluations[index];
                    if (evaluation) {
                        // Tooltip-də həm adı, həm balı göstəririk
                        return `${evaluation.task_title}: ${evaluation.score} bal`;
                    }
                    return `Bal: ${context.parsed.y}`;
                },
                title: () => null // Başlığı ləğv edirik
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: 'Yekun Bal', color: isDark ? '#a0aec0' : '#4a5568' },
            grid: { color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
            ticks: { color: isDark ? '#a0aec0' : '#4a5568' }
        },
        x: {
            grid: { display: false },
            ticks: {
                color: isDark ? '#a0aec0' : '#4a5568',
                // Uzun tapşırıq adlarının səliqəli görünməsi üçün
                callback: function(value) {
                    const label = this.getLabelForValue(value);
                    return label.length > 15 ? label.substring(0, 15) + '...' : label;
                }
            }
        }
    },
});

const KpiMonthlyChart = ({ userSlug, isDark }) => {
    const [date, setDate] = useState(dayjs());
    const [chartData, setChartData] = useState(null);
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userSlug) return;
        
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const params = { year: date.year(), month: date.month() + 1 };
                const response = await kpiAPI.getKpiMonthlySummary(userSlug, params);
                
                const evals = response.data.evaluations;
                setEvaluations(evals);

                if (evals && evals.length > 0) {
                    setChartData({
                        // Dəyişiklik: X oxu üçün etiket olaraq tapşırıqların adlarını istifadə edirik
                        labels: evals.map(e => e.task_title),
                        datasets: [{
                            label: 'Yekun Bal',
                            data: evals.map(e => e.score),
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            fill: true, // Xəttin altını rəngləyirik
                            tension: 0.3,
                            pointRadius: 6,
                            pointHoverRadius: 10,
                            pointBackgroundColor: '#3b82f6',
                        }]
                    });
                } else {
                    setChartData(null);
                }
            } catch (error) {
                message.error('KPI statistikasını yükləmək mümkün olmadı.');
                setChartData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [userSlug, date]);

    const handlePrevMonth = () => setDate(date.subtract(1, 'month'));
    const handleNextMonth = () => setDate(date.add(1, 'month'));

    const capitalizedMonth = (d) => {
        const monthName = d.format('MMMM YYYY');
        return monthName.charAt(0).toUpperCase() + monthName.slice(1);
    }
    
    return (
        <Card title="Aylıq KPI Performans Qrafiki" className="shadow-md bg-white dark:bg-[#1F2937]">
            <div className="flex justify-between items-center mb-4">
                <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
                <p className="font-semibold text-lg dark:text-white">{capitalizedMonth(date)}</p>
                <Button icon={<RightOutlined />} onClick={handleNextMonth} />
            </div>
            <div className="relative h-64">
                {loading ? <div className="absolute inset-0 flex justify-center items-center"><Spin /></div> : (
                    chartData ? <Line options={getChartOptions(isDark, evaluations)} data={chartData} /> : <Empty description="Bu ay üçün heç bir KPI balı tapılmadı." />
                )}
            </div>
        </Card>
    );
};

export default KpiMonthlyChart;