import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";

export default function AttendanceSwipeCards({
  classId,
  selectedDate,
  attendance,
  setAttendance,
}) {
  const [students, setStudents] = useState([]);
  const [classLabel, setClassLabel] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // const [isDragging, setIsDragging] = useState(false);
  const [completedStudents, setCompletedStudents] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const cardRef = useRef(null);
  // const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!classId) return;

    const fetchData = async () => {
      // Fetch class name
      try {
        const classDocRef = doc(db, "classes", classId);
        const classDocSnap = await getDoc(classDocRef);
        if (classDocSnap.exists()) {
          setClassLabel(classDocSnap.data().name);
        }
      } catch (error) {
        console.error("Error fetching class details: " + error);
      }

      // Fetch students
      const q = query(
        collection(db, "students"),
        where("classId", "==", classId)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(list);

      // Reset indexes when class changes
      setCurrentIndex(0);
      setCompletedStudents(0);

      // Initialize attendance without default status
      const defaultAttendance = {};
      list.forEach((s) => {
        if (attendance[s.id]) {
          defaultAttendance[s.id] = attendance[s.id];
        }
      });
      setAttendance(defaultAttendance);
    };

    fetchData();
  }, [classId, selectedDate]);

  const handleSwipe = (direction, status) => {
    if (currentIndex >= students.length) return;

    const studentId = students[currentIndex].id;
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    setCurrentIndex((prev) => prev + 1);
    setCompletedStudents((prev) => prev + 1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setCompletedStudents((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < students.length - 1) {
      // Just move to next student without changing attendance
      setCurrentIndex((prev) => prev + 1);
      setCompletedStudents((prev) => prev + 1);
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedDate || !classId) {
      alert("Tanggal dan kelas harus dipilih");
      return;
    }

    // Check if all students have recorded attendance
    const unrecordedStudents = students.filter(
      (student) => !attendance[student.id]
    );
    if (unrecordedStudents.length > 0) {
      const unrecordedNames = unrecordedStudents.map((s) => s.name).join(", ");
      alert(
        `Masih ada ${unrecordedStudents.length} siswa yang belum dicatat kehadirannya: ${unrecordedNames}`
      );
      return;
    }

    setIsSaving(true);

    const record = {
      date: selectedDate,
      classId: classId,
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
    } finally {
      setIsSaving(false);
    }
  };

  // const handleMouseDown = (e) => {
  //   setIsDragging(true);
  //   startPosRef.current = { x: e.clientX, y: e.clientY };
  // };

  // const handleMouseMove = (e) => {
  //   if (!isDragging) return;

  //   const deltaX = e.clientX - startPosRef.current.x;
  //   const deltaY = e.clientY - startPosRef.current.y;
  //   setDragOffset({ x: deltaX, y: deltaY });
  // };

  // const handleMouseUp = () => {
  //   if (!isDragging) return;

  //   const threshold = 100;
  //   const { x, y } = dragOffset;

  //   if (Math.abs(x) > threshold || Math.abs(y) > threshold) {
  //     if (Math.abs(x) > Math.abs(y)) {
  //       // Horizontal swipe
  //       if (x > 0) {
  //         handleSwipe("right", "Present");
  //       } else {
  //         handleSwipe("left", "Excused");
  //       }
  //     } else {
  //       // Vertical swipe
  //       if (y > 0) {
  //         handleSwipe("down", "Absent");
  //       }
  //     }
  //   } else {
  //     setDragOffset({ x: 0, y: 0 });
  //   }

  //   setIsDragging(false);
  // };

  // const handleTouchStart = (e) => {
  //   setIsDragging(true);
  //   const touch = e.touches[0];
  //   startPosRef.current = { x: touch.clientX, y: touch.clientY };
  // };

  // const handleTouchMove = (e) => {
  //   if (!isDragging) return;

  //   const touch = e.touches[0];
  //   const deltaX = touch.clientX - startPosRef.current.x;
  //   const deltaY = touch.clientY - startPosRef.current.y;
  //   setDragOffset({ x: deltaX, y: deltaY });
  // };

  // const handleTouchEnd = () => {
  //   handleMouseUp();
  // };

  // const getCardStyle = () => {
  //   const { x, y } = dragOffset;
  //   const rotation = x * 0.1;

  //   return {
  //     transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
  //     transition: isDragging ? "none" : "transform 0.3s ease-out",
  //   };
  // };

  const getSwipeIndicator = () => {
    const { x, y } = dragOffset;
    const threshold = 50;

    if (Math.abs(x) > Math.abs(y)) {
      if (x > threshold) return "present";
      if (x < -threshold) return "excused";
    } else {
      if (y > threshold) return "absent";
    }
    return null;
  };

  if (!classId || !selectedDate) return null;

  const currentStudent = students[currentIndex];
  const isCompleted = currentIndex >= students.length;
  const swipeIndicator = getSwipeIndicator();

  // Check if all students have recorded attendance
  const unrecordedCount = students.filter(
    (student) => !attendance[student.id]
  ).length;
  const allRecorded = unrecordedCount === 0;

  return (
    <div className="flex flex-col items-center space-y-6 ">
      {/* Header */}
      <div className="text-center bg-gray-50 rounded-2xl border-2 border-gray-200 w-80 py-1">
        <h3 className="text-xl font-bold text-gray-800 ">
          Kelas: {classLabel || classId}
        </h3>
        {/* <div className="text-sm text-gray-600">
          {completedStudents} dari {students.length} siswa
          {unrecordedCount > 0 && (
            <span className="text-yellow-600 ml-2">
              ({unrecordedCount} belum dicatat)
            </span>
          )}
        </div> */}
        {/* <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedStudents / students.length) * 100}%` }}
          ></div>
        </div> */}
      </div>

      {/* Instructions */}
      {/* <div className="bg-blue-50 rounded-lg p-4 text-center">
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <ArrowRight className="w-4 h-4 text-green-500" />
            <span>Swipe Right: Hadir</span>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4 text-yellow-500" />
            <span>Swipe Left: Izin</span>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowDown className="w-4 h-4 text-red-500" />
            <span>Swipe Down: Absen</span>
          </div>
        </div>
      </div> */}

      {/* Navigation Buttons */}
      {!isCompleted && (
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              currentIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {/* <span>Previous</span> */}
          </button>

          {/* <div className="text-sm text-gray-600 px-4">
            {currentIndex + 1} / {students.length}
          </div> */}
          <div className="text-center">
            <div className="text-sm text-gray-600 px-4">
              {currentIndex + 1} / {students.length}
              {unrecordedCount > 0 && (
                <span className="text-yellow-600 ml-2">
                  ({unrecordedCount} belum dicatat)
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / students.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= students.length - 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              currentIndex >= students.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {/* <span>Next</span> */}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              currentIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        </div>
      )}

      {/* Card Stack */}
      <div className="relative w-80 h-96">
        {isCompleted ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 rounded-2xl border-2 border-green-200">
            {allRecorded && (
              <div className="flex flex-col items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  Selesai!
                </h3>
                <p className="text-green-600 text-center mb-2">
                  Absensi untuk {students.length} siswa telah dicatat
                </p>
              </div>
            )}

            {/* Show warning if not all students are recorded */}
            {!allRecorded && (
              <div className="flex flex-col items-center justify-center">
                <XCircle className="w-16 h-16 text-yellow-500 mb-4" />
                {/* <h3 className="text-xl font-bold text-green-700 mb-2">
                  Selesai!
                </h3> */}
                <p className="text-yellow-600 text-center mb-4 text-sm">
                  Masih ada {unrecordedCount} siswa yang belum dicatat
                </p>
              </div>
            )}

            {/* Auto Save Button */}
            <button
              onClick={handleSaveAttendance}
              disabled={isSaving || !allRecorded}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                isSaving || !allRecorded
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              <Save className="w-5 h-5" />
              <span>
                {isSaving
                  ? "Menyimpan..."
                  : !allRecorded
                  ? "Lengkapi semua absensi"
                  : "Simpan Absensi"}
              </span>
            </button>
          </div>
        ) : (
          <>
            {/* Next card preview */}
            {students[currentIndex + 1] && (
              <div className="absolute inset-0 bg-white rounded-2xl shadow-lg border-2 border-gray-200 transform scale-95 opacity-50">
                <div className="p-6 h-full flex flex-col justify-center items-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">
                        {students[currentIndex + 1].name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600">
                      {students[currentIndex + 1].name}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Current card */}
            <div
              ref={cardRef}
              className={`absolute inset-0 bg-white rounded-2xl shadow-xl border-2 border-gray-300 cursor-grab active:cursor-grabbing select-none ${
                swipeIndicator === "present"
                  ? "border-green-400"
                  : swipeIndicator === "excused"
                  ? "border-yellow-400"
                  : swipeIndicator === "absent"
                  ? "border-red-400"
                  : ""
              }`}
              // style={getCardStyle()}
              // onMouseDown={handleMouseDown}
              // onMouseMove={handleMouseMove}
              // onMouseUp={handleMouseUp}
              // onMouseLeave={handleMouseUp}
              // onTouchStart={handleTouchStart}
              // onTouchMove={handleTouchMove}
              // onTouchEnd={handleTouchEnd}
            >
              {/* Swipe Indicators */}
              {/* {swipeIndicator === "present" && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  HADIR
                </div>
              )}
              {swipeIndicator === "excused" && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  IZIN
                </div>
              )}
              {swipeIndicator === "absent" && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ABSEN
                </div>
              )} */}

              <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {currentStudent?.name.charAt(0)}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentStudent?.name}
                </h3>

                {/* <p className="text-gray-600 mb-4">
                  NIS: {currentStudent?.studentId || "N/A"}
                </p> */}

                {/* Show current attendance status */}
                <div className="mb-4">
                  <span className="text-sm text-gray-500">
                    Status saat ini:{" "}
                  </span>
                  <span
                    className={`font-semibold ${
                      !attendance[currentStudent?.id]
                        ? "text-gray-500"
                        : attendance[currentStudent?.id] === "Present"
                        ? "text-green-600"
                        : attendance[currentStudent?.id] === "Excused"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {!attendance[currentStudent?.id]
                      ? "Belum dicatat"
                      : attendance[currentStudent?.id] === "Present"
                      ? "Hadir"
                      : attendance[currentStudent?.id] === "Excused"
                      ? "Izin"
                      : "Absen"}
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  Geser kartu untuk mencatat kehadiran
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {!isCompleted && (
        <div className="flex space-x-4">
          <button
            onClick={() => handleSwipe("left", "Excused")}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Izin</span>
          </button>

          <button
            onClick={() => handleSwipe("down", "Absent")}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Absen</span>
          </button>

          <button
            onClick={() => handleSwipe("right", "Present")}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Hadir</span>
          </button>
        </div>
      )}
    </div>
  );
}
