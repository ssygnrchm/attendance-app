import { useState, useEffect } from "react";
import MonthSelector from "./reports/MonthSelector";
import ClassSelector from "./students/ClassSelector";
import MonthlyReportTable from "./reports/MonthlyReportTable";
import ExportCSVButton from "./reports/ExportCSVButton";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

export default function MonthlyReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [showExport, setShowExport] = useState(false);
  // const fetchClasses = async () => {
  //   const q = query(collection(db, "classes"), orderBy("name"));
  //   const snapshot = await getDocs(q);
  //   const classList = snapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     // ...doc.data(),
  //   }));
  //   setSelectedClassIds(classList);
  // };
  // fetchClasses();

  // console.log(selectedClassIds);

  // Effect to check if we have data to show the export button
  useEffect(() => {
    setShowExport(reportData.length > 0);
  }, [reportData]);

  return (
    <div className="min-h-screen bg-white shadow rounded-xl p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-start mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-400 bg-clip-text text-transparent">
            Laporan Absensi Bulanan
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">
            Kelola data siswa dengan mudah dan efisien
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Class Selection & Add Student */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-4 sm:p-6 shadow-sm">
              <MonthSelector
                selectedMonth={selectedMonth}
                onChange={setSelectedMonth}
              />
              <br />
              {/* <ClassSelector
                selectedClassId={selectedClassIds}
                onChange={setSelectedClassIds}
                multiple={true}
              /> */}
            </div>
          </div>

          {/* Right Column - Student List */}
          <div className="lg:col-span-2 lg:order-last">
            <MonthlyReportTable
              // classIds={selectedClassIds}
              selectedMonth={selectedMonth}
              setData={setReportData}
            />
            {showExport && (
              <ExportCSVButton data={reportData} month={selectedMonth} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
