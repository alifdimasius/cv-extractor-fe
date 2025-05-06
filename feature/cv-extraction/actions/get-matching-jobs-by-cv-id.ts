"use server";

import { revalidateTag } from "next/cache";

// Types for matching jobs response
export type MatchAnalysis = {
  score: number;
  analysis: string;
};

export type JobMatch = {
  job: {
    id: string;
    title: string;
    company: string;
  };
  score: number;
  matchDetails: {
    skills: MatchAnalysis;
    experience: MatchAnalysis;
    education: MatchAnalysis;
    overall: MatchAnalysis;
  };
  fromCache: boolean;
};

export type MatchingJobsResponse = {
  success: boolean;
  message: string;
  data: {
    cvId: string;
    matches: JobMatch[];
  };
};

export async function getMatchingJobsByCV(
  cvId: string,
  limit: number = 10,
  refresh: boolean = false
): Promise<MatchingJobsResponse | undefined> {
  try {
    const apiUrl = "https://cvextractor.soljum.com";

    if (!apiUrl) {
      throw new Error("API URL is not defined in environment variables");
    }

    // Create a unique cache tag for this CV ID
    const cacheTag = `cv-jobs-match-${cvId}`;

    // If refresh is requested, invalidate the cache for this CV ID
    if (refresh) {
      revalidateTag(cacheTag);
    }

    const response = await fetch(
      `${apiUrl}/api/cv/${cvId}/jobs?limit=${limit}&refresh=${refresh}`,
      {
        next: {
          tags: [cacheTag],
          // Cache for 1 hour by default unless refreshed
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch matching jobs");
    }

    const data: MatchingJobsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching matching jobs:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {
        cvId,
        matches: [],
      },
    };
  }
}
