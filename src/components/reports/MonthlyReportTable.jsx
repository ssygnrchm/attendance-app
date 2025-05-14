import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function MonthlyReportTable({
  classIds,
  selectedMonth,
  setData,
}) {
  const [reportData, setReportData] = useState([]);
  const [classNames, setClassNames] = useState({});

  useEffect(() => {
    if (!selectedMonth || !classIds || classIds.length === 0) return;

    const fetchData = async () => {
      // Variable to store class names
      let classNamesMap = {};

      // First fetch all class names
      try {
        console.log("Fetching class names from Firestore...");
        const classesSnapshot = await getDocs(collection(db, "classes"));

        classesSnapshot.docs.forEach((doc) => {
          classNamesMap[doc.id] = doc.data().name;
        });

        console.log("Class names retrieved:", classNamesMap);
        setClassNames(classNamesMap);
      } catch (error) {
        console.error("Error fetching class names:", error);
      }

      const start = `${selectedMonth}-01`;
      const end = `${selectedMonth}-31`;

      const allRecords = [];

      // Fetch attendance records for each selected class
      for (const classId of classIds) {
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
        const className = classNamesMap[studentClassId];

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
    <table className="w-full border mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Nama Siswa</th>
          <th className="p-2 text-left">Kelas</th>
          <th className="p-2 text-left">Hadir</th>
          <th className="p-2 text-left">Absen</th>
          <th className="p-2 text-left">Izin</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((s) => (
          <tr key={s.id} className="border-t">
            <td className="p-2">{s.name}</td>
            <td className="p-2">{s.className}</td>
            <td className="p-2">{s.Present}</td>
            <td className="p-2">{s.Absent}</td>
            <td className="p-2">{s.Excused}</td>
          </tr>
        ))}
        {reportData.length === 0 && (
          <tr>
            <td className="p-2 text-gray-500" colSpan="5">
              Tidak ada data untuk bulan yang dipilih
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
