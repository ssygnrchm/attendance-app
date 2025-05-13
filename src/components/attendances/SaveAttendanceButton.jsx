import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function SaveAttendanceButton({
  selectedDate,
  classId,
  attendance,
}) {
  const handleSave = async () => {
    if (!selectedDate || !classId)
      return alert("Tanggal dan kelas harus dipilih");

    const record = {
      date: selectedDate,
      classId,
      records: Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
      })),
    };

    const docId = `${classId}_${selectedDate}`;
    try {
      await setDoc(doc(db, "attendanceRecords", docId), record);
      alert("Absensi berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan absensi:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };

  return (
    <button
      onClick={handleSave}
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Simpan Absensi
    </button>
  );
}
