// src/components/ClassList.jsx
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import AddClassForm from "./AddClassForm";
import ClassItem from "./ClassItem";

export default function ClassList() {
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    const q = query(collection(db, "classes"), orderBy("name")); // urutkan berdasarkan name (ascending)
    const snapshot = await getDocs(q);
    const classData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setClasses(classData);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Manajemen Kelas</h2>
      <AddClassForm onClassAdded={fetchClasses} />
      <ul className="space-y-2">
        {classes.map((cls) => (
          <ClassItem
            key={cls.id}
            id={cls.id}
            name={cls.name}
            onDelete={fetchClasses}
          />
        ))}
      </ul>
    </div>
  );
}
