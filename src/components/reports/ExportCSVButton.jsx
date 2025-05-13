import axios from "axios";

export default function ExportCSVButton({ data, month }) {
  const handleExport = async () => {
    try {
      const response = await axios.post("http://localhost:5000/export", {
        data,
        month,
      });
      alert(response.data.message);
    } catch (err) {
      console.error("Export failed", err);
      alert("Gagal mengirim ke Google Sheets.");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Kirim ke Google Sheets
    </button>
  );
}

// import { CSVLink } from "react-csv";

// export default function ExportCSVButton({ data, month }) {
//   const headers = [
//     { label: "Nama Siswa", key: "name" },
//     { label: "Hadir", key: "Present" },
//     { label: "Absen", key: "Absent" },
//     { label: "Izin", key: "Excused" },
//   ];

//   return (
//     <CSVLink
//       data={data}
//       headers={headers}
//       filename={`Laporan_Absensi_${month}.csv`}
//       className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//     >
//       Unduh CSV
//     </CSVLink>
//   );
// }
