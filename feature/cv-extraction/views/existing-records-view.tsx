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
  Select,
  Pagination,
  Skeleton,
} from "@mantine/core";
import {
  IconSearch,
  IconAlertCircle,
  IconFileDatabase,
  IconRefresh,
  IconFileDescription,
} from "@tabler/icons-react";
import { getCVIds, getCVDetails } from "../actions/get-cv-records";
import { ResultsSection } from "./results-section";

type CVRecord = {
  id: string;
  name: string;
};

export function ExistingRecordsView() {
  const [loading, setLoading] = useState(true);
  const [cvRecords, setCvRecords] = useState<CVRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<CVRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCV, setSelectedCV] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordCount, setRecordCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Number of records to show per page
  const itemsPerPage = 10;

  // Load CV records when component mounts
  useEffect(() => {
    loadCVRecords();
  }, []);

  // Filter records when search query changes
  useEffect(() => {
    if (searchQuery) {
      setFilteredRecords(
        cvRecords.filter((record) =>
          record.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredRecords(cvRecords);
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, cvRecords]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Load all available CV records
  const loadCVRecords = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCVIds();

      if (result.success) {
        // Fetch details for each CV to get the name
        const records = await Promise.all(
          result.ids.map(async (id) => {
            const details = await getCVDetails(id);
            return {
              id,
              name:
                (details.success &&
                  details.data?.extractedData?.personalInfo?.name) ||
                id,
            };
          })
        );

        setCvRecords(records);
        setFilteredRecords(records);
        setRecordCount(result.count || result.ids.length);
      } else {
        setError(result.message);
        setCvRecords([]);
        setFilteredRecords([]);
      }
    } catch (error) {
      console.error("Failed to load CV records:", error);
      setError("Failed to load existing records. Please try again.");
      setCvRecords([]);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Load details for a specific CV ID
  const loadCVDetails = async (id: string) => {
    setLoadingDetails(true);
    setSelectedId(id);
    setError(null);
    setSelectedCV(null);

    try {
      const result = await getCVDetails(id);

      if (result.success && result.data) {
        setSelectedCV([result.data]); // Wrap in array for ResultsSection compatibility
      } else {
        setError(result.message || "Failed to load CV details");
      }
    } catch (error) {
      console.error(`Failed to load CV details for ID ${id}:`, error);
      setError("Failed to load CV details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <Container size="xl" className="py-8">
      <div className="mb-6">
        <Title order={2} className="text-gray-800 mb-2">
          Existing CV Records
        </Title>
        <Text className="text-gray-600">
          Browse and search through previously extracted CV information.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel - Record Selection */}
        <div className="md:col-span-1">
          <Paper shadow="xs" p="md" radius="md" withBorder>
            <div className="mb-4">
              <Group mb="xs">
                <Text fw={600} size="lg" className="text-gray-700">
                  <IconFileDatabase size={20} className="inline mr-2" />
                  Available Records
                </Text>
                <Badge size="lg">{recordCount}</Badge>
              </Group>

              <TextInput
                placeholder="Search by name"
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                mb="sm"
              />

              <Button
                variant="light"
                color="blue"
                onClick={loadCVRecords}
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
                    <Skeleton key={i} height={42} radius="sm" />
                  ))}
              </div>
            ) : error && cvRecords.length === 0 ? (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                title="Error"
              >
                {error}
              </Alert>
            ) : paginatedRecords.length > 0 ? (
              <div>
                <div className="space-y-2 mb-4">
                  {paginatedRecords.map((record) => (
                    <Button
                      key={record.id}
                      variant={selectedId === record.id ? "filled" : "outline"}
                      color={selectedId === record.id ? "blue" : "gray"}
                      onClick={() => loadCVDetails(record.id)}
                      fullWidth
                      leftSection={<IconFileDescription size={16} />}
                      className="text-left justify-start truncate"
                    >
                      <span className="truncate">{record.name}</span>
                    </Button>
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
                No records found{searchQuery ? " matching your search" : ""}
              </Text>
            )}
          </Paper>
        </div>

        {/* Right Panel - CV Details */}
        <div className="md:col-span-2">
          {loadingDetails ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
              <Loader size="lg" className="mb-4" />
              <Text size="lg" fw={500} color="dimmed">
                Loading CV Details...
              </Text>
            </div>
          ) : selectedCV ? (
            <div>
              <ResultsSection resultsData={selectedCV} />
            </div>
          ) : error && selectedId ? (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              title="Error Loading CV Details"
            >
              {error}
            </Alert>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
              <IconFileDatabase size={48} className="text-gray-400 mb-4" />
              <Text size="lg" fw={500} color="dimmed">
                Select a CV to view details
              </Text>
              <Text
                size="sm"
                color="dimmed"
                className="max-w-md text-center mt-2"
              >
                Choose a record from the list on the left to display the
                extracted CV information here
              </Text>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
