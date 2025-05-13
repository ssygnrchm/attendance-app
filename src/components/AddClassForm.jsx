// src/components/AddClassForm.jsx
import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddClassForm({ onClassAdded }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const docRef = await addDoc(collection(db, "classes"), { name });
    onClassAdded(); // refresh list
    setName("");
  };

  // Let's say you have a form or a button to add a new attendee
  async function addNewAttendee(name) {
    try {
      // Get a reference to the 'attendees' collection
      const docRef = await addDoc(collection(db, "classes"), {
        name: name,
      });

      console.log("Document written with ID: ", docRef.id);
      onClassAdded(); // refresh list
      setName("");
      // You can do something with docRef.id here, maybe update your UI
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <form onSubmit={addNewAttendee} className="flex gap-2 mb-4">
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
