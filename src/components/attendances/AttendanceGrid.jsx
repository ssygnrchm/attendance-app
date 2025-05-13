import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import StudentRow from "./StudentRow";

export default function AttendanceGrid({
  classId,
  selectedDate,
  attendance,
  setAttendance,
}) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!classId) return;

    const fetchStudents = async () => {
      const q = query(
        collection(db, "students"),
        where("classId", "==", classId)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(list);

      // Default: semua hadir
      const defaultAttendance = {};
      list.forEach((s) => {
        defaultAttendance[s.id] = attendance[s.id] || "Present";
      });
      setAttendance(defaultAttendance);
    };

    fetchStudents();
  }, [classId, selectedDate]);

  const handleStatusChange = (studentId, newStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: newStatus,
    }));
  };

  if (!classId || !selectedDate) return null;

  return (
    <table className="w-full text-left border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Nama</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <StudentRow
            key={student.id}
            student={student}
            status={attendance[student.id] || "Present"}
            onStatusChange={handleStatusChange}
          />
        ))}
      </tbody>
    </table>
  );
}
