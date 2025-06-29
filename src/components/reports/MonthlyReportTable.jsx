import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "../../services/firebase";

export default function MonthlyReportTable({
  // classIds,
  selectedMonth,
  setData,
}) {
  const [reportData, setReportData] = useState([]);
  const [classNames, setClassNames] = useState({});
  const [classIds, setClassIds] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const q = query(collection(db, "classes"), orderBy("name"));
      const snapshot = await getDocs(q);
      const classList = snapshot.docs.map((doc) => ({
        id: doc.id,
        // ...doc.data(),
      }));
      snapshot.docs.forEach((doc) => {
        classNames[doc.id] = doc.data().name;
      });

      setClassIds(classList.map((cls) => cls.id));
      setClassNames(classNames);
    };
    fetchClasses();
  }, []);

  console.log(classIds);
  console.log(classNames);

  useEffect(() => {
    if (!selectedMonth || !classIds || classIds.length === 0) return;

    const fetchData = async () => {
      const start = `${selectedMonth}-01`;
      const end = `${selectedMonth}-31`;

      const allRecords = [];

      // Fetch attendance records for each selected class
      for (const classId of classIds) {
        console.log(classId);
        const q = query(
          collection(db, "attendanceRecords"),
          where("classId", "==", classId),
          where("date", ">=", start),
          where("date", "<=", end)
        );

        const snapshot = await getDocs(q);
        const classRecords = [];
        snapshot.forEach((doc) => classRecords.push(doc.data()));
        allRecords.push(...classRecords);
      }

      const studentStats = {};
      allRecords.forEach((record) => {
        record.records.forEach(({ studentId, status }) => {
          if (!studentStats[studentId]) {
            studentStats[studentId] = {
              Present: 0,
              Absent: 0,
              Excused: 0,
              classId: record.classId,
            };
          }
          studentStats[studentId][status]++;
        });
      });

      // Fetch student information
      const studentIds = Object.keys(studentStats);
      const studentData = {};

      for (const studentId of studentIds) {
        try {
          const studentDocRef = doc(db, "students", studentId);
          const studentDoc = await getDoc(studentDocRef);
          if (studentDoc.exists()) {
            const studentInfo = studentDoc.data();
            studentData[studentId] = {
              name: studentInfo.name,
              classId: studentInfo.classId,
            };
            console.log(
              `Student ${studentId} belongs to class: ${studentInfo.classId}`
            );
          }
        } catch (error) {
          console.error(`Error fetching student ${studentId}:`, error);
        }
      }

      // Use the class names we fetched above, not the state variable which might not be updated yet
      const tableData = studentIds.map((id) => {
        // Use the classId from studentData if available, otherwise fall back to the one from attendance record
        const studentClassId =
          studentData[id]?.classId || studentStats[id].classId;
        const className = classNames[studentClassId];

        console.log(
          `Student ${id}: classId=${studentClassId}, className=${
            className || "Not found"
          }`
        );

        return {
          id,
          name: studentData[id]?.name || "Tidak diketahui",
          classId: studentClassId,
          className: className || "Tidak diketahui",
          ...studentStats[id],
        };
      });

      setReportData(tableData);

      // Pass the data to parent component for CSV export
      setData(tableData);
    };

    fetchData();
  }, [classIds, selectedMonth, setData]);

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Nama Siswa
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Kelas
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Hadir
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Absen
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Izin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reportData.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{s.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {s.className}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 bg-blue-100 text-gray-800 rounded-full text-sm font-medium">
                    {s.Present}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 bg-red-100 text-gray-800 rounded-full text-sm font-medium">
                    {s.Absent}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 bg-yellow-100 text-gray-800 rounded-full text-sm font-medium">
                    {s.Excused}
                  </span>
                </td>
              </tr>
            ))}
            {reportData.length === 0 && (
              <tr>
                <td
                  className="hover:bg-gray-50 transition-colors duration-150 text-center py-2 text-gray-400"
                  colSpan="5"
                >
                  Tidak ada data untuk bulan yang dipilih
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
