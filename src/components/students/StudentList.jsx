import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function StudentList({ classIds }) {
  const [students, setStudents] = useState([]);
  const [classNames, setClassNames] = useState({});

  const fetchStudents = async () => {
    if (!classIds || classIds.length === 0) return;

    try {
      // First fetch all class names to display them
      const classesSnapshot = await getDocs(collection(db, "classes"));
      const classNamesMap = {};
      classesSnapshot.docs.forEach((doc) => {
        classNamesMap[doc.id] = doc.data().name;
      });
      setClassNames(classNamesMap);

      // Fetch students from selected classes
      if (Array.isArray(classIds)) {
        if (classIds.length === 1) {
          // Single class selected
          const q = query(
            collection(db, "students"),
            where("classId", "==", classIds[0]),
            orderBy("name")
          );
          const snapshot = await getDocs(q);
          const studentList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            className: classNamesMap[doc.data().classId] || "Unknown Class",
          }));
          setStudents(studentList);
        } else {
          // Multiple classes selected - need to use a different approach
          const studentList = [];
          for (const classId of classIds) {
            const q = query(
              collection(db, "students"),
              where("classId", "==", classId),
              orderBy("name")
            );
            const snapshot = await getDocs(q);
            const classStudents = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              className: classNamesMap[doc.data().classId] || "Unknown Class",
            }));
            studentList.push(...classStudents);
          }

          // Sort combined list by name
          studentList.sort((a, b) => a.name.localeCompare(b.name));
          setStudents(studentList);
        }
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDelete = async (studentId, studentName) => {
    const confirm = window.confirm(
      `Yakin ingin menghapus siswa "${studentName}"?`
    );
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "students", studentId));
      fetchStudents(); // Refresh list after deletion
    } catch (err) {
      console.error("Gagal menghapus pelajar:", err);
      alert("Terjadi kesalahan saat menghapus pelajar.");
    }
  };

  const handleEdit = async (
    studentId,
    studentName,
    studentGender,
    studentClass
  ) => {
    e.preventDefault();
    if (!studentName || !studentGender || !studentClass)
      return alert("Nama, jenis kelamin, dan kelas harus diisi.");

    try {
      const studentRef = doc(db, "students", studentId); // gunakan ID siswa yang akan diupdate
      const qClass = query(
        collection(db, "classes"),
        where("name", "==", studentClass)
      );
      const querySnapshot = await getDocs(qClass);

      const classRef = querySnapshot.docs[0];

      await updateDoc(studentRef, {
        name: toPascalCase(studentName),
        gender: studentGender,
        classId: classRef.classId,
      });

      // setName("");
      // setGender("");
      // onStudentUpdated(); // panggil fungsi refresh list atau tutup form
    } catch (err) {
      console.error("Gagal memperbarui siswa:", err);
      alert("Terjadi kesalahan saat memperbarui data siswa.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [classIds]);

  if (!classIds || classIds.length === 0) {
    return (
      <p className="text-gray-500">Silakan pilih kelas terlebih dahulu.</p>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Daftar Siswa</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left border">Nama</th>
            <th className="p-2 text-left border">Jenis Kelamin</th>
            <th className="p-2 text-left border">Kelas</th>
            <th className="p-2 text-left border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="p-2 border">{student.name}</td>
              <td className="p-2 border">{student.gender}</td>
              <td className="p-2 border">{student.className}</td>
              <td className="p-2 border">
                <button
                  // onClick={() =>
                  //   handleEdit(
                  //     student.id,
                  //     student.name,
                  //     student.gender,
                  //     student.className
                  //   )
                  // } // ganti sesuai fungsi edit kamu
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => handleDelete(student.id, student.name)}
                  className="text-red-600 hover:text-red-800"
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="4" className="p-2 text-center text-gray-400">
                Belum ada siswa di kelas yang dipilih.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
