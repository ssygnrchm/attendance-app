import { useState } from "react";
import ClassSelector from "./students/ClassSelector";
import DateSelector from "./attendances/DateSelector";
import AttendanceGrid from "./attendances/AttendanceGrid";
import SaveAttendanceButton from "./attendances/SaveAttendanceButton";

export default function AttendancePage() {
  const [selectedClassId, setSelectedClassId] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendance, setAttendance] = useState({});

  return (
    <div className="bg-white shadow rounded-xl p-6 flex flex-col space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-400 bg-clip-text text-transparent">
        Pencatatan Absensi Harian
      </h1>

      <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-6 shadow-sm space-y-4">
        <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
        <ClassSelector
          selectedClassId={selectedClassId}
          onChange={setSelectedClassId}
          title={"Pilih Kelas"}
        />
      </div>

      <AttendanceGrid
        classId={selectedClassId[0]}
        selectedDate={selectedDate}
        attendance={attendance}
        setAttendance={setAttendance}
      />

      <SaveAttendanceButton
        selectedDate={selectedDate}
        classId={selectedClassId}
        attendance={attendance}
      />
    </div>
  );
}
