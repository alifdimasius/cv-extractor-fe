"use server";

// Types for the matching CVs response
type CVMatch = {
  cv: {
    id: string;
    name: string;
    email: string;
  };
  score: number;
  matchDetails: {
    skills: {
      score: number;
      analysis: string;
    };
    experience: {
      score: number;
      analysis: string;
    };
    education: {
      score: number;
      analysis: string;
    };
    overall: {
      score: number;
      analysis: string;
    };
  };
  fromCache: boolean;
};

type MatchingCVsResponse = {
  success: boolean;
  message: string;
  data?: {
    jobId: string;
    matches: CVMatch[];
  };
};

// Simple cache to store responses
const matchesCache: Record<
  string,
  { data: MatchingCVsResponse; timestamp: number }
> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function getMatchingCVs(
  jobId: string,
  options: { refresh?: boolean; limit?: number } = {}
): Promise<MatchingCVsResponse> {
  const { refresh = false, limit = 8 } = options;

  // Create a unique cache key based on job ID and limit
  const cacheKey = `${jobId}-${limit}`;
  const currentTime = Date.now();

  // Use cache if available and not forcing refresh
  if (
    !refresh &&
    matchesCache[cacheKey] &&
    currentTime - matchesCache[cacheKey].timestamp < CACHE_DURATION
  ) {
    return matchesCache[cacheKey].data;
  }

  const API_URL = "https://cvextractor.soljum.com";

  try {
    const response = await fetch(
      `${API_URL}/api/jobs/${jobId}/matches?limit=${limit}&refresh=${refresh}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Prevent Next.js from caching this request
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch matching CVs: ${response.status} ${response.statusText}`,
      };
    }

    const data: MatchingCVsResponse = await response.json();

    // Update cache with new response
    matchesCache[cacheKey] = {
      data,
      timestamp: currentTime,
    };

    return data;
  } catch (error) {
    console.error("Error fetching matching CVs:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
