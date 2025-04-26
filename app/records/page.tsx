import { ExistingRecordsView } from "@/feature/cv-extraction/views/existing-records-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Existing Records | CV Extractor",
  description: "Browse and search through previously extracted CV information",
};

export default function ExistingRecordsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <ExistingRecordsView />
    </div>
  );
}
