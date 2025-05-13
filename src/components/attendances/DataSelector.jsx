export default function DateSelector({ selectedDate, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Tanggal
      </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
      />
    </div>
  );
}
