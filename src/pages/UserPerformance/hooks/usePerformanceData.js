import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import useAuth from "../../../hooks/useAuth";
import performanceAPI from "../../../api/performanceAPI";

const managerialRoles = [
  "admin",
  "top_management",
  "department_lead",
  "manager",
];

// DƏYİŞDİRİLDİ: Hook artıq üçüncü parametr olaraq "evaluationStatus"-u qəbul edir
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
      // Bu sorğular həmişə icra olunur
      const requests = [
        performanceAPI.getMyPerformanceCard(selectedMonth),
        performanceAPI.getPerformanceSummary(user.id, selectedMonth),
        performanceAPI.getMonthlyScores(user.id, selectedMonth),
      ];

      // Rəhbər və ya admin üçün tabeliyində olanları gətirən sorğu
      if (canEvaluate) {
        requests.push(
          // DƏYİŞDİRİLDİ: API sorğusuna yeni "evaluationStatus" parametri ötürülür
          performanceAPI.getEvaluableUsers(
            selectedMonth,
            selectedDepartment,
            evaluationStatus 
          )
        );
      }

      // Yalnız admin üçün departamentləri gətirən sorğu
      if (user.role === "admin") {
        requests.push(performanceAPI.getDepartments());
      }

      const results = await Promise.all(requests);

      // Nəticələri ardıcıllığa uyğun olaraq ayırırıq
      const [
        myCardRes,
        mySummaryRes,
        myScoresRes,
        subordinatesRes, // Bu, yalnız "canEvaluate" true olduqda mövcud olacaq
        departmentsRes,  // Bu, yalnız admin olduqda mövcud olacaq
      ] = results;

      // DƏYİŞDİRİLDİ: Client-side çeşidləmə ləğv edildi.
      // Artıq filtrləmə və çeşidləmə backend tərəfindən idarə olunur.
      const updatedSubordinates = canEvaluate && subordinatesRes ? subordinatesRes.data : [];

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
  // DƏYİŞDİRİLDİ: "evaluationStatus" asılılıq (dependency) siyahısına əlavə edildi
  }, [user, selectedMonth, selectedDepartment, canEvaluate, evaluationStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...data, loading, canEvaluate, refetchData: fetchData };
};