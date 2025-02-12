import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchaseApi";
import React from "react";
import { Navigate, useParams } from "react-router-dom";

export const PurchasedCourseProtectedRoutes = ({ children }) => {
  const { courseId } = useParams();
  const { data, isLoading } = useGetCourseDetailsWithStatusQuery(courseId);
  if (isLoading) return <h1>Loading...</h1>;

  return data?.purchased ? (
    children
  ) : (
    <Navigate to={`/course-detail/${courseId}`} />
  );
};
