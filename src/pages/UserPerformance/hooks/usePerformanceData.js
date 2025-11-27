import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import useAuth from "../../../hooks/useAuth";
import performanceAPI from "../../../api/performanceAPI";
import accountsApi from "../../../api/accountsApi";

const managerialRoles = [
  "admin",
  'ceo',
  "top_management",
  "department_lead",
  "manager",
];

export const usePerformanceData = (
  selectedMonth,
  selectedDepartment,
  evaluationStatus 
) => {
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
        console.log("API'yə göndərilən departament ID:", selectedDepartment);
        requests.push(
          performanceAPI.getEvaluableUsers(
            selectedMonth,
            selectedDepartment,
            evaluationStatus 
          )
        );
      }

      if (user.role === "admin") {
        requests.push(accountsApi.getDepartments());
      }

      const results = await Promise.all(requests);

      const [
        myCardRes,
        mySummaryRes,
        myScoresRes,
        subordinatesRes,
        departmentsRes,  
      ] = results;

      const updatedSubordinates = canEvaluate && subordinatesRes ? subordinatesRes.data : [];
      console.log("FİLTRLƏNMİŞ CAVAB:", subordinatesRes.data);
      console.log("STATE'Ə YAZILAN İŞÇİ SİYAHISI:", updatedSubordinates);

      setData({
        myCard: myCardRes.data,
        mySummary: mySummaryRes.data.averages,
        myMonthlyScores: myScoresRes.data,
        subordinates: updatedSubordinates,
        departments: departmentsRes ? departmentsRes.data : data.departments,
      });
    } catch (error) {
      message.error("Məlumatlar yüklənərkən xəta baş verdi.");
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedMonth, selectedDepartment, canEvaluate, evaluationStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, loading, canEvaluate, refetchData: fetchData };
};