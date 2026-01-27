"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { courseApi } from "@/lib/api/course";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Textarea } from "@/components/base/Textarea";
import type {
  CreateCourseDto,
  Course,
  CourseLevel,
  CourseStatus,
} from "@/lib/types/course";

interface CourseBasicInfoFormProps {
  onSuccess: (course: Course) => void;
  initialData?: Partial<Course>;
  isEdit?: boolean;
  courseId?: string;
}

export function CourseBasicInfoForm({
  onSuccess,
  initialData,
  isEdit = false,
  courseId,
}: CourseBasicInfoFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseDto>({
    defaultValues: initialData || {
      level: "beginner" as CourseLevel,
      status: "draft" as CourseStatus,
      language: "English",
      price: 0,
    },
  });

  const onSubmit = async (data: CreateCourseDto) => {
    try {
      setLoading(true);
      setError(null);
      const course = isEdit && courseId
        ? await courseApi.update(courseId, data)
        : await courseApi.create(data);
      onSuccess(course);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to ${isEdit ? 'update' : 'create'} course`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600">
          Fill in the basic details of your course
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="Course Title"
        required
        {...register("title", { required: "Title is required" })}
        error={errors.title?.message}
        placeholder="e.g., Complete Web Development Bootcamp"
      />

      <Textarea
        label="Description"
        required
        {...register("description", { required: "Description is required" })}
        error={errors.description?.message}
        placeholder="Describe what students will learn..."
        rows={5}
      />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("category", { required: "Category is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Programming"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level <span className="text-red-500">*</span>
          </label>
          <select
            {...register("level", { required: "Level is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all_levels">All Levels</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Input
          label="Price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          placeholder="49.99"
        />

        <Input
          label="Discount Price"
          type="number"
          step="0.01"
          {...register("discountPrice", { valueAsNumber: true })}
          placeholder="29.99"
        />

        <Input
          label="Language"
          {...register("language")}
          placeholder="English"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          type="text"
          {...register("tags")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="React, JavaScript, Web Development (comma separated)"
        />
        <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          {...register("status")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="submit" disabled={loading}>
          {loading
            ? (isEdit ? "Updating..." : "Creating...")
            : (isEdit ? "Update Course & Continue" : "Create Course & Continue")}
        </Button>
      </div>
    </form>
  );
}
