import { useEffect, useRef, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";
import { BookOpen, X } from "lucide-react";

export default function ClassSelector({
  selectedClassId,
  onChange,
  title,
  isIcon = false,
  multiple = false,
}) {
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  //const buttonRef = useRef(null); // 🔥 ref untuk tombol

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (classId) => {
    if (multiple) {
      const current = selectedClassId || [];
      if (current.includes(classId)) {
        onChange(current.filter((id) => id !== classId));
      } else {
        onChange([...current, classId]);
      }
    } else {
      onChange([classId]);
      setOpen(false);
    }
  };

  const getDisplayText = () => {
    if (!selectedClassId || selectedClassId.length === 0) return "Pilih Kelas";
    const selectedNames = classes
      .filter((cls) => selectedClassId.includes(cls.id))
      .map((cls) => cls.name);
    return selectedNames.join(", ");
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
        {isIcon ? <BookOpen className="inline w-4 h-4 mr-1" /> : null}
        {title}
      </label>

      <button
        // 🔥 pasang ref ke tombol
        onClick={() => setOpen(!open)}
        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-left hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 flex items-center justify-between"
      >
        <span
          className={`truncate ${
            getDisplayText() != "Pilih Kelas" ? "text-black" : "text-gray-400"
          }`}
        >
          {getDisplayText()}
        </span>
        {multiple && selectedClassId?.length > 0 && (
          <X
            className="w-4 h-4 text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation(); // cegah toggle dropdown saat klik ikon X
              onChange([]);
            }}
            title="Hapus semua filter"
          />
        )}
      </button>

      {open && (
        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {classes.map((cls) => (
            <div
              key={cls.id}
              onClick={() => handleSelect(cls.id)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <span className="font-semibold text-gray-700">{cls.name}</span>
              {selectedClassId?.includes(cls.id) && (
                <span className="float-right text-blue-500">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
