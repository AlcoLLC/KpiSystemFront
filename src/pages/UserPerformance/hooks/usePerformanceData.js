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

  const canEvaluate = user && (
    managerialRoles.includes(user.role) || 
    user.factory_role === "top_management"
  );

  const isFactoryTopManagement = user?.factory_role === "top_management";

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const requests = [];

      if (!isFactoryTopManagement) {
        requests.push(
          performanceAPI.getMyPerformanceCard(selectedMonth),
          performanceAPI.getPerformanceSummary(user.id, selectedMonth),
          performanceAPI.getMonthlyScores(user.id, selectedMonth)
        );
      }

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

      let resultIndex = 0;
      let myCardRes, mySummaryRes, myScoresRes, subordinatesRes, departmentsRes;

      if (!isFactoryTopManagement) {
        myCardRes = results[resultIndex++];
        mySummaryRes = results[resultIndex++];
        myScoresRes = results[resultIndex++];
      }

      if (canEvaluate) {
        subordinatesRes = results[resultIndex++];
      }

      if (user.role === "admin") {
        departmentsRes = results[resultIndex++];
      }

      const updatedSubordinates = canEvaluate && subordinatesRes ? subordinatesRes.data : [];
      console.log("FİLTRLƏNMİŞ CAVAB:", subordinatesRes?.data);
      console.log("STATE'Ə YAZILAN İŞÇİ SİYAHISI:", updatedSubordinates);

      setData({
        myCard: myCardRes?.data || null,
        mySummary: mySummaryRes?.data?.averages || null,
        myMonthlyScores: myScoresRes?.data || [],
        subordinates: updatedSubordinates,
        departments: departmentsRes ? departmentsRes.data : data.departments,
      });
    } catch (error) {
      if (isFactoryTopManagement && error.response?.status === 403) {
        console.log("Factory top management - own performance data not available (expected)");
        try {
          if (canEvaluate) {
            const subordinatesRes = await performanceAPI.getEvaluableUsers(
              selectedMonth,
              selectedDepartment,
              evaluationStatus
            );
            setData(prev => ({
              ...prev,
              subordinates: subordinatesRes.data || []
            }));
          }
        } catch (subError) {
          console.error("Error fetching subordinates:", subError);
        }
      } else {
        message.error("Məlumatlar yüklənərkən xəta baş verdi.");
        console.error("Error fetching performance data:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [user, selectedMonth, selectedDepartment, canEvaluate, evaluationStatus, isFactoryTopManagement]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, loading, canEvaluate, refetchData: fetchData };
};