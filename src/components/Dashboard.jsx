import React from "react";

const Dashboard = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Welcome to the Student Attendance App
      </h2>
      <p className="text-gray-600 mb-4">
        Start managing your class attendance by navigating through the options
        above.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-700">Manage Students</h3>
          <p className="text-sm text-gray-600 mt-2">
            Add new students manually or import from a spreadsheet
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-700">Take Attendance</h3>
          <p className="text-sm text-gray-600 mt-2">
            Record daily attendance for your classes
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-700">Generate Reports</h3>
          <p className="text-sm text-gray-600 mt-2">
            Create and export attendance reports
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
