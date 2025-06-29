import { useState } from "react";
import ClassSelector from "./students/ClassSelector";
import DateSelector from "./attendances/DateSelector";
import AttendanceSwipeCards from "./attendances/AttendanceSwipeCards";
import SaveAttendanceButton from "./attendances/SaveAttendanceButton";

export default function AttendancePage() {
  const [selectedClassId, setSelectedClassId] = useState("");
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [attendance, setAttendance] = useState({});

  return (
    <div className="min-h-screen bg-white shadow rounded-xl p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="text-start mb-6 sm:mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-400 bg-clip-text text-transparent">
            Pencatatan Absensi Harian
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* left column */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-4 sm:p-6 shadow-sm">
              <DateSelector
                selectedDate={selectedDate}
                onChange={setSelectedDate}
              />
              <ClassSelector
                selectedClassId={selectedClassId}
                onChange={setSelectedClassId}
                title={"Pilih Kelas"}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 order-first lg:order-last">
            <AttendanceSwipeCards
              classId={selectedClassId}
              selectedDate={selectedDate}
              attendance={attendance}
              setAttendance={setAttendance}
            />
          </div>
        </div>
      </div>

      {/* <SaveAttendanceButton
        selectedDate={selectedDate}
        classId={selectedClassId}
        attendance={attendance}
      /> */}
    </div>
  );
}
