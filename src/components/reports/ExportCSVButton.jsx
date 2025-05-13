import { CSVLink } from "react-csv";

export default function ExportCSVButton({ data, month }) {
  const headers = [
    { label: "Nama Siswa", key: "name" },
    { label: "Hadir", key: "Present" },
    { label: "Absen", key: "Absent" },
    { label: "Izin", key: "Excused" },
  ];

  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={`Laporan_Absensi_${month}.csv`}
      className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Unduh CSV
    </CSVLink>
  );
}
