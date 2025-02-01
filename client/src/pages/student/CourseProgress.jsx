import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CirclePlay } from "lucide-react";
import React from "react";

const CourseProgress = () => {
  const isCompleted = true;
  return (
    <div className="max-w-7xl mx-auto mt-20 p-4">
      {/* Display course name */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Course title</h1>
        <Button>Completed</Button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Video section */}
        <div className="flex-1 md:3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            {/* video will come here */}
            {/* <video /> */}
          </div>
          {/* Display current watching lectue title   */}
          <div className="mt-2">
            <h3 className="font-medium text-lg">lecture 1: introduction </h3>
          </div>
        </div>
        {/* lectue side bar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-300 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3, 4].map((Lecture, index) => (
              <Card
                className="mb-3 hover:cursor-pointer transition transform"
                key={index}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isCompleted ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-3" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-400 mr-3" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        Introduction
                      </CardTitle>
                    </div>
                  </div>
                  <Badge
                    className="bg-green-200 text-green-600"
                    variant={"outline"}
                  >
                    Completed
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
