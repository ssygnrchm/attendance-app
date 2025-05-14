import { useState } from "react";
import ClassSelector from "./students/ClassSelector";
import StudentList from "./students/StudentList";
import AddStudentForm from "./students/AddStudentForm";

export default function StudentManagementPage() {
  const [selectedClassIds, setSelectedClassIds] = useState("");
  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleRefresh = () => setRefreshToggle((prev) => !prev);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manajemen Siswa</h1>
      <ClassSelector
        selectedClassId={selectedClassIds} // array
        onChange={setSelectedClassIds}
        multiple={true}
      />
      {/* Hanya bisa menambahkan student jika kelas yang dipilih hanya 1 */}
      <AddStudentForm
        classId={selectedClassId}
        onStudentAdded={handleRefresh}
      />
      <StudentList classId={selectedClassIds} key={refreshToggle} />
    </div>
  );
}
