import { useState } from "react";
import MonthSelector from "./reports/MonthSelector";
import ClassSelector from "./students/ClassSelector";
import MonthlyReportTable from "./reports/MonthlyReportTable";
import ExportCSVButton from "./reports/ExportCSVButton";

export default function MonthlyReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [reportData, setReportData] = useState([]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Laporan Absensi Bulanan</h1>
      <MonthSelector
        selectedMonth={selectedMonth}
        onChange={setSelectedMonth}
      />
      <ClassSelector
        selectedClassId={selectedClassId}
        onChange={setSelectedClassId}
      />
      <MonthlyReportTable
        classId={selectedClassId}
        selectedMonth={selectedMonth}
        setData={setReportData}
      />
      {reportData.length > 0 && (
        <ExportCSVButton data={reportData} month={selectedMonth} />
      )}
    </div>
  );
}
