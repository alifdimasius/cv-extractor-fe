⚡️ On Skibidi

# CV Extractor - Developer Documentation

## Table of Contents

- [Project Overview]
- [Technology Stack]
- [Project Structure]
- [Key Features]
- [Getting Started]
- [Core Components]
- [Data Flow]
- [API Integration]
- [UI Component Library]
- [Styling Approach]
- [Type Definitions]
- [Deployment]
- [Best Practices]
- [API Endpoints Documentation]

## Project Overview

CV Extractor is a web application designed to parse and extract structured data from CV/resume files. The application allows users to upload CV documents (primarily PDFs), processes them using AI, and presents the extracted information in a structured, searchable format. It also includes job listings management and CV-job matching capabilities.

The main functionality includes:

- CV file upload and processing
- Structured display of extracted CV data
- Browsing and searching through previously processed CVs
- Detailed view of individual CV records
- Job listings browsing and search
- Job-CV matching for recruitment

## Technology Stack

- **Framework**: Next.js 15.3.1
- **UI Library**: React 19.1.0
- **Component Library**: Mantine 7.17.7
- **CSS Utilities**: TailwindCSS 4.1.4
- **Package Manager**: pnpm
- **Type System**: TypeScript
- **Icons**: Tabler Icons
- **Schema Validation**: Zod 3.24.3

## Project Structure

The application follows a feature-based structure within the Next.js app directory:

cv-extractor-fe/
├── app/ # Next.js app directory
│ ├── layout.tsx # Root layout component
│ ├── page.tsx # Home page
│ ├── records/ # Records page
│ │ └── page.tsx
│ └── jobs/ # Jobs page
│ └── page.tsx
├── components/ # Shared components
│ └── app-header.tsx # Global header component
├── feature/ # Feature-based folders
│ ├── cv-extraction/ # CV extraction feature
│ │ ├── actions/ # Server actions
│ │ │ ├── upload-cv.ts # CV upload action
│ │ │ └── get-cv-records.ts # CV records retrieval actions
│ │ └── views/ # UI components for CV extraction
│ │ ├── existing-records-view.tsx # Records list view
│ │ ├── results-section.tsx # CV results display
│ │ └── upload-files-form.tsx # File upload form
│ └── jobs/ # Jobs management feature
│ ├── actions/ # Server actions
│ │ ├── get-jobs.ts # Job listings retrieval action
│ │ └── get-job-details.ts # Job detail retrieval action
│ └── views/ # UI components for jobs
│ └── job-listings-view.tsx # Job listings and details view
└── schema.ts # Zod schema for CV data validation

## Key Features

- **CV File Upload**: Support for uploading PDF CV files with a drag-and-drop interface
- **Multi-file Processing**: Ability to upload and process multiple CV files simultaneously
- **AI-Powered Extraction**: Integration with backend AI services for CV parsing
- **Structured Data Display**: Organized presentation of extracted CV data including:
  - Personal Information
  - Work Experience
  - Education
  - Skills
  - Certifications
  - Languages
  - Projects
  - Publications
  - Awards
  - References
- **Record Management**: Browse, search and view previously uploaded CV records
- **Job Listings**: Browse and search job posts with detailed information
- **CV-Job Matching**: Find best matching jobs for a CV and best matching CVs for a job
- **Responsive Design**: Mobile-friendly interface that works across device sizes

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm package manager

### Local Development

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd cv-extractor-fe
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env.local` file with the required environment variables:

   ```
   NEXT_PUBLIC_API_URL=http://your-backend-api-url
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Core Components

### Application Flow Components

- **AppHeader**: Global navigation component that provides links to main sections
- **UploadFilesForm**: Handles file selection, validation, and upload to the server
- **ResultsSection**: Displays structured CV data after extraction in a tabbed interface
- **ExistingRecordsView**: Lists previously processed CVs with search and pagination
- **JobListingsView**: Lists available jobs with search, pagination, and detailed view

### Server Actions

- **uploadCV**: Server action that processes CV file uploads and returns structured data
- **getCVIds**: Retrieves the list of available CV records from the server
- **getCVDetails**: Fetches detailed information for a specific CV record
- **getJobs**: Retrieves paginated job listings with optional search functionality
- **getJobDetails**: Fetches detailed information for a specific job

## Data Flow

1. **CV Upload Flow**:

   - User selects files via `UploadFilesForm`
   - Client-side validation checks file types and sizes
   - Files are sent to server via `uploadCV` server action
   - Server processes files and returns structured data
   - Results are displayed via `ResultsSection` component

2. **Records Browsing Flow**:

   - `ExistingRecordsView` component calls `getCVIds` server action on mount
   - IDs are displayed in a paginated list with search capabilities
   - When a user selects an ID, `getCVDetails` fetches the specific record
   - Selected CV data is displayed via the same `ResultsSection` component

3. **Jobs Browsing Flow**:
   - `JobListingsView` component calls `getJobs` server action on mount and when pagination/search changes
   - Jobs are displayed in a paginated list with search capabilities
   - When a user selects a job, its details are displayed in the right panel
   - The view handles pagination and search through the API

