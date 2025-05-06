import { JobListingsView } from "@/feature/jobs/views/job-listings-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Listings | CV Extractor",
  description: "Browse and search through job listings",
};

export default function JobListingsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <JobListingsView />
    </div>
  );
}
