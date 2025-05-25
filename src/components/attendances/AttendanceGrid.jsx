import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import StudentRow from "./StudentRow";

export default function AttendanceGrid({
  classId,
  selectedDate,
  attendance,
  setAttendance,
}) {
  const [students, setStudents] = useState([]);
  const [className, setClassName] = useState("");

  useEffect(() => {
    if (!classId) return;

    const fetchData = async () => {
      // Fetch class name
      try {
        const classDocRef = doc(db, "classes", classId);
        const classDocSnap = await getDoc(classDocRef);
        if (classDocSnap.exists()) {
          setClassName(classDocSnap.data().name);
        }
      } catch (error) {
        console.error("Error fetching class details:", error);
      }

      // Fetch students
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

    fetchData();
  }, [classId, selectedDate]);

  const handleStatusChange = (studentId, newStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: newStatus,
    }));
  };

  if (!classId || !selectedDate) return null;

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">
        Kelas: {className || classId}
      </h3>
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
              className={className}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
