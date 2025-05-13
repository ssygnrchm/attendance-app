// src/components/AddClassForm.jsx
import { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddClassForm({ onClassAdded }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!name.trim()) return;

    try {
      // Add document to Firestore
      const docRef = await addDoc(collection(db, "classes"), {
        name: name.toUpperCase(),
      });

      console.log("Document written with ID: ", docRef.id);
      onClassAdded(); // Refresh class list
      setName(""); // Reset input field
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama kelas (misal: Grade 1)"
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 rounded">
        Tambah
      </button>
    </form>
  );
}
