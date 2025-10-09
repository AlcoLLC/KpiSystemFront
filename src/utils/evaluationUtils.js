export const getScoreDescription = (score, isSelfEval) => {
  const thresholds = isSelfEval
    ? { low: 3, mid: 6, high: 8 }
    : { low: 30, mid: 60, high: 80 };

  if (score <= thresholds.low) {
    return { text: "🔴 Performans yaxşılaşdırılmalıdır", className: "text-red-600" };
  }
  if (score <= thresholds.mid) {
    return { text: "🟡 Orta performans", className: "text-yellow-600" };
  }
  if (score <= thresholds.high) {
    return { text: "🔵 Yaxşı performans", className: "text-blue-600" };
  }
  return { text: "🟢 Əla performans", className: "text-green-600" };
};