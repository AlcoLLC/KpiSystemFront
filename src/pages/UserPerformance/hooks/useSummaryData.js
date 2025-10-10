import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import performanceAPI from "../../../api/performanceAPI";

export const useSummaryData = ({ userId, selectedMonth, isEnabled }) => {
  const [summary, setSummary] = useState(null);
  const [monthlyScores, setMonthlyScores] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setSummary(null);
    setMonthlyScores([]);

    try {
      const [summaryResponse, scoresResponse] = await Promise.all([
        performanceAPI.getPerformanceSummary(userId, selectedMonth),
        performanceAPI.getMonthlyScores(userId, selectedMonth),
      ]);

      setSummary(summaryResponse.data.averages);
      setMonthlyScores(scoresResponse.data);
    } catch (error) {
      message.error("Statistika yüklənərkən xəta baş verdi.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId, selectedMonth]);

  useEffect(() => {
    if (isEnabled && userId) {
      fetchData();
    }
  }, [isEnabled, userId, fetchData]);

  return { summary, monthlyScores, loading };
};
