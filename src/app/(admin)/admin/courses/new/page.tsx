"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { sectionApi } from "@/lib/api/section";
import { CourseBasicInfoForm } from "@/components/course/CourseBasicInfoForm";
import { SectionManager } from "@/components/course/SectionManager";
import { LessonManager } from "@/components/course/LessonManager";
import { CourseReview } from "@/components/course/CourseReview";
import type { Course, Section } from "@/lib/types/course";

const STEPS = [
  { id: 1, name: "Basic Info", description: "Course details" },
  { id: 2, name: "Sections", description: "Organize content" },
  { id: 3, name: "Lessons", description: "Add lessons & videos" },
  { id: 4, name: "Review", description: "Review & publish" },
];

export default function NewCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<Partial<Course> | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  const loadSections = useCallback(async () => {
    if (!courseId) return;
    try {
      const data = await sectionApi.getByCourse(courseId);
      setSections(data.sections || []);
    } catch (err) {
      console.error("Failed to load sections:", err);
    }
  }, [courseId]);

  useEffect(() => {
    if (currentStep >= 2 && courseId) {
      loadSections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, courseId]);

  const handleCourseCreated = (course: Course) => {
    setCourseId(course.id);
    setCourseData(course);
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    router.push("/admin/courses");
  };

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {STEPS.map((step, stepIdx) => (
              <li
                key={step.name}
                className={`relative ${
                  stepIdx !== STEPS.length - 1 ? "pr-8 sm:pr-20 flex-1" : ""
                }`}
              >
                {stepIdx !== STEPS.length - 1 && (
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-0.5 w-full ${
                        step.id < currentStep ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}

                <div className="relative flex items-center group">
                  <span
                    className={`h-9 w-9 rounded-full flex items-center justify-center ${
                      step.id === currentStep
                        ? "bg-blue-600 text-white"
                        : step.id < currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-white border-2 border-gray-300 text-gray-500"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </span>
                  <span className="ml-3 min-w-0 flex flex-col">
                    <span
                      className={`text-sm font-medium ${
                        step.id === currentStep
                          ? "text-blue-600"
                          : step.id < currentStep
                            ? "text-gray-900"
                            : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {step.description}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow p-8">
        {currentStep === 1 && (
          <CourseBasicInfoForm onSuccess={handleCourseCreated} />
        )}

        {currentStep === 2 && courseId && (
          <SectionManager
            courseId={courseId}
            onNext={() => {
              loadSections();
              handleNext();
            }}
          />
        )}

        {currentStep === 3 && courseId && courseData && (
          <LessonManager
            courseId={courseId}
            sections={sections}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && courseId && courseData && (
          <CourseReview
            course={courseData}
            onFinish={handleFinish}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
