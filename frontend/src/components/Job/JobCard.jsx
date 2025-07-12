import cardicon from "../../assets/card-icon.png";

const JobCard = () => {
  return (
    <div className="flex gap-4 p-5 border rounded-xl shadow-sm bg-white max-w-3xl">
      <div className="w-14 h-14 flex-shrink-0">
        <img
          src={cardicon}
          alt="Logo"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm text-gray-500">School Name</p>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Elementary Mathematics Teacher
            </h2>
            <span className="text-xs text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">📍 Delhi</span>
          <span>•</span>
          <span className="flex items-center gap-1">⏱ Full time</span>
          <span>•</span>
          <span className="flex items-center gap-1">₹ 10 LPA</span>
          <span>•</span>
          <span className="flex items-center gap-1">📅 29 min ago</span>
        </div>

        <p className="text-sm text-gray-700 leading-snug mt-1">
          Mollit in laborum tempor Lorem incididunt irure. Aute eu ex ad sunt.
          Pariatur sint culpa do incididunt eiusmod eiusmod culpa. laborum
          tempor Lorem incididunt.
        </p>

        <div className="mt-2">
          <button className="text-sm px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer float-right">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
