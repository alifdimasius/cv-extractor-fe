"use server";

// Job creation request type - matching the sample request format
type JobCreateRequest = {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  // Removed responsibilities, industry, experienceLevel, and educationLevel - not supported by backend yet
  employmentType: string;
  remote: boolean;
  postingDate?: string;
  applicationDeadline?: string;
};

// Job response type
type JobResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export async function createJob(
  jobData: JobCreateRequest
): Promise<JobResponse> {
  const API_URL = "https://cvextractor.soljum.com";

  try {
    // Make the API request to create a job
    const response = await fetch(`${API_URL}/api/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
      cache: "no-store",
    });

    // Get the raw text response first
    const responseText = await response.text();

    // Then try to parse as JSON if possible
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Error parsing JSON response:", e);
      return {
        success: false,
        message: `Failed to parse server response: ${responseText.substring(
          0,
          100
        )}...`,
      };
    }

    // Check if the request was successful
    if (!response.ok) {
      return {
        success: false,
        message:
          result?.message ||
          `Failed to create job: ${response.status} ${response.statusText}`,
      };
    }

    return result;
  } catch (error) {
    console.error("Error in createJob:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
