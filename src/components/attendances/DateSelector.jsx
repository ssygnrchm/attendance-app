export default function DateSelector({ selectedDate, onChange }) {
  return (
    <div className="w-full">
      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
        Tanggal
      </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-left hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
          selectedDate == "" ? "text-gray-400" : "text-black"
        } `}
      />
    </div>
  );
}
