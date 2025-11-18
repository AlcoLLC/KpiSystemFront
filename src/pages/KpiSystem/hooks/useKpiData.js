import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import kpiAPI from '../../../api/kpiApi';
import useAuth from '../../../hooks/useAuth';

export const useKpiData = () => {
    const { user: currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const tasksResponse = await kpiAPI.getKpiDashboardTasks();
            let fetchedTasks = tasksResponse.data.results || tasksResponse.data || [];

            const isManager = ["admin", "ceo", "top_management", "department_lead", "manager"].includes(currentUser?.role);
            if (isManager) {
                const pendingResponse = await kpiAPI.getPendingForMe();
                const pendingForMeIds = new Set((pendingResponse.data || []).map(t => t.id));
                fetchedTasks = fetchedTasks.map(task => ({
                    ...task,
                    isPendingForMe: pendingForMeIds.has(task.id)
                }));
            }
            setTasks(fetchedTasks);
        } catch (error) {
            console.error("Data could not be loaded:", error);
            message.error("Məlumatların yüklənməsi zamanı xəta baş verdi.");
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { tasks, loading, reloadData: loadData, currentUser };
};