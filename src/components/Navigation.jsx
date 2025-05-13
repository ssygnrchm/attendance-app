import React from "react";

const Navigation = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "students", label: "Students" },
    { id: "attendance", label: "Attendance" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <nav className="bg-white shadow rounded-lg">
      <div className="flex overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              currentView === item.id
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
