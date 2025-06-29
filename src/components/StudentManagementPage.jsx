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
    <div className="min-h-screen bg-white shadow rounded-xl p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-start mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-400 bg-clip-text text-transparent">
            Manajemen Siswa
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">
            Kelola data siswa dengan mudah dan efisien
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Class Selection & Add Student */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-4 sm:p-6 shadow-sm">
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

            {/* Mobile: Stack forms vertically, Desktop: Normal layout */}
            <div className="space-y-4 sm:space-y-6">
              <AddStudentForm onStudentAdded={handleRefresh} />
              <StudentImporter onDataImported={handleRefresh} />
            </div>
          </div>

          {/* Right Column - Student List */}
          <div className="lg:col-span-2 order-first lg:order-last">
            <StudentList
              classIds={selectedClassIds}
              key={refreshToggle}
              searchKeyword={searchedStudentName}
            />
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              4
            </h4>
            <p className="text-gray-600 text-sm sm:text-base">Total Siswa</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              4
            </h4>
            <p className="text-gray-600 text-sm sm:text-base">Total Kelas</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              {selectedClassIds.length}
            </h4>
            <p className="text-gray-600 text-sm sm:text-base">Kelas Dipilih</p>
          </div>
        </div>
      </div>
    </div>
  );
}
