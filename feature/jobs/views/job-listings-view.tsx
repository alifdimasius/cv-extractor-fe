"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Text,
  Button,
  TextInput,
  Group,
  Badge,
  Alert,
  Title,
  Container,
  Paper,
  Pagination,
  Skeleton,
  Modal,
  Tabs,
} from "@mantine/core";
import {
  IconSearch,
  IconAlertCircle,
  IconRefresh,
  IconBriefcase,
  IconBuilding,
  IconMapPin,
  IconCoin,
  IconSchool,
  IconChevronRight,
  IconPlus,
  IconEdit,
  IconUsers,
} from "@tabler/icons-react";
import { getJobs, JobData } from "../actions/get-jobs"; // Import JobData type
import { CreateOrUpdateJobForm } from "./create-or-update-job-form";
import { MatchingCVsView } from "./matching-cvs-view";

// Helper function to properly type-check the salary object
function isSalaryObject(
  salary: any
): salary is { min: number; max: number; currency: string } {
  return (
    typeof salary === "object" &&
    salary !== null &&
    "min" in salary &&
    "max" in salary &&
    "currency" in salary
  );
}

export function JobListingsView() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobData[]>([]); // Use JobData type
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null); // Use JobData type
  const [error, setError] = useState<string | null>(null);
  const [jobCount, setJobCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal and form state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null); // Use JobData type

  // Add state for active tab
  const [activeTab, setActiveTab] = useState<string | null>("details");

  // Load jobs when component mounts or pagination/search changes
  useEffect(() => {
    loadJobs();
  }, [currentPage, searchQuery]);

  // Load jobs from API
  const loadJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getJobs({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      });

      if (result.success && result.data) {
        setJobs(result.data.jobs);
        setJobCount(result.data.count);
        setTotalPages(
          result.data.pagination?.totalPages ||
            Math.ceil(result.data.count / itemsPerPage)
        );

        // If we had a selected job and it's still in the new results, update it
        if (selectedJobId) {
          const updatedSelectedJob = result.data.jobs.find(
            (job) => job._id === selectedJobId
          );
          if (updatedSelectedJob) {
            setSelectedJob(updatedSelectedJob);
          }
        }
      } else {
        setError(result.message || "Failed to load jobs");
        setJobs([]);
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setError("Failed to load job listings. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Select a job to display details and reset to details tab
  const selectJob = (job: JobData) => {
    setSelectedJobId(job._id);
    setSelectedJob(job);
    setActiveTab("details"); // Reset to details tab when selecting a new job
    console.log("Selected job:", job);
  };

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Function to handle job creation completion
  const handleJobFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingJob(null);
    loadJobs(); // Refresh the job list
  };

  // Open the form for creating a new job
  const openCreateJobForm = () => {
    setEditingJob(null);
    setIsFormModalOpen(true);
  };

  // Open the form for editing an existing job
  const openEditJobForm = (job: JobData) => {
    setEditingJob(job);
    setIsFormModalOpen(true);
  };

  return (
    <Container size="xl" className="py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title order={2} className="text-gray-800 mb-2">
            Job Listings
          </Title>
          <Text className="text-gray-600">
            Browse and search through available job positions.
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openCreateJobForm}
        >
          Create New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel - Job Search & List */}
        <div className="md:col-span-1">
          <Paper shadow="xs" p="md" radius="md" withBorder>
            <div className="mb-4">
              <Group mb="xs">
                <Text fw={600} size="lg" className="text-gray-700">
                  <IconBriefcase size={20} className="inline mr-2" />
                  Available Jobs
                </Text>
                <Badge size="lg">{jobCount}</Badge>
              </Group>

              <TextInput
                placeholder="Search jobs"
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.currentTarget.value)}
                mb="sm"
              />

              <Button
                variant="light"
                color="blue"
                onClick={() => {
                  setCurrentPage(1);
                  loadJobs();
                }}
                leftSection={<IconRefresh size={16} />}
                fullWidth
                className="mb-4"
                loading={loading}
              >
                Refresh List
              </Button>
            </div>

            {loading ? (
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} height={80} radius="sm" />
                  ))}
              </div>
            ) : error && jobs.length === 0 ? (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                title="Error"
              >
                {error}
              </Alert>
            ) : jobs.length > 0 ? (
              <div>
                <div className="space-y-3 mb-4">
                  {jobs.map((job) => (
                    <Card
                      key={job._id}
                      p="sm"
                      radius="md"
                      className={`cursor-pointer transition-all duration-200 relative ${
                        selectedJobId === job._id
                          ? "bg-blue-50 border-blue-500 shadow-md"
                          : "border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01]"
                      }`}
                      onClick={() => selectJob(job)}
                      withBorder
                    >
                      {selectedJobId === job._id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-md"></div>
                      )}
                      <div
                        className={`${selectedJobId === job._id ? "pl-2" : ""}`}
                      >
                        <Group justify="space-between" mb={2}>
                          <Text
                            fw={600}
                            size="sm"
                            lineClamp={1}
                            className="group-hover:text-blue-700"
                          >
                            {job.title}
                          </Text>
                          {selectedJobId === job._id ? (
                            <IconChevronRight
                              size={16}
                              className="text-blue-500"
                            />
                          ) : (
                            <IconChevronRight
                              size={16}
                              className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                        </Group>
                        <Group gap="xs" align="center">
                          <IconBuilding size={14} className="text-gray-500" />
                          <Text size="xs" color="dimmed" lineClamp={1}>
                            {job.company}
                          </Text>
                        </Group>
                        <Group gap="xs" align="center">
                          <IconMapPin size={14} className="text-gray-500" />
                          <Text size="xs" color="dimmed" lineClamp={1}>
                            {job.location}
                          </Text>
                        </Group>
                        <Group gap="xs" mt={4}>
                          <Badge size="xs" variant="light">
                            {job.jobType}
                          </Badge>
                          <Badge size="xs" variant="light" color="teal">
                            {job.experienceLevel}
                          </Badge>
                        </Group>
                      </div>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    value={currentPage}
                    onChange={setCurrentPage}
                    total={totalPages}
                    size="sm"
                    withEdges
                    className="flex justify-center"
                  />
                )}
              </div>
            ) : (
              <Text color="dimmed" className="text-center py-6">
                No jobs found{searchQuery ? " matching your search" : ""}
              </Text>
            )}
          </Paper>
        </div>

        {/* Right Panel - Job Details */}
        <div className="md:col-span-2">
          {selectedJob ? (
            <Paper shadow="xs" p="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <div>
                  <Title order={3}>{selectedJob.title}</Title>
                </div>
                <Button
                  variant="outline"
                  leftSection={<IconEdit size={16} />}
                  onClick={() => openEditJobForm(selectedJob)}
                >
                  Edit
                </Button>
              </Group>

              <Tabs value={activeTab} onChange={setActiveTab} mb="md">
                <Tabs.List>
                  <Tabs.Tab
                    value="details"
                    leftSection={<IconBriefcase size={16} />}
                  >
                    Job Details
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="candidates"
                    leftSection={<IconUsers size={16} />}
                  >
                    Matching Candidates
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>

              {activeTab === "details" ? (
                <>
                  <div className="mb-6">
                    <Group gap="xs" mb={8}>
                      <IconBuilding size={16} className="text-gray-500" />
                      <Text fw={500}>{selectedJob.company}</Text>
                      <Text color="dimmed">•</Text>
                      <IconMapPin size={16} className="text-gray-500" />
                      <Text>{selectedJob.location}</Text>
                    </Group>
                    <Group gap={8}>
                      <Badge size="lg" variant="light">
                        {selectedJob.jobType}
                      </Badge>
                      <Badge size="lg" variant="light" color="teal">
                        {selectedJob.experienceLevel}
                      </Badge>
                      <Badge size="lg" variant="light" color="violet">
                        {selectedJob.industry}
                      </Badge>
                      <Badge size="lg" variant="light" color="indigo">
                        <div className="flex items-center">
                          <IconSchool size={14} className="mr-2" />
                          {selectedJob.educationLevel}
                        </div>
                      </Badge>
                    </Group>
                    {selectedJob.salary && (
                      <Group gap="xs" mt={12}>
                        <IconCoin size={16} className="text-gray-700" />
                        <Text fw={500} className="text-gray-700">
                          {typeof selectedJob.salary === "string"
                            ? selectedJob.salary
                            : isSalaryObject(selectedJob.salary)}
                        </Text>
                      </Group>
                    )}
                  </div>

                  <div className="mb-6">
                    <Title order={5} className="mb-2">
                      Description
                    </Title>
                    <Text className="whitespace-pre-line">
                      {selectedJob.description}
                    </Text>
                  </div>

                  {selectedJob.requirements?.length > 0 && (
                    <div className="mb-6">
                      <Title order={5} className="mb-2">
                        Requirements
                      </Title>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedJob.responsibilities?.length > 0 && (
                    <div className="mb-6">
                      <Title order={5} className="mb-2">
                        Responsibilities
                      </Title>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedJob.responsibilities.map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedJob.skills?.length > 0 && (
                    <div>
                      <Title order={5}>Required Skills</Title>
                      <Group gap="xs">
                        {selectedJob.skills.map((skill, index) => (
                          <Badge key={index} size="md">
                            {skill}
                          </Badge>
                        ))}
                      </Group>
                    </div>
                  )}
                </>
              ) : (
                <MatchingCVsView
                  jobId={selectedJob._id}
                  jobTitle={selectedJob.title}
                />
              )}
            </Paper>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
              <IconBriefcase size={48} className="text-gray-400 mb-4" />
              <Text size="lg" fw={500} color="dimmed">
                Select a job to view details
              </Text>
              <Text
                size="sm"
                color="dimmed"
                className="max-w-md text-center mt-2"
              >
                Choose a job from the list on the left to display its details
                here
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Job Form */}
      <Modal
        opened={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingJob ? "Edit Job" : "Create New Job"}
        size="xl"
        centered
      >
        <CreateOrUpdateJobForm
          jobData={editingJob || undefined}
          onSuccess={handleJobFormSuccess}
        />
      </Modal>
    </Container>
  );
}
