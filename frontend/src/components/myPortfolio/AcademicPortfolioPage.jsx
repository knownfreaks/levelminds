import { cn } from "@/lib/utils";
import React, { useState } from "react"; // <-- Add useState
import { Card, CardContent } from "../ui/card";
import Badge from "../ui/badge";
import { Button } from "../ui/button";
import LessionsPlan from "./LessionsPlan";
import TeachingEvidence from "./TeachingEvidence";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import Reference from "./Reference";

export default function AcademicPortfolioPage() {
  const [activeTab, setActiveTab] = useState("Lesson Plans"); // <-- Tab state

  const tabs = [
    "Lesson Plans",
    "Teaching Evidence",
    "Academic Work",
    "References",
  ];

  const evidence = [
    {
      title: "Student Portfolio: Mathematical Modeling",
      description:
        "Collection of exceptional student work from practicum teaching experience",
      type: "Practicum Evidence",
      year: "2024",
    },
    {
      title: "Student Portfolio: Mathematical Modeling",
      description:
        "Collection of exceptional student work from practicum teaching experience",
      type: "Practicum Evidence",
      year: "2024",
    },
  ];

  const acedmic = [
    {
      title: "Student Teaching Reflection Journal",
      description:
        "Comprehensive reflection on teaching experiences and professional growth",
      type: "PDF",
      year: "1.8 MB",
    },
    {
      title: "Student Teaching Reflection Journal",
      description:
        "Comprehensive reflection on teaching experiences and professional growth",
      type: "PDF",
      year: "1.8 MB",
    },
  ];

  const reference = [
    {
      description:
        "Emily demonstrated exceptional dedication and natural teaching ability during her student teaching placement. Her innovative lesson plans and genuine care for students made a lasting impact.",
      name: "Dr. Sarah Mitchell",
      specification: "Supervising Teacher - Lincoln Middle School",
    },
    {
      description:
        "Emily demonstrated exceptional dedication and natural teaching ability during her student teaching placement. Her innovative lesson plans and genuine care for students made a lasting impact.",
      name: "Dr. Sarah Mitchell",
      specification: "Supervising Teacher - Lincoln Middle School",
    },
  ];

  const breadcrumbItems = [{ label: "My Portfolio", href: "#" }];

  return (
    <div className="max-w-full p-4">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-2xl font-semibold mb-1">Academic Portfolio</h1>
      <p className="text-gray-600 mb-6">
        Student teaching experiences, coursework and professional development
      </p>
      <div className="flex mb-6 justify-between">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-14 py-2 cursor-pointer rounded-t border-b-2",
              activeTab === tab
                ? "shadow text-green-400 rounded "
                : "border-transparent text-gray-500"
            )}
          >
            {tab}
          </div>
        ))}
      </div>
      {activeTab === "Lesson Plans" && (
        <div>
          <LessionsPlan />
        </div>
      )}

      {activeTab === "Teaching Evidence" && (
        <div className="space-y-6">
          {evidence.map((evidence, index) => (
            <TeachingEvidence item={evidence} key={index} btnText={"View"} />
          ))}
        </div>
      )}
      {activeTab === "Academic Work" && (
        <div className="space-y-6">
          {acedmic.map((acedmic, index) => (
            <TeachingEvidence item={acedmic} key={index} btnText={"Download"} />
          ))}
        </div>
      )}

      {activeTab === "References" && (
        <div className="space-y-6">
          {reference.map((reference, index) => (
            <Reference item={reference} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