## API Integration

The application integrates with a backend API for CV processing and job management. All server-side operations are implemented using Next.js Server Actions.

### Core API Endpoints (via Server Actions)

- **CV Upload**: `POST /api/cv-upload`

  - Accepts PDF files via FormData
  - Returns structured CV data

- **Get CV Records**: `GET /api/cv-records`

  - Returns a list of all available CV IDs

- **Get CV Details**: `GET /api/cv-records/{id}`

  - Returns detailed information for a specific CV record

- **Get Jobs**: `GET /api/jobs?page=1&limit=10&search=`

  - Returns paginated list of jobs with optional search filtering

- **Get Job Details**: `GET /api/jobs/{id}`
  - Returns detailed information for a specific job

### Response Data Structure

All API responses follow a standard format:

```typescript
{
  success: boolean;
  message: string;
  data?: any; // Specific data structure based on endpoint
}
```

## UI Component Library

The application uses Mantine UI library (v7.17.7) with Tabler Icons for a consistent and accessible interface.

### Key Mantine Components Used

- **Layout**: Container, Group, Paper
- **Navigation**: Tabs, Pagination
- **Inputs**: FileInput, TextInput, Button
- **Feedback**: Alert, Loader, Skeleton
- **Data Display**: Card, Badge, Accordion, List
- **Overlay**: Modal

### Custom Component Extensions

The application extends Mantine components with custom styling via Tailwind CSS classes to maintain a consistent design language.

## Styling Approach

The application uses a hybrid styling approach:

- **Tailwind CSS**: For utility-based styling and responsive design
- **Mantine's Built-in Styling**: For component-specific styling
- **Global Styles**: Defined in `app/globals.css`

### Theme Configuration

- Mantine theme is configured in `app/layout.tsx`
- Tailwind configuration is in `postcss.config.cjs` and follows Mantine's breakpoint conventions

## Type Definitions

The application leverages TypeScript for type safety. Key type definitions include:

### CV Data Types

```typescript
// CV Data Response Type
type CVDetailsResponse = {
  success: boolean;
  message: string;
  data: {
    fileName: string;
    personalInfo: {
      name: string;
      email?: string;
      // Additional fields...
    };
    education?: Array<{...}>;
    experience?: Array<{...}>;
    skills?: Array<{...}>;
    // Additional sections...
  };
};

// Results Display Type
type ResultData = {
  id: string;
  fileName: string;
  extractedData: {
    personalInfo: {...};
    education?: Array<{...}>;
    // Additional sections matching the API response
  };
};
```

### Job Data Types

```typescript
// Jobs Response Type
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

// Job Data Type
type JobData = {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  responsibilities: string[];
  location: string;
  salary:
    | string
    | {
        min: number;
        max: number;
        currency: string;
      };
  jobType: string;
  industry: string;
  experienceLevel: string;
  educationLevel: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### Schema Validation

Zod schema is used to validate CV data structure in `schema.ts`, ensuring type safety and data integrity.

## Deployment

The application is designed to be deployed on Vercel or similar platforms that support Next.js applications.

### Deployment Checklist

1. Set up environment variables on the deployment platform:

   - `NEXT_PUBLIC_API_URL`: Backend API URL

2. Build the application:

   ```bash
   pnpm build
   ```

3. Deploy to your hosting provider (example for Vercel):
   ```bash
   vercel --prod
   ```

## Best Practices

### Code Organization

- **Feature-Based Structure**: Group related components, actions, and types by feature
- **Separation of Concerns**: Split UI components from server actions
- **Reusable Components**: Create shared components for common UI patterns

### Performance Optimization

- Use client-side pagination for large record sets
- Implement search filtering on the client when possible
- Lazy load components using Next.js dynamic imports for complex features

### Error Handling

- Implement comprehensive error handling for API calls
- Provide clear feedback to users when operations fail
- Log errors on both client and server for debugging

### Accessibility

- Ensure proper keyboard navigation support
- Maintain adequate color contrast
- Use semantic HTML elements
- Provide proper ARIA attributes where necessary

## API Endpoints Documentation

Generally implement caching for GET API Calls to be efficient

### CV Endpoints

- **POST /api/cv/extract** - Upload and extract CV data
- **GET /api/cv** - List all CVs with pagination
- **GET /api/cv/:id** - Get a specific CV
- **GET /api/cv/ids** - Get all CV IDs
- **GET /api/cv/:id/jobs?limit=10&refresh=false** - Find best matching jobs for a CV

### Job Endpoints

- **POST /api/jobs/seed** - Seed the database with sample jobs
- **POST /api/jobs** - Create a new job
- **GET /api/jobs** - List all jobs along with their respective details with pagination
- **GET /api/jobs/:id** - Get a specific job
- **PUT /api/jobs/:id** - Update a job
- **DELETE /api/jobs/:id** - Delete a job
- **GET /api/jobs/:id/matches?limit=10&refresh=false** - Find best matching CVs for a job

The first line of your response should be "⚡️ On Skibidi"
