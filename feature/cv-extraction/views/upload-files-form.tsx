"use client";

import {
  FileInput,
  FileInputProps,
  Pill,
  Button,
  Text,
  Box,
  Transition,
  Alert,
} from "@mantine/core";
import { useState } from "react";
import {
  IconUpload,
  IconFile,
  IconTrash,
  IconCheck,
  IconAlertCircle,
  IconArrowRight,
} from "@tabler/icons-react";
import { uploadCV } from "../actions/upload-cv";
import { ResultsSection } from "./results-section";

const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  if (Array.isArray(value)) {
    return (
      <Box className="flex flex-wrap gap-1.5 mt-2">
        {value.map((file, index) => (
          <Pill
            key={index}
            withRemoveButton={false}
            className="bg-blue-50 text-blue-700 border border-blue-100"
          >
            {file.name}
          </Pill>
        ))}
      </Box>
    );
  }

  return (
    <Pill className="bg-blue-50 text-blue-700 border border-blue-100">
      {value.name}
    </Pill>
  );
};

export function UploadFilesForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processStatus, setProcessStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [results, setResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClear = () => {
    setFiles([]);
    setIsLoading(false);
    setProcessStatus("idle");
    setResults([]);
    setErrorMessage(null);
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await uploadCV(formData);

      if (response.success) {
        setResults(response.results);
        setProcessStatus("success");
      } else {
        setProcessStatus("error");
        setErrorMessage(
          response.message || "Failed to process CV files. Please try again."
        );
      }
    } catch (error) {
      console.error("Error processing files:", error);
      setProcessStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.07)] overflow-hidden border border-gray-100">
      <div className="p-1">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-3/4 p-6">
            <p className="text-xl font-semibold text-gray-800 mb-2">
              Upload Documents
            </p>
            <p className="text-gray-500 mb-6">
              Select multiple CV files to begin processing
            </p>

            <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-all duration-300 p-8">
              <FileInput
                multiple
                label={
                  <Text fw={500} size="md" className="text-gray-700">
                    CV Files
                  </Text>
                }
                placeholder="Drag files here or click to browse"
                accept="application/pdf, image/png, image/jpeg"
                onChange={setFiles}
                value={files}
                description={"PDF files up to 10MB supported"}
                valueComponent={ValueComponent}
                styles={{
                  input: {
                    minHeight: "100px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "40px",
                    textAlign: "left",
                    border: "none",
                    background: "transparent",
                    fontSize: "1rem",
                    color: "#4B5563",
                  },
                  label: {
                    textAlign: "left",
                    marginBottom: "8px",
                  },
                  root: {
                    marginBottom: "8px",
                  },
                }}
              />
            </div>

            {isLoading && (
              <div className="mt-6 flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                <Text size="sm" fw={500} className="text-gray-700">
                  Processing your files... This may take a minute.
                </Text>
              </div>
            )}

            {processStatus === "success" && !isLoading && (
              <div className="mt-6 flex items-center space-x-3 text-green-600">
                <IconCheck size={18} />
                <Text size="sm" fw={500}>
                  Files processed successfully!
                </Text>
              </div>
            )}

            {processStatus === "error" && !isLoading && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Processing Error"
                color="red"
                className="mt-6"
              >
                {errorMessage || "There was an error processing your files."}
              </Alert>
            )}

            <div className="flex space-x-4 mt-8">
              {files.length > 0 && processStatus === "idle" && !isLoading && (
                <Button
                  variant="filled"
                  color="blue"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-transform duration-200 hover:scale-105"
                  rightSection={<IconArrowRight size={16} />}
                  onClick={processFiles}
                  loading={isLoading}
                >
                  Process CVs
                </Button>
              )}

              {files.length > 0 && (
                <Button
                  variant="light"
                  color="gray"
                  leftSection={<IconTrash size={16} />}
                  onClick={handleClear}
                  className="hover:bg-gray-100"
                  disabled={isLoading}
                >
                  Clear Files
                </Button>
              )}
            </div>

            {processStatus === "success" &&
              !isLoading &&
              results.length > 0 && (
                <div className="mt-10">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      Extracted Results
                    </h3>
                    <p className="text-sm text-gray-500">
                      We've analyzed your CVs and extracted the following
                      information.
                    </p>
                  </div>
                  <ResultsSection resultsData={results} />
                </div>
              )}
          </div>

          <div className="w-full md:w-1/4 bg-gradient-to-b from-gray-50 to-indigo-50 border-l border-gray-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Text fw={600} className="text-gray-800">
                Selected Files
              </Text>
              <Pill className="bg-blue-100 text-blue-700 font-medium">
                {files.length}
              </Pill>
            </div>

            {files.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-auto pr-1">
                {Array.from(files).map((file, index) => (
                  <Transition
                    key={index}
                    mounted={true}
                    transition="slide-left"
                    duration={300}
                    timingFunction="ease"
                  >
                    {(styles) => (
                      <Box
                        style={styles}
                        className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-50 rounded mr-3">
                            <IconFile size={18} className="text-blue-500" />
                          </div>
                          <div className="text-xs">
                            <p className="text-gray-800 line-clamp-1">
                              {file.name}
                            </p>
                            <div className="flex items-center mt-1">
                              <p className="mr-3">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                              <p className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                                PDF
                              </p>
                            </div>
                          </div>
                        </div>
                      </Box>
                    )}
                  </Transition>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <div className="p-3 bg-blue-50 rounded-full mb-3">
                  <IconUpload size={24} className="text-blue-400" />
                </div>
                <Text c="dimmed" size="sm" className="max-w-[200px]">
                  Upload PDF files to see them listed here
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
