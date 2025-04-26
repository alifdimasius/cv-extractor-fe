"use server";

// Sample CV extraction results
const sampleResults = [
  {
    id: "cv-001",
    fileName: "john_doe_resume.pdf",
    extractedData: {
      personalInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/johndoe",
        summary:
          "Experienced software engineer with 5+ years developing scalable web applications.",
      },
      education: [
        {
          institution: "Stanford University",
          degree: "Master of Science",
          field: "Computer Science",
          startDate: "2015-09",
          endDate: "2017-06",
          gpa: "3.8",
        },
        {
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science",
          field: "Computer Engineering",
          startDate: "2011-09",
          endDate: "2015-05",
          gpa: "3.7",
        },
      ],
      experience: [
        {
          company: "Tech Innovations Inc.",
          position: "Senior Software Engineer",
          startDate: "2020-03",
          endDate: "Present",
          location: "San Francisco, CA",
          description: "Leading development of cloud-native applications.",
          achievements: [
            "Reduced application load time by 40% through code optimization",
            "Led a team of 5 engineers in developing a new microservice architecture",
            "Implemented CI/CD pipeline reducing deployment time by 60%",
          ],
        },
        {
          company: "DataSoft Solutions",
          position: "Software Engineer",
          startDate: "2017-07",
          endDate: "2020-02",
          location: "San Jose, CA",
          description:
            "Full-stack development using React, Node.js and MongoDB.",
          achievements: [
            "Developed RESTful APIs for mobile applications",
            "Implemented authentication using JWT tokens",
            "Optimized database queries improving performance by 30%",
          ],
        },
      ],
      skills: [
        {
          category: "Programming Languages",
          skills: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
        },
        {
          category: "Frameworks & Libraries",
          skills: ["React", "Node.js", "Express", "Django", "Spring Boot"],
        },
        {
          category: "Tools & Technologies",
          skills: ["Git", "Docker", "Kubernetes", "AWS", "CI/CD", "Jest"],
        },
      ],
    },
    confidence: 0.92,
    processedAt: "2023-08-15T14:32:11Z",
  },
  {
    id: "cv-002",
    fileName: "jane_smith_cv.pdf",
    extractedData: {
      personalInfo: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 987-6543",
        location: "New York, NY",
        linkedin: "linkedin.com/in/janesmith",
        summary:
          "Product manager with expertise in SaaS products and agile methodologies.",
      },
      education: [
        {
          institution: "Harvard Business School",
          degree: "Master of Business Administration",
          field: "Product Management",
          startDate: "2016-09",
          endDate: "2018-05",
        },
        {
          institution: "Cornell University",
          degree: "Bachelor of Arts",
          field: "Economics",
          startDate: "2012-08",
          endDate: "2016-05",
          gpa: "3.9",
        },
      ],
      experience: [
        {
          company: "Innovative Products Co.",
          position: "Senior Product Manager",
          startDate: "2020-01",
          endDate: "Present",
          location: "New York, NY",
          description:
            "Leading product strategy and roadmap for SaaS platform.",
          achievements: [
            "Increased user retention by 25% through feature enhancements",
            "Coordinated cross-functional teams to deliver quarterly releases",
            "Conducted user research to identify market opportunities",
          ],
        },
        {
          company: "TechStart Inc.",
          position: "Product Manager",
          startDate: "2018-06",
          endDate: "2019-12",
          location: "Boston, MA",
          description: "Managed product lifecycle from conception to launch.",
          achievements: [
            "Launched 3 successful product features that increased revenue by 18%",
            "Collaborated with design and engineering teams to implement user feedback",
            "Created product documentation and training materials",
          ],
        },
      ],
      skills: [
        {
          category: "Product Management",
          skills: [
            "Product Strategy",
            "Roadmapping",
            "User Research",
            "A/B Testing",
            "Analytics",
          ],
        },
        {
          category: "Tools",
          skills: [
            "JIRA",
            "Confluence",
            "Figma",
            "Google Analytics",
            "Mixpanel",
          ],
        },
        {
          category: "Methodologies",
          skills: [
            "Agile",
            "Scrum",
            "Kanban",
            "Lean Startup",
            "Design Thinking",
          ],
        },
      ],
    },
    confidence: 0.88,
    processedAt: "2023-08-15T15:10:22Z",
  },
  {
    id: "cv-003",
    fileName: "michael_johnson_resume.pdf",
    extractedData: {
      personalInfo: {
        name: "Michael Johnson",
        email: "michael.johnson@example.com",
        phone: "+1 (555) 234-5678",
        location: "Austin, TX",
        linkedin: "linkedin.com/in/michaeljohnson",
        summary:
          "Data scientist specializing in machine learning and AI solutions.",
      },
      education: [
        {
          institution: "MIT",
          degree: "Ph.D.",
          field: "Computer Science, Machine Learning",
          startDate: "2015-09",
          endDate: "2019-05",
        },
        {
          institution: "Georgia Tech",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2011-08",
          endDate: "2015-05",
          gpa: "4.0",
        },
      ],
      experience: [
        {
          company: "AI Solutions Corp.",
          position: "Lead Data Scientist",
          startDate: "2021-04",
          endDate: "Present",
          location: "Austin, TX",
          description:
            "Developing machine learning models for predictive analytics.",
          achievements: [
            "Built recommendation system increasing customer engagement by 35%",
            "Implemented NLP algorithms for text classification with 92% accuracy",
            "Developed computer vision solution for quality control automation",
          ],
        },
        {
          company: "Data Insights Inc.",
          position: "Data Scientist",
          startDate: "2019-06",
          endDate: "2021-03",
          location: "Seattle, WA",
          description: "Created data-driven solutions for business problems.",
          achievements: [
            "Developed customer churn prediction model with 87% accuracy",
            "Optimized marketing campaigns resulting in 22% increased ROI",
            "Created dashboards for real-time business intelligence",
          ],
        },
      ],
      skills: [
        {
          category: "Programming",
          skills: ["Python", "R", "SQL", "Java", "Scala"],
        },
        {
          category: "ML/AI",
          skills: [
            "TensorFlow",
            "PyTorch",
            "Scikit-learn",
            "NLP",
            "Computer Vision",
          ],
        },
        {
          category: "Tools & Technologies",
          skills: [
            "Jupyter",
            "Pandas",
            "NumPy",
            "Spark",
            "Hadoop",
            "AWS SageMaker",
          ],
        },
      ],
    },
    confidence: 0.95,
    processedAt: "2023-08-15T16:45:33Z",
  },
];

export async function uploadCV(formData: FormData) {
  // In a real implementation, this would process the files and send them to a backend
  // For now, we'll just return our sample data

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return sample extraction results
  return { success: true, results: sampleResults };
}
