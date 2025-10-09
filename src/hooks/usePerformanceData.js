import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import useAuth from "./useAuth";
import performanceAPI from "../api/performanceAPI";

const managerialRoles = [
  "admin",
  "top_management",
  "department_lead",
  "manager",
];

export const usePerformanceData = (selectedMonth, selectedDepartment) => {
  const { user } = useAuth();
  const [data, setData] = useState({
    myCard: null,
    mySummary: null,
    myMonthlyScores: [],
    subordinates: [],
    departments: [],
  });
  const [loading, setLoading] = useState(true);

  const canEvaluate = user && managerialRoles.includes(user.role);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const requests = [
        performanceAPI.getMyPerformanceCard(selectedMonth),
        performanceAPI.getPerformanceSummary(user.id, selectedMonth),
        performanceAPI.getMonthlyScores(user.id, selectedMonth),
      ];

      if (canEvaluate) {
        requests.push(
          performanceAPI.getEvaluableUsers(selectedMonth, selectedDepartment)
        );
      }

      if (user.role === "admin") {
        requests.push(performanceAPI.getDepartments());
      }

      const results = await Promise.all(requests);

      const [
        myCardRes,
        mySummaryRes,
        myScoresRes,
        subordinatesRes,
        departmentsRes,
      ] = results;

      const sortedSubordinates =
        canEvaluate && subordinatesRes
          ? [...subordinatesRes.data].sort((a, b) => {
              const aHasEval = !!a.selected_month_evaluation;
              const bHasEval = !!b.selected_month_evaluation;
              return aHasEval - bHasEval;
            })
          : [];

      setData({
        myCard: myCardRes.data,
        mySummary: mySummaryRes.data.averages,
        myMonthlyScores: myScoresRes.data,
        subordinates: sortedSubordinates,
        departments: departmentsRes ? departmentsRes.data : data.departments,
      });
    } catch (error) {
      message.error("Məlumatlar yüklənərkən xəta baş verdi.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedMonth, selectedDepartment, canEvaluate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, loading, canEvaluate, refetchData: fetchData };
};
