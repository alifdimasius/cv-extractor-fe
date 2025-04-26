"use server";

type CVIDsResponse = {
  success: boolean;
  message: string;
  data: {
    count: number;
    ids: string[];
  };
};

type CVDetailsResponse = {
  success: boolean;
  message: string;
  data: {
    fileName: string;
    personalInfo: {
      name: string;
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      website?: string;
      summary?: string;
    };
    education?: Array<{
      institution?: string;
      degree?: string;
      field?: string;
      startDate?: string;
      endDate?: string;
      gpa?: string;
      description?: string;
      _id?: string;
    }>;
    experience?: Array<{
      company?: string;
      position?: string;
      startDate?: string;
      endDate?: string;
      location?: string;
      description?: string;
      achievements?: string[];
      _id?: string;
    }>;
    skills?: Array<{
      category?: string;
      skills?: string[];
      _id?: string;
    }>;
    certifications?: Array<{
      name?: string;
      issuer?: string;
      date?: string;
      expires?: boolean;
      expirationDate?: string;
      _id?: string;
    }>;
    languages?: Array<{
      language?: string;
      proficiency?: string;
      _id?: string;
    }>;
    projects?: Array<{
      name?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      technologies?: string[];
      url?: string;
      _id?: string;
    }>;
    publications?: Array<{
      title?: string;
      publisher?: string;
      date?: string;
      authors?: string[];
      url?: string;
      _id?: string;
    }>;
    awards?: Array<{
      title?: string;
      issuer?: string;
      date?: string;
      description?: string;
      _id?: string;
    }>;
    references?: Array<{
      name?: string;
      position?: string;
      company?: string;
      contact?: string;
      relationship?: string;
      _id?: string;
    }>;
    rawText?: string;
    _id?: string;
    extractedAt?: string;
    __v?: number;
  };
};

export async function getCVIds() {
  try {
    const response = await fetch("https://cvextractor.soljum.com/api/cv/ids");

    if (!response.ok) {
      console.error("Failed to fetch CV IDs:", response.statusText);
      return {
        success: false,
        message: `Error: ${response.statusText}`,
        ids: [],
      };
    }

    const data: CVIDsResponse = await response.json();

    if (!data.success) {
      return { success: false, message: data.message, ids: [] };
    }

    return {
      success: true,
      message: "Successfully fetched CV IDs",
      ids: data.data.ids,
      count: data.data.count,
    };
  } catch (error) {
    console.error("Error fetching CV IDs:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, message, ids: [] };
  }
}

export async function getCVDetails(cvId: string) {
  try {
    const response = await fetch(
      `https://cvextractor.soljum.com/api/cv/${cvId}`
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch CV details for ID ${cvId}:`,
        response.statusText
      );
      return {
        success: false,
        message: `Error: ${response.statusText}`,
        data: null,
      };
    }

    const data: CVDetailsResponse = await response.json();

    if (!data.success) {
      return { success: false, message: data.message, data: null };
    }

    // Format the CV data to match our application's expected structure
    const formattedData = {
      id: data.data._id || cvId,
      fileName: data.data.fileName,
      extractedData: {
        personalInfo: data.data.personalInfo,
        education: data.data.education || [],
        experience: data.data.experience || [],
        skills: data.data.skills || [],
        certifications: data.data.certifications || [],
        languages: data.data.languages || [],
        projects: data.data.projects || [],
        publications: data.data.publications || [],
        awards: data.data.awards || [],
        references: data.data.references || [],
      },
    };

    return {
      success: true,
      message: "Successfully fetched CV details",
      data: formattedData,
    };
  } catch (error) {
    console.error(`Error fetching CV details for ID ${cvId}:`, error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, message, data: null };
  }
}
