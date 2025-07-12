import React from "react";
import { Card, CardContent } from "../ui/card";
import Badge from "../ui/badge";
import { Button } from "../ui/button";

const LessionsPlan = () => {

  const lessons = [
    {
      title: "Introduction to Quadratic Equations",
      subject: "Algebra",
      grade: "9th Grade",
      date: "2024-03-15",
      description:
        "Interactive lesson plan developed during student teaching, incorporating visual aids and group activities",
      tags: ["Interactive", "Visual Work", "Mathematical Modeling"],
      label: "Student Teaching",
    },
    {
      title: "Geometry in Real Life - Architecture Project",
      subject: "Geometry",
      grade: "10th Grade",
      date: "2024-04-10",
      description:
        "Cross-curricular project connecting geometry concepts with architectural design",
      tags: ["Project-Based Learning"],
      label: "Capstone Project",
    },
  ];

  return (
    <div className="space-y-6">
      {lessons.map((lesson, index) => (
        <Card key={index} className="border">
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-semibold">{lesson.title}</h2>
                <div className="text-sm text-gray-500">
                  {lesson.subject} — {lesson.grade} — {lesson.date}
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 rounded-2xl">{lesson.label}</Badge>
            </div>
            <p className="text-sm text-gray-700">{lesson.description}</p>
            <div className="flex flex-wrap gap-2">
              {(lesson.tags || []).map((tag, j) => (
                <Badge key={j} className="border border-gray-300 bg-white">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline">Preview</Button>
              <Button variant="outline">Download</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LessionsPlan;
