import { useState, useEffect, useMemo } from 'react';
import { Form, message } from 'antd';
import performanceAPI from '../api/performanceAPI';
import { formatForAPI } from '../utils/dateFormatter';

export const useEvaluationForm = ({ visible, onClose, user, initialData, evaluationMonth, canEdit }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [displayScore, setDisplayScore] = useState(5);

    const isEditing = !!initialData;
    const fullName = user ? `${user.first_name} ${user.last_name}` : '';

    useEffect(() => {
        if (visible) {
            const initialValues = isEditing
                ? { score: initialData.score, comment: initialData.comment }
                : { score: 5, comment: '' };
            form.setFieldsValue(initialValues);
            setDisplayScore(initialValues.score);
        }
    }, [visible, initialData, form, isEditing]);

    const handleFormSubmit = async (values) => {
        if (!canEdit) return;
        setLoading(true);

        const dateForAPI = new Date(evaluationMonth);
        dateForAPI.setDate(1);

        const payload = {
            evaluatee_id: user.id,
            score: values.score || 0,
            comment: values.comment || "",
            evaluation_date: formatForAPI(dateForAPI),
        };

        try {
            if (isEditing) {
                await performanceAPI.updateEvaluation(initialData.id, payload);
                message.success(`${fullName} üçün dəyərləndirmə uğurla yeniləndi.`);
            } else {
                await performanceAPI.createEvaluation(payload);
                message.success(`${fullName} uğurla dəyərləndirildi.`);
            }
            onClose(true);
        } catch (error) {
            const errorData = error.response?.data;
            const errorMessage = Object.values(errorData || {}).flat().join(' ') || 'Xəta baş verdi.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const scoreDescription = useMemo(() => {
        if (!displayScore) return { text: "...", className: "text-gray-500" };
        if (displayScore <= 3) return { text: "🔴 Performans yaxşılaşdırılmalıdır", className: "text-red-600" };
        if (displayScore <= 6) return { text: "🟡 Orta performans", className: "text-yellow-600" };
        if (displayScore <= 8) return { text: "🔵 Yaxşı performans", className: "text-blue-600" };
        return { text: "🟢 Əla performans", className: "text-green-600" };
    }, [displayScore]);

    const handleValuesChange = (changedValues) => {
        if (changedValues.score !== undefined) {
            setDisplayScore(changedValues.score);
        }
    };

    return {
        form,
        loading,
        displayScore,
        isEditing,
        scoreDescription,
        handleFormSubmit,
        handleValuesChange,
    };
};