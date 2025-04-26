import { UploadFilesForm } from "@/feature/cv-extraction/views/upload-files-form";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-6xl">
        <div className="mb-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
              CV Extractor
            </h1>
            <p className="mt-4 text-gray-600 text-xl max-w-2xl mx-auto">
              Transform your recruitment process with our advanced CV parsing
              technology
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100 shadow-sm">
                AI-Powered Analysis
              </span>
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 shadow-sm">
                99.8% Accuracy
              </span>
              <span className="px-4 py-1.5 bg-violet-50 text-violet-700 rounded-full text-sm font-medium border border-violet-100 shadow-sm">
                Enterprise Ready
              </span>
            </div>
          </div>
          <div className="transform transition-all duration-500 hover:scale-[1.01]">
            <UploadFilesForm />
          </div>
        </div>
      </div>
    </div>
  );
}
