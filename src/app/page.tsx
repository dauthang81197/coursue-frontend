import { MainLayout } from "@/components/layout";
import { Button } from "@/components/base";
import { CourseList } from "@/components/common";
import Link from "next/link";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20">
          <div className="max-w-2xl">
            <div className="inline-block mb-4 px-3 py-1 bg-white/20 rounded-full text-sm">
              ONLINE COURSE
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sharpen Your Skills With Professional Online Courses
            </h1>
            <p className="text-lg mb-8 text-primary-100">
              Continue your journey and achieve your target with the
              world&apos;s best instructors and learn at your own pace.
            </p>
            <Link href="/courses">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <CourseList title="Continue Watching" showSeeAll={true} limit={6} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Development", "Business", "Design", "Marketing"].map(
              (category) => (
                <Link
                  key={category}
                  href={`/courses?category=${category}`}
                  className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-primary-600 transition-all text-center"
                >
                  <div className="text-3xl mb-2">💻</div>
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">
                10K+
              </div>
              <div className="text-gray-300">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">
                500+
              </div>
              <div className="text-gray-300">Expert Instructors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">
                1000+
              </div>
              <div className="text-gray-300">Online Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">
                98%
              </div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
