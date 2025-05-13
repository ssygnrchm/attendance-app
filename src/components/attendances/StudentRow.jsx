export default function StudentRow({ student, status, onStatusChange }) {
  return (
    <tr className="border-t">
      <td className="p-2">{student.name}</td>
      <td className="p-2">
        <select
          value={status}
          onChange={(e) => onStatusChange(student.id, e.target.value)}
          className="border border-gray-300 rounded p-1"
        >
          <option value="Present">Hadir</option>
          <option value="Absent">Absen</option>
          <option value="Excused">Izin</option>
        </select>
      </td>
    </tr>
  );
}
