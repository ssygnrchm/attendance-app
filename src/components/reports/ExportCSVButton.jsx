import axios from "axios";
import { useState } from "react";

export default function ExportCSVButton({ data, month }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // URL ke serverless function Netlify
  const export_url = "/.netlify/functions/export";

  const handleExport = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const response = await axios.post(export_url, {
        data,
        month,
      });
      alert(response.data.message);
      setSuccess(true);
    } catch (err) {
      console.error("Export failed", err);
      alert("Gagal mengirim ke Google Sheets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`mt-4 inline-block px-4 py-2 rounded text-white ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : success
          ? "bg-green-700 hover:bg-green-800"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {loading
        ? "Mengirim..."
        : success
        ? "Terkirim!"
        : "Kirim ke Google Sheets"}
    </button>
  );
}
