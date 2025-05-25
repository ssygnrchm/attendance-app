import { useState } from "react";
import ClassSelector from "./students/ClassSelector";
import StudentList from "./students/StudentList";
// import AddStudentForm from "./students/AddStudentForm";
import { Users, UserPlus, BookOpen, AlertCircle } from "lucide-react";
import StudentSearchBar from "./students/StudentSearchBar";

const AddStudentForm = ({ classId, onStudentAdded }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !gender) return alert("Nama dan jenis kelamin harus diisi.");

    // Mock submit
    setName("");
    setGender("");
    onStudentAdded();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <UserPlus className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-800">Tambah Siswa Baru</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Siswa
          </label>
          <input
            type="text"
            placeholder="Masukkan nama lengkap siswa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Jenis Kelamin
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <UserPlus className="inline w-5 h-5 mr-2" />
          Tambah Siswa
        </button>
      </div>
    </div>
  );
};

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

  // Only show the form when exactly one class is selected
  const showAddStudentForm = selectedClassIds.length === 1;
  // Get the single classId when only one is selected
  const singleClassId = showAddStudentForm ? selectedClassIds[0] : null;

  return (
    <div className="min-h-screen bg-white shadow rounded-lg p-6">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-start mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
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
                multiple={true}
              />
              <br />
              <StudentSearchBar
                onSearch={handleSearch}
                onReset={handleResetSearch}
              />
            </div>

            {showAddStudentForm ? (
              <AddStudentForm
                classId={singleClassId}
                onStudentAdded={handleRefresh}
              />
            ) : (
              selectedClassIds.length > 1 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-1">
                        Perhatian
                      </h4>
                      <p className="text-amber-700">
                        Pilih hanya satu kelas untuk menambahkan siswa baru.
                        Saat ini Anda telah memilih {selectedClassIds.length}{" "}
                        kelas.
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
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
