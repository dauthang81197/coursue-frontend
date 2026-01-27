"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { courseApi } from "@/lib/api/course";
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

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;

    const [currentStep, setCurrentStep] = useState(1);
    const [courseData, setCourseData] = useState<Course | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCourse();
    }, [courseId]);

    useEffect(() => {
        if (currentStep >= 2 && courseId) {
            loadSections();
        }
    }, [currentStep, courseId]);

    const loadCourse = async () => {
        try {
            setLoading(true);
            const course = await courseApi.getById(courseId);
            setCourseData(course);
        } catch (err: any) {
            setError(err.message || "Failed to load course");
        } finally {
            setLoading(false);
        }
    };

    const loadSections = async () => {
        try {
            const data = await sectionApi.getByCourse(courseId);
            setSections(data.sections || []);
        } catch (err: any) {
            console.error("Failed to load sections:", err);
        }
    };

    const handleCourseUpdated = (course: Course) => {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading course...</div>
            </div>
        );
    }

    if (error || !courseData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">{error || "Course not found"}</div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
                <p className="mt-1 text-sm text-gray-500">{courseData.title}</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <nav aria-label="Progress">
                    <ol className="flex items-center">
                        {STEPS.map((step, stepIdx) => (
                            <li
                                key={step.name}
                                className={`relative ${stepIdx !== STEPS.length - 1 ? "pr-8 sm:pr-20 flex-1" : ""
                                    }`}
                            >
                                {stepIdx !== STEPS.length - 1 && (
                                    <div
                                        className="absolute inset-0 flex items-center"
                                        aria-hidden="true"
                                    >
                                        <div
                                            className={`h-0.5 w-full ${step.id < currentStep ? "bg-blue-600" : "bg-gray-200"
                                                }`}
                                        />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(step.id)}
                                    className="relative flex items-center group"
                                >
                                    <span
                                        className={`h-9 w-9 rounded-full flex items-center justify-center ${step.id === currentStep
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
                                            className={`text-sm font-medium ${step.id === currentStep
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
                                </button>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow p-8">
                {currentStep === 1 && (
                    <CourseBasicInfoForm
                        onSuccess={handleCourseUpdated}
                        initialData={courseData}
                        isEdit={true}
                        courseId={courseId}
                    />
                )}

                {currentStep === 2 && (
                    <SectionManager
                        courseId={courseId}
                        onNext={() => {
                            loadSections();
                            handleNext();
                        }}
                    />
                )}

                {currentStep === 3 && (
                    <LessonManager
                        courseId={courseId}
                        sections={sections}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}

                {currentStep === 4 && (
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
