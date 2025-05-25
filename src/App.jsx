import React, { useState } from "react";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import StudentManagementPage from "./components/StudentManagementPage";
import AttendancePage from "./components/AttendancePage";
import MonthlyReportPage from "./components/MonthlyReportPage";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <StudentManagementPage />;
      case "attendance":
        return <AttendancePage />;
      case "reports":
        return <MonthlyReportPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <FirebaseProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Student Attendance App</h1>
          <Navigation onViewChange={setCurrentView} currentView={currentView} />
          <main className="mt-6">{renderView()}</main>
        </div>
      </div>
    </FirebaseProvider>
  );
}

export default App;
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import ClassList from "./components/classes/ClassList";
// import StudentManagementPage from "./components/StudentManagementPage";
// import AttendancePage from "./components/AttendancePage";
// import MonthlyReportPage from "./components/MonthlyReportPage";

// function App() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       {/* <h1 className="text-3xl font-bold text-blue-600">
//         Hello, Student Attendance App 👋
//       </h1> */}
//       <MonthlyReportPage />
//     </div>
//     // <div className="min-h-screen flex items-center justify-center bg-gray-100">
//     //   <StudentManagementPage />
//     // </div>
//   );
// }

// export default App;
