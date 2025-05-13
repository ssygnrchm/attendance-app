export default function MonthSelector({ selectedMonth, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Pilih Bulan
      </label>
      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full"
      />
    </div>
  );
}
