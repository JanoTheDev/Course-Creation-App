"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { useScreenProtection } from "@/hooks/useScreenProtection";
import { isAuthenticated } from "@/utils/auth";
import Image from "next/image";

interface Video {
  title: string;
  url: string;
  bio: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  instructorName: string;
  privacy: "public" | "unlisted" | "private";
  videos: Video[];
  price: number;
  hasAccess: boolean;
}

interface VideoProgress {
  videoId: string;
  timestamp: number;
  completed: boolean;
}

interface Progress {
  videoId: string;
  timestamp: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function CourseDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const router = useRouter();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const [user, setUser] = useState<User | null>(null);

  const resolvedParams = use(params);

  useScreenProtection();

  const fetchUser = async () => {
    if (!isAuthenticated()) {
      setUser(null);
      return;
    }

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };


  useEffect(() => {
    fetchUser();
    const fetchCourse = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch(`/api/courses/${resolvedParams.id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setCourse(data);
        setSelectedVideo(data.videos[0]);

        // Redirect to purchase page if user doesn't have access
        if (data && !data.hasAccess) {
          router.push(`/courses/${resolvedParams.id}/purchase`);
          return;
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch course"
        );
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [resolvedParams.id, router]);

  const handleVideoSelect = (video: Video) => {
    console.log(video)
    setSelectedVideo(video);
  };

  // const trackCourseView = async () => {
  //   if (!course?._id) return;

  //   try {
  //     const token =
  //       localStorage.getItem("token") || sessionStorage.getItem("token");
  //     await fetch("/api/progress", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         courseId: course._id,
  //         type: "course",
  //       }),
  //     });
  //   } catch (error) {
  //     console.error("Failed to track course view:", error);
  //   }
  // };
  // trackCourseView();
  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading course...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  if (error) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-red-500/10 rounded-lg border border-red-500/20 max-w-md">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">
              Error Loading Course
            </h2>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  if (!course) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-white/10 max-w-md">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">
              Course Not Found
            </h2>
            <p className="text-gray-400">
              The course you're looking for doesn't exist or you don't have
              access to it.
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-violet-900/20 to-black/20">
        {!course.hasAccess ? (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-gray-800/50 rounded-xl p-8 border border-white/10">
              <h1 className="text-2xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-gray-400 mb-6">{course.description}</p>
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-6 mb-6">
                {course.privacy === "public" && course.price > 0 ? (
                  <p className="text-violet-200">
                    This course requires purchase to access the content.
                  </p>
                ) : course.privacy === "unlisted" ? (
                  <p className="text-violet-200">
                    This is an unlisted course. You need a valid access link to
                    view the content.
                  </p>
                ) : (
                  <p className="text-violet-200">
                    This is a private course. Please contact the administrator
                    for access.
                  </p>
                )}
              </div>
              {course.privacy === "public" && course.price > 0 && (
                <button
                  onClick={() => router.push(`/courses/${course._id}/purchase`)}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Purchase Course (${course.price})
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Main Video Section */}
            <div className="bg-gray-900 my-4 lg:my-6">
              <div className="max-w-[1280px] mx-auto px-4 lg:px-0">
                {selectedVideo ? (
                  <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
                    <video
                      ref={videoRef}
                      key={selectedVideo.url}
                      src={selectedVideo.url}
                      controls
                      className="w-full h-full"
                      playsInline
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                      onLoadedMetadata={() => {
                        if (
                          videoRef.current &&
                          progressMap[selectedVideo.url]
                        ) {
                          videoRef.current.currentTime =
                            progressMap[selectedVideo.url];
                        }
                      }}
                    >
                      <source src={selectedVideo.url} type="video/mp4" />
                      <source src={selectedVideo.url} type="video/webm" />
                      <p className="text-center p-4 bg-red-500/10 text-red-300">
                        Your browser doesn't support this video format. Please
                        try using a modern browser or contact support.
                      </p>
                    </video>
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg flex items-center justify-center text-gray-400 bg-gray-800/50">
                    No videos available
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="px-4 lg:px-8 py-4 lg:py-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Video Info */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedVideo && (
                    <>
                      <div className="space-y-4">
                        <h1 className="text-xl lg:text-2xl font-bold text-white">
                          {selectedVideo.title}
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="text-lg font-medium text-white">
                                {course.instructorName}
                              </h3>
                              <p className="text-sm text-gray-400">
                                Instructor
                              </p>
                            </div>
                          </div>

                          {/* Playback Speed Controls */}
                          <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg overflow-x-auto">
                            <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
                              Speed:
                            </span>
                            <div className="flex gap-1">
                              {speedOptions.map((speed) => (
                                <button
                                  key={speed.toString()}
                                  onClick={() => setPlaybackSpeed(speed)}
                                  className={`px-2.5 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                                    playbackSpeed === speed
                                      ? "bg-violet-600 text-white"
                                      : "text-gray-300 hover:bg-gray-700/50"
                                  }`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10">
                          <h2 className="text-lg font-medium text-white mb-2">
                            About this video
                          </h2>
                          <p className="text-gray-300 leading-relaxed">
                            {selectedVideo.bio}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Playlist */}
                <div className="bg-gray-800/50 rounded-xl p-4 h-fit lg:sticky lg:top-6">
                  <h3 className="text-lg font-medium text-white mb-4 px-2">
                    Course Content
                  </h3>
                  <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                    {course.videos.map((video, index) => (
                      <button
                        key={index}
                        onClick={() => handleVideoSelect(video)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedVideo?.url === video.url
                            ? "bg-violet-600"
                            : "hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                              selectedVideo?.url === video.url
                                ? "bg-white/20"
                                : "bg-gray-700"
                            }`}
                          >
                            <span className="text-sm font-medium">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h4
                              className={`text-sm font-medium ${
                                selectedVideo?.url === video.url
                                  ? "text-white"
                                  : "text-gray-300"
                              }`}
                            >
                              {video.title}
                            </h4>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
