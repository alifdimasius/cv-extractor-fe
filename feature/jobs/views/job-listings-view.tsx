"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Text,
  Button,
  TextInput,
  Group,
  Badge,
  Loader,
  Alert,
  Title,
  Container,
  Paper,
  Pagination,
  Skeleton,
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
} from "@tabler/icons-react";
import { getJobs } from "../actions/get-jobs";

type Job = {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  responsibilities: string[];
  location: string;
  salary: string;
  jobType: string;
  industry: string;
  experienceLevel: string;
  educationLevel: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export function JobListingsView() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobCount, setJobCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

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

  // Select a job to display details
  const selectJob = (job: Job) => {
    setSelectedJobId(job._id);
    setSelectedJob(job);
  };

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <Container size="xl" className="py-8">
      <div className="mb-6">
        <Title order={2} className="text-gray-800 mb-2">
          Job Listings
        </Title>
        <Text className="text-gray-600">
          Browse and search through available job positions.
        </Text>
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
              <div className="mb-6">
                <Title order={3}>{selectedJob.title}</Title>
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
                      {selectedJob.salary}
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
                  <Title
                    order={5}
                    className="hover:bg-blue-50 transition-colors mb-2"
                  >
                    Required Skills
                  </Title>
                  <Group gap="xs">
                    {selectedJob.skills.map((skill, index) => (
                      <Badge key={index} size="md">
                        {skill}
                      </Badge>
                    ))}
                  </Group>
                </div>
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
    </Container>
  );
}
