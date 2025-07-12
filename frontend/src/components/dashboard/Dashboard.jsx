import { useOutletContext } from "react-router-dom";
import CandidateProfilePanel from "../profileCard/CandidateProfilePanel";
import JobCard from "../Job/JobCard";

const Dashboard = () => {
  const user = useOutletContext();

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div>
        <CandidateProfilePanel />
      </div>
      <div className="">
        <h3 className="text-lg font-semibold mb-2">
          Shortlisted Job Opportunities
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          🎉 Browse through the positions for which you’ve been shortlisted
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <JobCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
