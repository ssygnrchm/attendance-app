import { useRef, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Upload, Download, AlertCircle, CheckCircle } from "lucide-react";

export default function StudentImporter({ onDataImported }) {
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [rejected, setRejected] = useState([]);
  const [notification, setNotification] = useState(null);

  const toPascalCase = (str) =>
    str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDownloadTemplate = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Student Import Template");

      worksheet.addRow(["name", "gender", "className"]);
      worksheet.addRow(["Jane Doe", "Perempuan", "TK"]);
      worksheet.addRow(["John Smith", "Laki-Laki", "TK"]);

      worksheet.columns = [
        { header: "name", key: "name", width: 30 },
        { header: "gender", key: "gender", width: 15 },
        { header: "className", key: "className", width: 20 },
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "student_import_template.xlsx");
      showNotification("Template berhasil diunduh", "success");
    } catch (error) {
      console.error("Error downloading template:", error);
      showNotification("Gagal mengunduh template", "error");
    }
  };

  const validateStudentData = (student) => {
    const errors = [];

    if (!student.name || student.name.trim().length === 0) {
      errors.push("Nama tidak boleh kosong");
    }

    if (!student.gender || student.gender.trim().length === 0) {
      errors.push("Jenis kelamin tidak boleh kosong");
    } else {
      const validGenders = ["laki-laki", "perempuan", "male", "female"];
      if (!validGenders.includes(student.gender.toLowerCase())) {
        errors.push(
          "Jenis kelamin harus 'Laki-Laki', 'Perempuan', 'Male', atau 'Female'"
        );
      }
    }

    if (!student.className || student.className.trim().length === 0) {
      errors.push("Nama kelas tidak boleh kosong");
    }

    return errors;
  };

  const normalizeGender = (gender) => {
    const genderLower = gender.toLowerCase().trim();
    if (genderLower === "laki-laki" || genderLower === "male") {
      return "Laki-Laki";
    } else if (genderLower === "perempuan" || genderLower === "female") {
      return "Perempuan";
    }
    return toPascalCase(gender);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setRejected([]);
    setNotification(null);

    try {
      showNotification("Memproses file...", "info");

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        throw new Error("File Excel tidak memiliki worksheet");
      }

      const students = [];
      let rowCount = 0;

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header
        rowCount++;

        const values = row.values;
        if (!values || values.length < 4) return;

        const [, nameCell, genderCell, classNameCell] = values; // skip index 0 (empty)

        if (!nameCell && !genderCell && !classNameCell) return; // Skip completely empty rows

        students.push({
          name: nameCell ? String(nameCell).trim() : "",
          gender: genderCell ? String(genderCell).trim() : "",
          className: classNameCell ? String(classNameCell).trim() : "",
          rowNumber: rowNumber,
        });
      });

      if (students.length === 0) {
        throw new Error("Tidak ada data siswa yang valid ditemukan dalam file");
      }

      showNotification(`Memvalidasi ${students.length} data siswa...`, "info");

      // Get classes from Firestore
      const classesSnapshot = await getDocs(collection(db, "classes"));
      const classesMap = {};
      classesSnapshot.forEach((doc) => {
        const className = doc.data().name;
        classesMap[className.toLowerCase()] = {
          id: doc.id,
          name: className,
        };
      });

      const rejectedData = [];
      const successfulImports = [];

      for (const student of students) {
        // Validate student data
        const validationErrors = validateStudentData(student);
        if (validationErrors.length > 0) {
          rejectedData.push({
            ...student,
            reason: validationErrors.join(", "),
          });
          continue;
        }

        // Check if class exists
        const classInfo = classesMap[student.className.toLowerCase()];
        if (!classInfo) {
          rejectedData.push({
            ...student,
            reason: `Kelas "${student.className}" tidak ditemukan`,
          });
          continue;
        }

        // Check for duplicates
        try {
          const studentQuery = query(
            collection(db, "students"),
            where("name", "==", toPascalCase(student.name))
          );
          const studentSnapshot = await getDocs(studentQuery);

          let isDuplicate = false;
          studentSnapshot.forEach((doc) => {
            const data = doc.data();
            if (
              data.gender.toLowerCase() === student.gender.toLowerCase() &&
              data.classId === classInfo.id
            ) {
              isDuplicate = true;
            }
          });

          if (isDuplicate) {
            rejectedData.push({
              ...student,
              reason:
                "Data siswa sudah ada (nama, jenis kelamin, dan kelas sama)",
            });
            continue;
          }

          // Save to Firestore
          await addDoc(collection(db, "students"), {
            name: toPascalCase(student.name),
            gender: normalizeGender(student.gender),
            classId: classInfo.id,
            createdAt: new Date(),
          });

          successfulImports.push(student);
        } catch (firestoreError) {
          console.error(
            "Firestore error for student:",
            student,
            firestoreError
          );
          rejectedData.push({
            ...student,
            reason: `Gagal menyimpan ke database: ${
              firestoreError.message || "Unknown error"
            }`,
          });
        }
      }

      // Generate rejected file if there are rejections
      if (rejectedData.length > 0) {
        try {
          const wb = new ExcelJS.Workbook();
          const ws = wb.addWorksheet("Rejected Students");
          ws.addRow(["Row Number", "Name", "Gender", "Class Name", "Reason"]);

          rejectedData.forEach((item) => {
            ws.addRow([
              item.rowNumber,
              item.name,
              item.gender,
              item.className,
              item.reason,
            ]);
          });

          ws.columns = [
            { header: "Row Number", key: "rowNumber", width: 12 },
            { header: "Name", key: "name", width: 30 },
            { header: "Gender", key: "gender", width: 15 },
            { header: "Class Name", key: "className", width: 20 },
            { header: "Reason", key: "reason", width: 50 },
          ];

          const buffer = await wb.xlsx.writeBuffer();
          saveAs(
            new Blob([buffer]),
            `rejected_students_${new Date().toISOString().split("T")[0]}.xlsx`
          );
        } catch (exportError) {
          console.error("Error creating rejected file:", exportError);
          showNotification("Gagal membuat file data yang ditolak", "error");
        }
      }

      setRejected(rejectedData);

      // Show final notification
      if (successfulImports.length > 0 && rejectedData.length === 0) {
        showNotification(
          `Berhasil mengimpor ${successfulImports.length} siswa`,
          "success"
        );
      } else if (successfulImports.length > 0 && rejectedData.length > 0) {
        showNotification(
          `${successfulImports.length} siswa berhasil diimpor, ${rejectedData.length} ditolak. File penolakan telah diunduh.`,
          "warning"
        );
      } else if (successfulImports.length === 0 && rejectedData.length > 0) {
        showNotification(
          `Semua data ditolak (${rejectedData.length} item). File penolakan telah diunduh.`,
          "error"
        );
      } else {
        showNotification("Tidak ada data yang berhasil diproses", "error");
      }

      if (successfulImports.length > 0) {
        onDataImported();
      }
    } catch (error) {
      console.error("Import error:", error);
      showNotification(`Error saat mengimpor: ${error.message}`, "error");
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Notification */}
      {notification && (
        <div
          className={`flex items-center gap-2 p-3 rounded-md border ${getNotificationBgColor(
            notification.type
          )}`}
        >
          {getNotificationIcon(notification.type)}
          <span className="text-sm">{notification.message}</span>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={16} />
          {importing ? "Mengimpor..." : "Import Siswa"}
        </button>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Download size={16} />
          Unduh Template
        </button>
      </div>

      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImport}
      />

      {/* Import Instructions */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">Petunjuk Import:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>File harus berformat Excel (.xlsx atau .xls)</li>
          <li>Kolom yang diperlukan: name, gender, className</li>
          <li>
            Jenis kelamin: "Laki-Laki", "Perempuan", "Male", atau "Female"
          </li>
          <li>Nama kelas harus sudah ada di sistem</li>
          <li>
            Data duplikat (nama, jenis kelamin, dan kelas sama) akan ditolak
          </li>
        </ul>
      </div>

      {rejected.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md">
          <p className="text-sm font-medium">
            {rejected.length} data ditolak dan tidak diimpor.
          </p>
          <p className="text-xs mt-1">
            File dengan detail penolakan telah diunduh otomatis.
          </p>
        </div>
      )}
    </div>
  );
}
