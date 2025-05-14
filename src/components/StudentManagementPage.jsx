import { useState } from "react";
import ClassSelector from "./students/ClassSelector";
import StudentList from "./students/StudentList";
import AddStudentForm from "./students/AddStudentForm";

export default function StudentManagementPage() {
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleRefresh = () => setRefreshToggle((prev) => !prev);

  // Only show the form when exactly one class is selected
  const showAddStudentForm = selectedClassIds.length === 1;
  // Get the single classId when only one is selected
  const singleClassId = showAddStudentForm ? selectedClassIds[0] : null;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manajemen Siswa</h1>
      <ClassSelector
        selectedClassId={selectedClassIds}
        onChange={setSelectedClassIds}
        multiple={true}
      />
      {showAddStudentForm ? (
        <AddStudentForm
          classId={singleClassId}
          onStudentAdded={handleRefresh}
        />
      ) : (
        selectedClassIds.length > 1 && (
          <p className="text-amber-600 mb-4">
            Pilih hanya satu kelas untuk menambahkan siswa baru.
          </p>
        )
      )}
      <StudentList classIds={selectedClassIds} key={refreshToggle} />
    </div>
  );
}
