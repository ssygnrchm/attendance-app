import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function ClassSelector({
  selectedClassId,
  onChange,
  multiple = false, // default: single select
}) {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const q = query(collection(db, "classes"), orderBy("name"));
      const snapshot = await getDocs(q);
      const classList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClasses(classList);
    };
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    if (multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      onChange(selectedOptions); // array of selected class IDs
    } else {
      onChange(e.target.value); // single selected class ID
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Pilih Kelas
      </label>
      <select
        multiple={multiple}
        value={selectedClassId}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded h-32"
      >
        {!multiple && <option value="">-- Pilih Kelas --</option>}
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>
    </div>
  );
}
