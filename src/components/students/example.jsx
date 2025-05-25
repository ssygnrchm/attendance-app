import { useEffect, useState } from "react";
import { Users, UserPlus, BookOpen, AlertCircle } from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";

const toPascalCase = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export default function StudentList({ classIds = [] }) {
  const [students, setStudents] = useState([]);
  const [classMap, setClassMap] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [classOptions, setClassOptions] = useState([]);

  const fetchClasses = async () => {
    const snapshot = await getDocs(collection(db, "classes"));
    const map = {};
    const options = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      map[doc.id] = data.name;
      options.push({ id: doc.id, name: data.name });
    });
    setClassMap(map);
    setClassOptions(options);
  };

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    let list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter berdasarkan classIds (jika tidak kosong)
    if (classIds.length > 0) {
      list = list.filter((student) => classIds.includes(student.classId));
    }

    const combined = list.map((student) => ({
      ...student,
      className: classMap[student.classId] || "Unknown",
    }));

    combined.sort((a, b) => {
      const classA = parseInt(a.className);
      const classB = parseInt(b.className);
      if (classA !== classB) return classA - classB;
      return a.name.localeCompare(b.name);
    });

    setStudents(combined);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (Object.keys(classMap).length > 0) {
      fetchStudents();
    }
  }, [classMap, classIds]);

  const handleDelete = async (studentId, studentName) => {
    const confirm = window.confirm(
      `Yakin ingin menghapus siswa "${studentName}"?`
    );
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "students", studentId));
      fetchStudents();
    } catch (err) {
      console.error("Gagal menghapus siswa:", err);
      alert("Terjadi kesalahan saat menghapus siswa.");
    }
  };

  const handleStartEdit = (student) => {
    setEditingId(student.id);
    setEditData({
      name: student.name,
      gender: student.gender,
      classId: student.classId,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    if (!editData.name || !editData.gender || !editData.classId) {
      alert("Semua field harus diisi.");
      return;
    }

    try {
      const studentRef = doc(db, "students", editingId);
      await updateDoc(studentRef, {
        name: toPascalCase(editData.name),
        gender: editData.gender,
        classId: editData.classId,
      });
      setEditingId(null);
      setEditData({});
      fetchStudents();
    } catch (err) {
      console.error("Gagal menyimpan perubahan:", err);
      alert("Terjadi kesalahan saat memperbarui data.");
    }
  };

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
              <td className="p-2 border">
                {editingId === student.id ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  student.name
                )}
              </td>
              <td className="p-2 border">
                {editingId === student.id ? (
                  <select
                    value={editData.gender}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="border px-2 py-1 rounded w-full"
                  >
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                ) : (
                  student.gender
                )}
              </td>
              <td className="p-2 border">
                {editingId === student.id ? (
                  <select
                    value={editData.classId}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        classId: e.target.value,
                      }))
                    }
                    className="border px-2 py-1 rounded w-full"
                  >
                    <option value="">Pilih Kelas</option>
                    {classOptions.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  student.className
                )}
              </td>
              <td className="p-2 border flex gap-2">
                {editingId === student.id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-800"
                      title="Simpan"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700"
                      title="Batal"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(student)}
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
                  </>
                )}
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="4" className="p-2 text-center text-gray-400">
                Belum ada siswa yang terdaftar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
