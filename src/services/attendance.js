import { setDoc } from "firebase/firestore";
import { db } from "./firebase";

const handleSave = async (selectedDate, classId, attendance) => {
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