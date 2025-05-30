import { useEffect, useState } from "react";
import { Users, Pencil, Trash2, Check, X } from "lucide-react";
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

export default function StudentList({ classIds = [], searchKeyword = "" }) {
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

    // Filter berdasarkan keyword pencarian
    if (searchKeyword) {
      const keywordLower = searchKeyword.toLowerCase();
      list = list.filter((student) =>
        student.name.toLowerCase().includes(keywordLower)
      );
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
  }, [classMap, classIds, searchKeyword]);

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
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center">
          <Users className="w-6 h-6 text-gray-700 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">Daftar Siswa</h3>
          <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {students.length} siswa
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Jenis Kelamin
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Kelas
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student, index) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {student.name.charAt(0)}
                    </div>
                    {editingId === student.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="bg-gray-100 text-gray-900 font-medium px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="font-medium text-gray-900">
                        {student.name}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {editingId === student.id ? (
                    <select
                      value={editData.gender}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className={`inline-flex px-3 py-2 rounded-lg text-sm font-medium ${
                        editData.gender === "Laki-laki"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      <option
                        value="Laki-laki"
                        className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        Laki-laki
                      </option>
                      <option
                        value="Perempuan"
                        className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800"
                      >
                        Perempuan
                      </option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        student.gender === "Laki-laki"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {student.gender}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === student.id ? (
                    <select
                      value={editData.classId}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          classId: e.target.value,
                        }))
                      }
                      className="bg-gray-100 text-gray-900 font-medium px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kelas</option>
                      {classOptions.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {student.className}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {editingId === student.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-800 font-medium text-sm hover:underline"
                          title="Simpan"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700 font-medium text-sm hover:underline"
                          title="Batal"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(student)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm hover:underline"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
