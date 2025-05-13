import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function AddStudentForm({ classId, onStudentAdded }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");

  function toPascalCase(str) {
    return str
      .toLowerCase()
      .split(/[\s_\-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !gender) return alert("Nama dan jenis kelamin harus diisi.");

    try {
      await addDoc(collection(db, "students"), {
        name: toPascalCase(name),
        gender: gender,
        classId: classId,
      });
      setName("");
      setGender("");
      onStudentAdded();
    } catch (err) {
      console.error("Gagal menambahkan siswa:", err);
      alert("Terjadi kesalahan saat menambahkan siswa.");
    }
  };

  if (!classId) return null;

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Tambah Siswa</h3>
      <input
        type="text"
        placeholder="Nama siswa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      >
        <option value="">-- Jenis Kelamin --</option>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tambah Siswa
      </button>
    </form>
  );
}
