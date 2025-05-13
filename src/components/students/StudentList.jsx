import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function StudentList({ classId }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!classId) return;

    const fetchStudents = async () => {
      const q = query(
        collection(db, "students"),
        where("classId", "==", classId)
      );
      const snapshot = await getDocs(q);
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    };

    fetchStudents();
  }, [classId]);

  if (!classId) {
    return (
      <p className="text-gray-500">Silakan pilih kelas terlebih dahulu.</p>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Daftar Siswa</h3>
      <ul className="space-y-2">
        {students.map((student) => (
          <li
            key={student.id}
            className="p-2 border rounded shadow-sm bg-white"
          >
            {student.name}{" "}
            <span className="text-sm text-gray-500">({student.gender})</span>
          </li>
        ))}
        {students.length === 0 && (
          <li className="text-sm text-gray-400">
            Belum ada siswa di kelas ini.
          </li>
        )}
      </ul>
    </div>
  );
}
