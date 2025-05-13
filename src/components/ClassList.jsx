// src/components/ClassList.jsx
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import AddClassForm from './AddClassForm';

export default function ClassList() {
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    const snapshot = await getDocs(collection(db, 'classes'));
    const classData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
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
        {classes.map(cls => (
          <li key={cls.id} className="border p-2 rounded bg-gray-100">
            {cls.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
