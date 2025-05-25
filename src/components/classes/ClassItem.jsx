// src/components/ClassItem.jsx
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function ClassItem({ id, name, onDelete }) {
  const handleDelete = async () => {
    const confirm = window.confirm(`Yakin ingin menghapus kelas "${name}"?`);
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "classes", id));
      onDelete(); // Trigger refresh list
    } catch (err) {
      console.error("Gagal menghapus kelas:", err);
      alert("Terjadi kesalahan saat menghapus kelas.");
    }
  };

  return (
    <li className="flex items-center justify-between border p-3 rounded bg-white shadow-sm hover:bg-gray-50">
      <span>{name}</span>
      <button
        onClick={handleDelete}
        className="text-sm text-red-600 hover:underline"
      >
        Hapus
      </button>
    </li>
  );
}

// export default function ClassItem({ id, name, onDelete }) {
//   const handleDelete = async () => {
//     const confirm = window.confirm(`Yakin ingin menghapus kelas "${name}"?`);
//     if (!confirm) return;

//     try {
//       await deleteDoc(doc(db, 'classes', id));
//       onDelete(); // Trigger refresh list
//     } catch (err) {
//       console.error('Gagal menghapus kelas:', err);
//       alert('Terjadi kesalahan saat menghapus kelas.');
//     }
//   };

//   return (
//     <li className="flex items-center justify-between border p-3 rounded bg-white shadow-sm hover:bg-gray-50">
//       <span>{name}</span>
//       <button
//         onClick={handleDelete}
//         className="text-sm text-red-600 hover:underline"
//       >
//         Hapus
//       </button>
//     </li>
//   );
// }
