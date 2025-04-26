"use server";

type CVExtractResponse = {
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
    publications?: Array<any>;
    awards?: Array<any>;
    references?: Array<any>;
    rawText?: string;
    _id?: string;
    extractedAt?: string;
    __v?: number;
  };
};

export async function uploadCV(formData: FormData) {
  try {
    // Create a new FormData to send to API
    const apiFormData = new FormData();

    // Extract files from the form data and append them to apiFormData
    const files = formData.getAll("files");
    files.forEach((file) => {
      apiFormData.append("cv", file);
    });

    // Make the API call to extract CV data
    const response = await fetch(
      "https://cvextractor.soljum.com/api/cv/extract",
      {
        method: "POST",
        body: apiFormData,
        // No need to set Content-Type header, it will be set automatically for FormData
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      return {
        success: false,
        message: `API request failed with status: ${response.status}`,
        results: [],
      };
    }

    // Parse API response
    const responseData = await response.json();

    // Handle multiple files case
    const results = Array.isArray(responseData.data)
      ? responseData.data.map(formatResult)
      : [formatResult(responseData.data)];

    return { success: true, results };
  } catch (error) {
    console.error("CV upload error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      results: [],
    };
  }
}

// Format CV data to match our application structure
function formatResult(data: CVExtractResponse["data"]) {
  // Generate a random ID if none exists
  const id = data._id || `cv-${Math.random().toString(36).substring(2, 10)}`;

  return {
    id,
    fileName: data.fileName,
    extractedData: {
      personalInfo: {
        name: data.personalInfo.name || "Unknown",
        email: data.personalInfo.email,
        phone: data.personalInfo.phone,
        location: data.personalInfo.location,
        linkedin: data.personalInfo.linkedin,
        website: data.personalInfo.website,
        summary: data.personalInfo.summary,
      },
      education: data.education || [],
      experience: data.experience || [],
      skills: data.skills || [],
      certifications: data.certifications || [],
      languages: data.languages || [],
      projects: data.projects || [],
      publications: data.publications || [],
      awards: data.awards || [],
      references: data.references || [],
    },
  };
}
