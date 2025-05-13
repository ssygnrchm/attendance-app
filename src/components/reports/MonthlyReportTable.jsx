import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function MonthlyReportTable({ classId, selectedMonth }) {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    if (!classId || !selectedMonth) return;

    const fetchData = async () => {
      const start = `${selectedMonth}-01`;
      const end = `${selectedMonth}-31`;

      const q = query(
        collection(db, "attendanceRecords"),
        where("classId", "==", classId),
        where("date", ">=", start),
        where("date", "<=", end)
      );

      const snapshot = await getDocs(q);
      const rawData = [];
      snapshot.forEach((doc) => rawData.push(doc.data()));

      const studentStats = {};
      rawData.forEach((record) => {
        record.records.forEach(({ studentId, status }) => {
          if (!studentStats[studentId]) {
            studentStats[studentId] = { Present: 0, Absent: 0, Excused: 0 };
          }
          studentStats[studentId][status]++;
        });
      });

      // Ambil nama siswa
      const studentIds = Object.keys(studentStats);
      const studentDocs = await Promise.all(
        studentIds.map((id) =>
          getDocs(
            query(collection(db, "students"), where("__name__", "==", id))
          )
        )
      );

      const studentsMap = {};
      studentDocs.forEach((snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          studentsMap[doc.id] = doc.data().name;
        }
      });

      const tableData = studentIds.map((id) => ({
        id,
        name: studentsMap[id] || "Tidak diketahui",
        ...studentStats[id],
      }));

      setReportData(tableData);
    };

    fetchData();
  }, [classId, selectedMonth]);

  return (
    <table className="w-full border mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Nama Siswa</th>
          <th className="p-2 text-left">Hadir</th>
          <th className="p-2 text-left">Absen</th>
          <th className="p-2 text-left">Izin</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((s) => (
          <tr key={s.id} className="border-t">
            <td className="p-2">{s.name}</td>
            <td className="p-2">{s.Present}</td>
            <td className="p-2">{s.Absent}</td>
            <td className="p-2">{s.Excused}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
