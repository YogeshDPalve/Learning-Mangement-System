import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  const courseId = "	";
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4">
      <Link
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
        to={`/course-details/${courseId}`}
      >
        <img
          className="h-32 w-full md:w-56 object-cover rounded"
          src={
            "https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png"
          }
          alt="coruse-thumbnail"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-left text-lg md:text-xl">
            courseTitle
          </h1>
          <p className="text-sm font-semibold text-gray-600">Subtitle</p>
          <p className="text-sm font-normal text-gray-700">
            Intstructor: <span className="font-semibold">haanah</span>
          </p>
          <Badge className="w-fit mt-2 md:mt-0">
            <span className="mx-auto ">Intermediate</span>{" "}
          </Badge>
        </div>
      </Link>
    </div>
  );
};

export default SearchResult;
