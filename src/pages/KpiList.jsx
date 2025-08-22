export default function KpiList() {
  const data = [
    {
      id: 1,
      name: "Revenue Growth",
      target: "15%",
      current: "12%",
      status: "On Track",
    },
    {
      id: 2,
      name: "Customer Satisfaction",
      target: "90%",
      current: "85%",
      status: "At Risk",
    },
    {
      id: 3,
      name: "Employee Retention",
      target: "95%",
      current: "92%",
      status: "On Track",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">KPI List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">ID</th>
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Target</th>
              <th className="px-4 py-2 text-left border-b">Current</th>
              <th className="px-4 py-2 text-left border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((kpi) => (
              <tr key={kpi.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{kpi.id}</td>
                <td className="px-4 py-2 border-b">{kpi.name}</td>
                <td className="px-4 py-2 border-b">{kpi.target}</td>
                <td className="px-4 py-2 border-b">{kpi.current}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      kpi.status === "On Track"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {kpi.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
