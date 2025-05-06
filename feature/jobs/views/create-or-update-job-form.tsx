"use client";

import { useState } from "react";
import { JobData } from "../actions/get-jobs";
import { createJob } from "../actions/create-job";
import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Switch,
  Button,
  Group,
  Paper,
  Title,
  Stack,
  Divider,
  TagsInput,
  Alert,
  Box,
  Text,
  Grid,
  Badge,
  MultiSelect,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR"];

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Media",
  "Entertainment",
  "Construction",
  "Transportation",
  "Agriculture",
  "Energy",
  "Other",
];

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Volunteer",
  "Freelance",
];

const experienceLevels = [
  "Entry-level",
  "Junior",
  "Mid-level",
  "Senior",
  "Lead",
  "Manager",
  "Director",
  "Executive",
];

const educationLevels = [
  "High School",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Professional Certification",
  "No Specific Requirement",
];

type FormValues = {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  responsibilities: string[];
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  industry: string;
  employmentType: string;
  remote: boolean;
  postingDate: Date | null;
  applicationDeadline: Date | null;
  experienceLevel: string;
  educationLevel: string;
};

// Helper function to type-check salary object
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

export function CreateOrUpdateJobForm({
  jobData,
  onSuccess,
}: {
  jobData?: JobData;
  onSuccess?: () => void;
}) {
  const isCreate = !jobData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize form with existing job data or default values
  const form = useForm<FormValues>({
    initialValues: {
      title: jobData?.title || "",
      company: jobData?.company || "",
      location: jobData?.location || "",
      description: jobData?.description || "",
      requirements: jobData?.requirements || [],
      skills: jobData?.skills || [],
      responsibilities: jobData?.responsibilities || [],
      salaryMin: isSalaryObject(jobData?.salary) ? jobData.salary.min : 0,
      salaryMax: isSalaryObject(jobData?.salary) ? jobData.salary.max : 0,
      salaryCurrency: isSalaryObject(jobData?.salary)
        ? jobData.salary.currency
        : "USD",
      industry: jobData?.industry || "",
      employmentType: jobData?.jobType || "",
      remote: jobData?.location?.toLowerCase() === "remote" || false,
      postingDate: null,
      applicationDeadline: null,
      experienceLevel: jobData?.experienceLevel || "",
      educationLevel: jobData?.educationLevel || "",
    },
    validate: {
      title: (value) => (value.trim() ? null : "Job title is required"),
      company: (value) => (value.trim() ? null : "Company name is required"),
      location: (value, values) =>
        values.remote ? null : value.trim() ? null : "Location is required",
      description: (value) => (value.trim() ? null : "Description is required"),
      salaryMin: (value, values) =>
        value > 0 ? null : "Minimum salary must be greater than 0",
      salaryMax: (value, values) =>
        value >= values.salaryMin
          ? null
          : "Maximum salary must be greater than or equal to minimum salary",
      salaryCurrency: (value) => (value ? null : "Currency is required"),
      industry: (value) => (value ? null : "Industry is required"),
      employmentType: (value) => (value ? null : "Employment type is required"),
      experienceLevel: (value) =>
        value ? null : "Experience level is required",
      educationLevel: (value) => (value ? null : "Education level is required"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Transform form values to exactly match the format needed by the API
      const jobPayload = {
        title: values.title,
        company: values.company,
        location: values.remote ? "Remote" : values.location,
        description: values.description,
        requirements: values.requirements,
        skills: values.skills,
        salary: {
          min: values.salaryMin,
          max: values.salaryMax,
          currency: values.salaryCurrency,
        },
        employmentType: values.employmentType,
        remote: values.remote,
        // Format dates to strings if they exist
        ...(values.postingDate && {
          postingDate: values.postingDate.toISOString().split("T")[0],
        }),
        ...(values.applicationDeadline && {
          applicationDeadline: values.applicationDeadline
            .toISOString()
            .split("T")[0],
        }),
      };

      const result = await createJob(jobPayload);

      if (result.success) {
        setSuccess(true);
        notifications.show({
          title: "Success",
          message: isCreate
            ? "Job created successfully"
            : "Job updated successfully",
          color: "green",
          icon: <IconCheck size={16} />,
        });

        if (isCreate) {
          // Reset form if creating a new job
          form.reset();
        }

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(result.message || "An error occurred");
        notifications.show({
          title: "Error",
          message: result.message || "Failed to save job",
          color: "red",
          icon: <IconAlertCircle size={16} />,
        });
      }
    } catch (err) {
      console.error("Error submitting job:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      notifications.show({
        title: "Error",
        message: "Failed to save job. Please try again.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      shadow="sm"
      p="xl"
      radius="md"
      withBorder
      className="max-w-4xl mx-auto"
    >
      <Title order={2} mb="md">
        {isCreate ? "Create New Job" : "Update Job"}
      </Title>

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          mb="lg"
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          icon={<IconCheck size={16} />}
          title="Success"
          color="green"
          mb="lg"
        >
          Job {isCreate ? "created" : "updated"} successfully!
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Job Title"
              placeholder="e.g. Senior Frontend Developer"
              required
              {...form.getInputProps("title")}
              className="mb-4"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Company"
              placeholder="e.g. Acme Corporation"
              required
              {...form.getInputProps("company")}
              className="mb-4"
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Switch
              label="Remote Position"
              {...form.getInputProps("remote")}
              checked={form.values.remote}
              className="mb-4"
            />
          </Grid.Col>

          {!form.values.remote && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Location"
                placeholder="e.g. New York, NY"
                required={!form.values.remote}
                {...form.getInputProps("location")}
                className="mb-4"
              />
            </Grid.Col>
          )}
        </Grid>

        <Textarea
          label="Description"
          placeholder="Job description"
          minRows={4}
          required
          {...form.getInputProps("description")}
          className="mb-4"
        />

        <Divider my="md" label="Salary Information" labelPosition="center" />

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput
              label="Minimum Salary"
              placeholder="e.g. 50000"
              required
              min={0}
              {...form.getInputProps("salaryMin")}
              className="mb-4"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput
              label="Maximum Salary"
              placeholder="e.g. 80000"
              required
              min={0}
              {...form.getInputProps("salaryMax")}
              className="mb-4"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Currency"
              placeholder="Select currency"
              data={currencies}
              required
              {...form.getInputProps("salaryCurrency")}
              className="mb-4"
            />
          </Grid.Col>
        </Grid>

        <Divider my="md" label="Job Details" labelPosition="center" />

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Industry"
              placeholder="Select industry"
              data={industries}
              required
              {...form.getInputProps("industry")}
              className="mb-4"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Employment Type"
              placeholder="Select employment type"
              data={employmentTypes}
              required
              {...form.getInputProps("employmentType")}
              className="mb-4"
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Experience Level"
              placeholder="Select experience level"
              data={experienceLevels}
              required
              {...form.getInputProps("experienceLevel")}
              className="mb-4"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Education Level"
              placeholder="Select education level"
              data={educationLevels}
              required
              {...form.getInputProps("educationLevel")}
              className="mb-4"
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateInput
              label="Posting Date"
              placeholder="Select posting date"
              valueFormat="YYYY-MM-DD"
              clearable
              {...form.getInputProps("postingDate")}
              className="mb-4"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateInput
              label="Application Deadline"
              placeholder="Select application deadline"
              valueFormat="YYYY-MM-DD"
              clearable
              minDate={form.values.postingDate || new Date()}
              {...form.getInputProps("applicationDeadline")}
              className="mb-4"
            />
          </Grid.Col>
        </Grid>

        <Divider my="md" label="Skills & Requirements" labelPosition="center" />

        <TagsInput
          label="Skills"
          placeholder="Add skills and press Enter"
          {...form.getInputProps("skills")}
          className="mb-4"
        />

        <TagsInput
          label="Requirements"
          placeholder="Add requirements and press Enter"
          {...form.getInputProps("requirements")}
          className="mb-4"
        />

        <TagsInput
          label="Responsibilities"
          placeholder="Add responsibilities and press Enter"
          {...form.getInputProps("responsibilities")}
          className="mb-4"
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="default" type="button" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isCreate ? "Create Job" : "Update Job"}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
