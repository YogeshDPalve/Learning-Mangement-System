import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "../lecture/Lecture";

const CreateLecture = () => {
  const params = useParams();
  const navigate = useNavigate();
  const courseId = params.courseId;
  const [lectureTitle, setLectureTitle] = useState("");

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureIsLoading,
    isError: lectureIsError,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data?.message || "Lecture created");
    }
    if (error) {
      toast.error(error?.data?.message || "Lecture not created");
    }
  }, [isLoading, isSuccess]);
  //   console.log(lectureData);
  return (
    <div className="flex-1 mx-10 pt-10">
      <div className="mb-4 ">
        <h1 className="font-bold text-xl">
          Let's add lectures, some basic course details for new Lecture.
        </h1>
        <p className=" text-sm">
          Interactive modules enhance learning, build skills, and achieve course
          goals effectively.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="courseTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title Name"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureIsLoading ? (
            <p>Loading Lecture</p>
          ) : lectureIsError ? (
            <p>Failed to load lectures</p>
          ) : lectureData.lectures.length === 0 ? (
            <p>No lectures available</p>
          ) : (
            lectureData.lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                index={index}
                courseId={courseId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
