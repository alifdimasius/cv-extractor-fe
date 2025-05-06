"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Text,
  Title,
  Group,
  Badge,
  Button,
  Loader,
  Alert,
  Card,
  Progress,
  Accordion,
  Avatar,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconRefresh,
  IconUser,
  IconMail,
  IconChartBar,
} from "@tabler/icons-react";
import { getMatchingCVs } from "../actions/get-matching-cvs-by-job-id";

interface MatchingCVsViewProps {
  jobId: string;
  jobTitle?: string;
}

export function MatchingCVsView({ jobId, jobTitle }: MatchingCVsViewProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Load matching CVs when component mounts or job changes
  useEffect(() => {
    if (jobId) {
      loadMatchingCVs();
    }
  }, [jobId]);

  // Function to load matching CVs
  const loadMatchingCVs = async (refresh = false) => {
    if (!jobId) return;

    setLoading(true);
    setError(null);
    if (refresh) setRefreshing(true);

    try {
      const result = await getMatchingCVs(jobId, { refresh });

      if (result.success && result.data) {
        setMatches(result.data.matches || []);
      } else {
        setError(result.message || "Failed to load matching CVs");
      }
    } catch (error) {
      console.error("Error loading matching CVs:", error);
      setError("Failed to load matching candidates. Please try again.");
    } finally {
      setLoading(false);
      if (refresh) setRefreshing(false);
    }
  };

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 70) return "teal";
    if (score >= 60) return "blue";
    if (score >= 50) return "yellow";
    return "red";
  };

  // Loading state
  if (loading && !refreshing && matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader size="lg" className="mb-4" />
        <Text>Loading matching candidates...</Text>
      </div>
    );
  }

  // Error state
  if (error && !loading && matches.length === 0) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
        {error}
        <Button
          variant="light"
          color="red"
          onClick={() => loadMatchingCVs(true)}
          className="mt-2"
          leftSection={<IconRefresh size={16} />}
          loading={refreshing}
        >
          Try Again
        </Button>
      </Alert>
    );
  }

  // No matches state
  if (!loading && matches.length === 0) {
    return (
      <div className="text-center py-8">
        <IconUser size={48} className="text-gray-400 mx-auto mb-4" />
        <Title order={3} className="text-gray-700 mb-2">
          No Matching Candidates
        </Title>
        <Text color="dimmed" className="mb-4">
          We couldn't find any matching candidates for this job position.
        </Text>
        <Button
          onClick={() => loadMatchingCVs(true)}
          leftSection={<IconRefresh size={16} />}
          loading={refreshing}
        >
          Refresh Matches
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Badge size="lg">
          {matches.length} {matches.length === 1 ? "Match" : "Matches"}
        </Badge>
        <Button
          variant="light"
          leftSection={<IconRefresh size={16} />}
          onClick={() => loadMatchingCVs(true)}
          loading={refreshing}
          size="sm"
        >
          Refresh
        </Button>
      </Group>

      <div className="space-y-4">
        {matches.map((match, index) => (
          <Card key={index} shadow="sm" p="md" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Group>
                <Avatar color="blue" radius="xl">
                  {match.cv.name.charAt(0)}
                </Avatar>
                <div>
                  <Text fw={600}>{match.cv.name}</Text>
                  <Group gap="xs">
                    <IconMail size={14} className="text-gray-500" />
                    <Text size="sm" color="dimmed">
                      {match.cv.email}
                    </Text>
                  </Group>
                </div>
              </Group>
              <Badge
                size="xl"
                color={getScoreColor(match.score)}
                variant="filled"
              >
                <div className="flex items-center gap-1">
                  <IconChartBar size={14} />
                  <span>{match.score}%</span>
                </div>
              </Badge>
            </Group>

            <Accordion variant="separated" mt="md">
              <Accordion.Item value="overall">
                <Accordion.Control>
                  <Group justify="space-between">
                    <Text fw={500}>Overall Match</Text>
                    <Progress
                      value={match.matchDetails.overall.score}
                      color={getScoreColor(match.matchDetails.overall.score)}
                      size="sm"
                      className="w-24"
                    />
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm">{match.matchDetails.overall.analysis}</Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="skills">
                <Accordion.Control>
                  <Group justify="space-between">
                    <Text fw={500}>Skills</Text>
                    <Progress
                      value={match.matchDetails.skills.score}
                      color={getScoreColor(match.matchDetails.skills.score)}
                      size="sm"
                      className="w-24"
                    />
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm">{match.matchDetails.skills.analysis}</Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="experience">
                <Accordion.Control>
                  <Group justify="space-between">
                    <Text fw={500}>Experience</Text>
                    <Progress
                      value={match.matchDetails.experience.score}
                      color={getScoreColor(match.matchDetails.experience.score)}
                      size="sm"
                      className="w-24"
                    />
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm">
                    {match.matchDetails.experience.analysis}
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="education">
                <Accordion.Control>
                  <Group justify="space-between">
                    <Text fw={500}>Education</Text>
                    <Progress
                      value={match.matchDetails.education.score}
                      color={getScoreColor(match.matchDetails.education.score)}
                      size="sm"
                      className="w-24"
                    />
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm">{match.matchDetails.education.analysis}</Text>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Group mt="md">
              {/* Might be used for debugging later but commented out for now */}
              {/* <Badge color="gray" variant="outline" size="sm">
                {match.fromCache ? "From Cache" : "Fresh Analysis"}
              </Badge> */}
              <Button
                variant="light"
                size="xs"
                component="a"
                href={`/records/${match.cv.id}`}
                target="_blank"
              >
                View Full CV
              </Button>
            </Group>
          </Card>
        ))}
      </div>
    </div>
  );
}
