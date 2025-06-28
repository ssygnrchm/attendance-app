import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import ClassSelector from "./ClassSelector";
import { Users, UserPlus, BookOpen, AlertCircle } from "lucide-react";

export default function AddStudentForm({ onStudentAdded }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [classId, setClassId] = useState("");

  function toPascalCase(str) {
    return str
      .toLowerCase()
      .split(/[\s_\-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !gender || !classId)
      return alert("Nama, jenis kelamin, dan kelas harus diisi.");

    try {
      await addDoc(collection(db, "students"), {
        name: toPascalCase(name),
        gender: gender,
        classId: classId,
      });
      setName("");
      setGender("");
      setClassId("");
      onStudentAdded();
    } catch (err) {
      console.error("Gagal menambahkan siswa:", err);
      alert("Terjadi kesalahan saat menambahkan siswa.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <UserPlus className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-800">Tambah Siswa Baru</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Siswa
          </label>
          <input
            type="text"
            placeholder="Masukkan nama lengkap siswa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-left hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 flex items-center justify-between"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Jenis Kelamin
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={`w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-left hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 flex items-center justify-between ${
              gender === "" ? "text-gray-400" : "text-black"
            }`}
          >
            {gender != "" ? null : (
              <option value="">Pilih jenis kelamin</option>
            )}
            <option value="Laki-laki" className="text-black">
              Laki-laki
            </option>
            <option value="Perempuan" className="text-black">
              Perempuan
            </option>
          </select>
        </div>

        <div>
          <ClassSelector
            selectedClassId={classId}
            onChange={setClassId}
            title={"Kelas"}
          />
        </div>

        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <UserPlus className="inline w-5 h-5 mr-2" />
          Tambah Siswa
        </button>
      </div>
    </div>
  );
}
