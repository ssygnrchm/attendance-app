import { useState } from "react";
import { X, Search } from "lucide-react";

export default function StudentSearchBar({ onSearch, onReset }) {
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (keyword.trim() !== "") {
      onSearch(keyword.trim());
      setIsSearching(true);
    }
  };

  const handleReset = () => {
    setKeyword("");
    setIsSearching(false);
    onReset();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        <Search className="inline w-4 h-4 mr-2" />
        Cari berdasarkan nama siswa
      </label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Masukkan nama siswa..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 h-12 bg-white border-2 border-gray-200 rounded-xl px-4 text-gray-800 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
        />
        {isSearching && keyword.trim() !== "" ? (
          <button
            onClick={handleReset}
            className="h-12 w-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl flex items-center justify-center transition-colors duration-200"
            title="Reset"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSearch}
            className="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors duration-200"
            title="Cari"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
