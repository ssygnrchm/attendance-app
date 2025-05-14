import { useState } from "react";
import ClassSelector from "./students/ClassSelector";
import DateSelector from "./attendances/DateSelector";
import AttendanceGrid from "./attendances/AttendanceGrid";
import SaveAttendanceButton from "./attendances/SaveAttendanceButton";

export default function AttendancePage() {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendance, setAttendance] = useState({});

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pencatatan Absensi Harian</h1>
      <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
      <ClassSelector
        selectedClassId={selectedClassId}
        onChange={setSelectedClassId}
      />
      <AttendanceGrid
        classId={selectedClassId}
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
