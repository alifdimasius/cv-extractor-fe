"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  Paper,
  Title,
  Text,
  Badge,
  Button,
  Group,
  Skeleton,
  Alert,
  Progress,
  Divider,
  Stack,
} from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import {
  getMatchingJobsByCV,
  JobMatch,
} from "../actions/get-matching-jobs-by-cv-id";

type MatchingJobsViewProps = {
  cvId: string;
};

export default function MatchingJobsView({ cvId }: MatchingJobsViewProps) {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = async (refresh = false) => {
    try {
      setRefreshing(refresh);
      if (!refresh) setLoading(true);

      const response = await getMatchingJobsByCV(cvId, 10, refresh);

      if (response?.success && response.data) {
        setMatches(response.data.matches);
        setError(null);
      } else {
        setError(response?.message || "Failed to fetch matching jobs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (cvId) {
      fetchMatches();
    }
  }, [cvId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 60) return "yellow";
    return "red";
  };

  if (loading && !refreshing) {
    return (
      <Paper p="md" radius="md" className="border border-gray-200">
        <Title order={3} mb="md">
          Matching Jobs
        </Title>
        {Array.from({ length: 3 }).map((_, index) => (
          <Paper key={index} p="md" mb="md" className="border border-gray-100">
            <Skeleton height={30} width="70%" mb="sm" />
            <Skeleton height={20} width="40%" mb="sm" />
            <Skeleton height={15} width="90%" mb="xs" />
            <Skeleton height={15} width="80%" mb="md" />
            <Group justify="space-between">
              <Skeleton height={24} width={60} radius="xl" />
              <Skeleton height={36} width={100} />
            </Group>
          </Paper>
        ))}
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
        mb="md"
      >
        {error}
        <Button
          size="xs"
          variant="light"
          mt="xs"
          onClick={() => fetchMatches()}
        >
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <Paper p="md" radius="md" className="border border-gray-200">
      <Group justify="space-between" mb="md">
        <Title order={3}>Matching Jobs</Title>
        <Button
          variant="light"
          leftSection={<IconRefresh size={16} />}
          onClick={() => fetchMatches(true)}
          loading={refreshing}
          size="sm"
        >
          Refresh Matches
        </Button>
      </Group>

      {matches.length === 0 ? (
        <Text c="dimmed">No matching jobs found for this CV.</Text>
      ) : (
        <Stack gap="md">
          {matches.map((match, index) => (
            <Paper
              key={index}
              p="md"
              radius="sm"
              className="border border-gray-100"
            >
              <Group justify="space-between" wrap="nowrap" mb="xs">
                <div>
                  <Title order={4} mb={0}>
                    {match.job.title}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {match.job.company}
                  </Text>
                </div>
                <Badge
                  size="lg"
                  color={getScoreColor(match.score)}
                  variant="light"
                >
                  {match.score}% Match
                </Badge>
              </Group>

              <Divider my="sm" />

              <Text mb="xs" fw={500}>
                Match Breakdown:
              </Text>

              <Group grow mb="md">
                <div>
                  <Group justify="space-between" mb={3}>
                    <Text size="sm">Skills</Text>
                    <Text size="sm" fw={500}>
                      {match.matchDetails.skills.score}%
                    </Text>
                  </Group>
                  <Progress
                    value={match.matchDetails.skills.score}
                    color={getScoreColor(match.matchDetails.skills.score)}
                    size="sm"
                  />
                </div>

                <div>
                  <Group justify="space-between" mb={3}>
                    <Text size="sm">Experience</Text>
                    <Text size="sm" fw={500}>
                      {match.matchDetails.experience.score}%
                    </Text>
                  </Group>
                  <Progress
                    value={match.matchDetails.experience.score}
                    color={getScoreColor(match.matchDetails.experience.score)}
                    size="sm"
                  />
                </div>

                <div>
                  <Group justify="space-between" mb={3}>
                    <Text size="sm">Education</Text>
                    <Text size="sm" fw={500}>
                      {match.matchDetails.education.score}%
                    </Text>
                  </Group>
                  <Progress
                    value={match.matchDetails.education.score}
                    color={getScoreColor(match.matchDetails.education.score)}
                    size="sm"
                  />
                </div>
              </Group>

              <Accordion variant="separated">
                <Accordion.Item value="details">
                  <Accordion.Control>View Details</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <div>
                        <Text size="sm" fw={500}>
                          Skills Analysis:
                        </Text>
                        <Text size="sm">
                          {match.matchDetails.skills.analysis}
                        </Text>
                      </div>

                      <div>
                        <Text size="sm" fw={500}>
                          Experience Analysis:
                        </Text>
                        <Text size="sm">
                          {match.matchDetails.experience.analysis}
                        </Text>
                      </div>

                      <div>
                        <Text size="sm" fw={500}>
                          Education Analysis:
                        </Text>
                        <Text size="sm">
                          {match.matchDetails.education.analysis}
                        </Text>
                      </div>

                      <div>
                        <Text size="sm" fw={500}>
                          Overall Analysis:
                        </Text>
                        <Text size="sm">
                          {match.matchDetails.overall.analysis}
                        </Text>
                      </div>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              {match.fromCache && (
                <Text size="xs" c="dimmed" mt="xs" ta="right">
                  Results from cache
                </Text>
              )}
            </Paper>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
