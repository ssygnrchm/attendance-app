import { useState } from "react";
import ClassSelector from "./students/ClassSelector";
import StudentList from "./students/StudentList";
import AddStudentForm from "./students/AddStudentForm";
import { Users, UserPlus, BookOpen, AlertCircle } from "lucide-react";
import StudentSearchBar from "./students/StudentSearchBar";
import StudentImporter from "./students/StudentImporter";

export default function StudentManagementPage() {
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [searchedStudentName, setSearchedStudentName] = useState("");
  const [refreshToggle, setRefreshToggle] = useState(false);

  const handleRefresh = () => setRefreshToggle((prev) => !prev);

  const handleSearch = (keyword) => {
    setSearchedStudentName(keyword);
  };

  const handleResetSearch = () => {
    setSearchedStudentName("");
  };

  return (
    <div className="min-h-screen bg-white shadow rounded-xl p-6">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-start mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-400 bg-clip-text text-transparent">
            Manajemen Siswa
          </h1>
          <p className="text-gray-600 text-lg">
            Kelola data siswa dengan mudah dan efisien
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Class Selection & Add Student */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <ClassSelector
                selectedClassId={selectedClassIds}
                onChange={setSelectedClassIds}
                title={"Filter Kelas"}
                isIcon={true}
                multiple={true}
              />
              <br />
              <StudentSearchBar
                onSearch={handleSearch}
                onReset={handleResetSearch}
              />
            </div>

            <AddStudentForm onStudentAdded={handleRefresh} />

            <StudentImporter onDataImported={handleRefresh} />
          </div>

          {/* Right Column - Student List */}
          <div className="lg:col-span-2">
            <StudentList
              classIds={selectedClassIds}
              key={refreshToggle}
              searchKeyword={searchedStudentName}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-1">4</h4>
            <p className="text-gray-600">Total Siswa</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-1">4</h4>
            <p className="text-gray-600">Total Kelas</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-1">
              {selectedClassIds.length}
            </h4>
            <p className="text-gray-600">Kelas Dipilih</p>
          </div>
        </div>
      </div>
    </div>
  );
}
