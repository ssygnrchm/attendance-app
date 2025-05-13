// src/components/ClassItem.jsx
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function StudentItem({ id, name, gender, onDelete }) {
  const handleDelete = async () => {
    const confirm = window.confirm(`Yakin ingin menghapus kelas "${name}"?`);
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "students", id));
      onDelete(); // Trigger refresh list
    } catch (err) {
      console.error("Gagal menghapus pelajar:", err);
      alert("Terjadi kesalahan saat menghapus pelajar.");
    }
  };

  return (
    <li className="flex items-center justify-between border p-2 rounded bg-white shadow-sm hover:bg-gray-50">
      <span>
        {name} <span className="text-sm text-gray-500">({gender})</span>
      </span>
      <button
        onClick={handleDelete}
        className="text-sm text-red-600 hover:underline"
      >
        Hapus
      </button>
    </li>
  );
}
