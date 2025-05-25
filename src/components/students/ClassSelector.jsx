import { useEffect, useRef, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";
import { ChevronDown } from "lucide-react";

export default function ClassSelector({
  selectedClassId,
  onChange,
  multiple = false,
}) {
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSelectAll = () => {
    if (selectedClassId.length === classes.length) {
      onChange([]);
    } else {
      onChange(classes.map((cls) => cls.id));
    }
  };

  const handleCheckboxChange = (id) => {
    const current = selectedClassId || [];
    if (current.includes(id)) {
      onChange(current.filter((clsId) => clsId !== id));
    } else {
      onChange([...current, id]);
    }
  };

  const handleSingleSelect = (id) => {
    onChange(id);
    setOpen(false);
  };

  const renderLabel = () => {
    if (multiple) {
      if (!selectedClassId || selectedClassId.length === 0)
        return "Pilih Kelas";
      const selectedNames = classes
        .filter((cls) => selectedClassId.includes(cls.id))
        .map((cls) => cls.name);
      return selectedNames.join(", ");
    } else {
      const selected = classes.find((cls) => cls.id === selectedClassId);
      return selected ? selected.name : "Pilih Kelas";
    }
  };

  return (
    <div ref={dropdownRef} className="relative mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Kelas
      </label>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center border border-gray-300 rounded px-3 py-2 bg-white hover:bg-gray-50"
      >
        <span className="text-sm text-gray-700">{renderLabel()}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-64 overflow-y-auto">
          {multiple ? (
            <div className="p-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-blue-600 underline mb-2"
              >
                {selectedClassId.length === classes.length
                  ? "Hapus Semua"
                  : "Pilih Semua"}
              </button>
              {classes.map((cls) => (
                <label
                  key={cls.id}
                  className="block text-sm px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedClassId.includes(cls.id)}
                    onChange={() => handleCheckboxChange(cls.id)}
                  />
                  {cls.name}
                </label>
              ))}
            </div>
          ) : (
            <div className="p-2">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="text-sm px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
                  onClick={() => handleSingleSelect(cls.id)}
                >
                  {cls.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
