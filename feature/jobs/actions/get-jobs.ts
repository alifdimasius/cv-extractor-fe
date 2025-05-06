"use server";

// Updated type definitions based on the actual API response
type JobsResponse = {
  success: boolean;
  message: string;
  data: {
    jobs: JobData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
};

export type JobData = {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  responsibilities: string[];
  location: string;
  salary: string;
  jobType: string;
  industry: string;
  experienceLevel: string;
  educationLevel: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export async function getJobs({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    const response = await fetch(
      `https://cvextractor.soljum.com/api/jobs?${queryParams}`
    );

    if (!response.ok) {
      console.error("Failed to fetch jobs:", response.statusText);
      return {
        success: false,
        message: `Error: ${response.statusText}`,
        data: null,
      };
    }

    const data: JobsResponse = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message,
        data: null,
      };
    }

    return {
      success: true,
      message: "Successfully fetched jobs",
      data: {
        jobs: data.data.jobs,
        count: data.data.pagination.total,
        pagination: data.data.pagination,
      },
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      success: false,
      message,
      data: null,
    };
  }
}
