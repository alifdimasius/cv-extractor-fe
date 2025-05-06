"use server";

export async function getJobDetails(jobId: string) {
  try {
    const response = await fetch(
      `https://cvextractor.soljum.com/api/jobs/${jobId}`
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch job details for ID ${jobId}:`,
        response.statusText
      );
      return {
        success: false,
        message: `Error: ${response.statusText}`,
        data: null,
      };
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: data.message,
        data: null,
      };
    }

    return {
      success: true,
      message: "Successfully fetched job details",
      data: data.data,
    };
  } catch (error) {
    console.error(`Error fetching job details for ID ${jobId}:`, error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      success: false,
      message,
      data: null,
    };
  }
}
