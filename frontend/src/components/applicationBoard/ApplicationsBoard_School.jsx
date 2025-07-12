import React, { useEffect, useState } from "react";

const mockData = [
  {
    id: 1,
    name: "James Bailey",
    email: "james.bailey@xyz.com",
    phone: "9013449479",
    linkedin: "#",
    status: "New Candidates",
    date: "12/07/2024",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Myron Donnelly",
    email: "james.bailey@xyz.com",
    phone: "9013449479",
    linkedin: "#",
    status: "In Progress",
    date: "12/07/2024",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Luther Cremin",
    email: "james.bailey@xyz.com",
    phone: "9013449479",
    linkedin: "#",
    status: "Completed",
    date: "12/07/2024",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Maurice Stracke",
    email: "james.bailey@xyz.com",
    phone: "9013449479",
    linkedin: "#",
    status: "On Hold",
    date: "12/07/2024",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Iris Funk",
    email: "james.bailey@xyz.com",
    phone: "9013449479",
    linkedin: "#",
    status: "In Progress",
    date: "12/07/2024",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Lynda Dare",
    email: "james.bailey@xyz.com",
    phone: "9013449479",
    linkedin: "#",
    status: "New Candidates",
    date: "12/07/2024",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 7,
    name: "Christy Johnson-Yost",
    email: "james.bailey@xyz.com",
    phone: "9013449479",
    linkedin: "#",
    status: "Completed",
    date: "12/07/2024",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
];

const statusOrder = [
  "New Candidates",
  "In Progress",
  "Completed",
  "On Hold",
];

const statusColors = {
  "New Candidates": "border-l-gray-400",
  "In Progress": "border-l-orange-400",
  Completed: "border-l-green-400",
  "On Hold": "border-l-red-400",
};

const ApplicationsBoard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Replace with real API call
    setApplications(mockData);
  }, []);

  const groupedApplications = statusOrder.map((status) => ({
    status,
    items: applications.filter((app) => app.status === status),
  }));

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Applications</h2>
        <select className="border rounded px-3 py-1 text-sm">
          <option>Select Category</option>
        </select>
      </div>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 overflow-x-auto">
        {groupedApplications.map((group, index) => (
          <div key={index} className="bg-gray-50 rounded border p-2">
            <h3 className="text-center font-medium text-gray-700 mb-2 border-b pb-2">
              {group.status}
            </h3>
            <div className="space-y-4">
              {group.items.map((app) => (
                <div
                  key={app.id}
                  className={`bg-white border rounded shadow-sm p-4 space-y-2 border-l-4 ${statusColors[app.status]}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={app.avatar}
                      alt={app.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{app.name}</h4>
                      <p className="text-xs text-gray-500">{app.date}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium">Email Id</p>
                    <p className="text-sm text-gray-700">{app.email}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium">Contact Number</p>
                    <p className="text-sm text-gray-700">{app.phone}</p>
                  </div>

                  <a
                    href={app.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-sm border border-blue-500 text-blue-500 rounded py-1 hover:bg-blue-50 transition"
                  >
                    View LinkedIn
                  </a>

                  <button className="w-full text-sm bg-gray-100 rounded py-1 hover:bg-gray-200">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsBoard;
