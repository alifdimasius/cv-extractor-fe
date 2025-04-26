"use client";

import {
  Modal,
  Button,
  Badge,
  Tabs,
  Accordion,
  Text,
  Divider,
  List,
  Group,
  Card,
} from "@mantine/core";
import { useState } from "react";
import {
  IconUser,
  IconBriefcase,
  IconSchool,
  IconTools,
  IconCertificate,
  IconCalendar,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandLinkedin,
  IconExternalLink,
} from "@tabler/icons-react";

type ResultData = {
  id: string;
  fileName: string;
  extractedData: {
    personalInfo: {
      name: string;
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      summary?: string;
    };
    education?: Array<{
      institution?: string;
      degree?: string;
      field?: string;
      startDate?: string;
      endDate?: string;
      gpa?: string;
    }>;
    experience?: Array<{
      company?: string;
      position?: string;
      startDate?: string;
      endDate?: string;
      location?: string;
      description?: string;
      achievements?: string[];
    }>;
    skills?: Array<{
      category?: string;
      skills?: string[];
    }>;
    [key: string]: any;
  };
  confidence: number;
  processedAt: string;
};

export function ResultsSection({ resultsData }: { resultsData: ResultData[] }) {
  const [selectedResult, setSelectedResult] = useState<ResultData | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    if (dateString === "Present") return "Present";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch {
      return dateString; // Return as is if not a valid date
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "green";
    if (confidence >= 0.7) return "yellow";
    return "red";
  };

  return (
    <div className="space-y-4">
      {resultsData.map((result) => (
        <Card
          key={result.id}
          shadow="sm"
          radius="md"
          className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <Text fw={600} size="lg" className="text-gray-800">
                {result.extractedData.personalInfo.name}
              </Text>
              <Text size="sm" color="dimmed">
                {result.fileName}
              </Text>
            </div>
            <Badge
              color={getConfidenceColor(result.confidence)}
              variant="light"
              size="lg"
            >
              {Math.round(result.confidence * 100)}% Confidence
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {result.extractedData.personalInfo.email && (
              <Badge
                leftSection={<IconMail size={12} />}
                color="blue"
                variant="outline"
              >
                {result.extractedData.personalInfo.email}
              </Badge>
            )}
            {result.extractedData.personalInfo.phone && (
              <Badge
                leftSection={<IconPhone size={12} />}
                color="indigo"
                variant="outline"
              >
                {result.extractedData.personalInfo.phone}
              </Badge>
            )}
            {result.extractedData.personalInfo.location && (
              <Badge
                leftSection={<IconMapPin size={12} />}
                color="cyan"
                variant="outline"
              >
                {result.extractedData.personalInfo.location}
              </Badge>
            )}
          </div>

          {result.extractedData.personalInfo.summary && (
            <Text size="sm" lineClamp={2} className="mb-4 text-gray-600">
              {result.extractedData.personalInfo.summary}
            </Text>
          )}

          <Group mt="md">
            <Text size="xs" color="dimmed">
              Processed: {new Date(result.processedAt).toLocaleString()}
            </Text>
            <Button
              variant="light"
              color="blue"
              onClick={() => setSelectedResult(result)}
              rightSection={<IconExternalLink size={16} />}
            >
              View Details
            </Button>
          </Group>
        </Card>
      ))}

      <Modal
        opened={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        title={
          <div className="flex items-center">
            <IconUser className="mr-2 text-blue-600" size={24} />
            <Text size="xl" fw={700}>
              {selectedResult?.extractedData.personalInfo.name}
            </Text>
          </div>
        }
        size="xl"
        centered
        padding="lg"
      >
        {selectedResult && (
          <div className="p-2">
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedResult.extractedData.personalInfo.email && (
                  <div className="flex items-center">
                    <IconMail size={18} className="text-blue-600 mr-2" />
                    <Text>
                      {selectedResult.extractedData.personalInfo.email}
                    </Text>
                  </div>
                )}
                {selectedResult.extractedData.personalInfo.phone && (
                  <div className="flex items-center">
                    <IconPhone size={18} className="text-blue-600 mr-2" />
                    <Text>
                      {selectedResult.extractedData.personalInfo.phone}
                    </Text>
                  </div>
                )}
                {selectedResult.extractedData.personalInfo.location && (
                  <div className="flex items-center">
                    <IconMapPin size={18} className="text-blue-600 mr-2" />
                    <Text>
                      {selectedResult.extractedData.personalInfo.location}
                    </Text>
                  </div>
                )}
                {selectedResult.extractedData.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <IconBrandLinkedin
                      size={18}
                      className="text-blue-600 mr-2"
                    />
                    <Text>
                      {selectedResult.extractedData.personalInfo.linkedin}
                    </Text>
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedResult.extractedData.personalInfo.summary && (
                <div className="mt-4">
                  <Text size="sm" color="dimmed" className="mb-1">
                    Summary
                  </Text>
                  <Text>
                    {selectedResult.extractedData.personalInfo.summary}
                  </Text>
                </div>
              )}
            </div>

            <Tabs defaultValue="experience" className="mt-4">
              <Tabs.List grow>
                <Tabs.Tab
                  value="experience"
                  leftSection={<IconBriefcase size={16} />}
                >
                  Experience
                </Tabs.Tab>
                <Tabs.Tab
                  value="education"
                  leftSection={<IconSchool size={16} />}
                >
                  Education
                </Tabs.Tab>
                <Tabs.Tab value="skills" leftSection={<IconTools size={16} />}>
                  Skills
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="experience" pt="md">
                {selectedResult.extractedData.experience &&
                selectedResult.extractedData.experience.length > 0 ? (
                  <Accordion>
                    {selectedResult.extractedData.experience.map(
                      (exp, index) => (
                        <Accordion.Item value={`exp-${index}`} key={index}>
                          <Accordion.Control>
                            <div>
                              <Text fw={600}>{exp.position}</Text>
                              <Group>
                                <Text size="sm">{exp.company}</Text>
                                <Text size="sm" color="dimmed">
                                  ·
                                </Text>
                                <Text size="sm" color="dimmed">
                                  {formatDate(exp.startDate)} -{" "}
                                  {formatDate(exp.endDate)}
                                </Text>
                              </Group>
                            </div>
                          </Accordion.Control>
                          <Accordion.Panel>
                            {exp.location && (
                              <Group mb="xs">
                                <IconMapPin
                                  size={14}
                                  className="text-gray-500"
                                />
                                <Text size="sm">{exp.location}</Text>
                              </Group>
                            )}

                            {exp.description && (
                              <Text size="sm" className="mb-2">
                                {exp.description}
                              </Text>
                            )}

                            {exp.achievements &&
                              exp.achievements.length > 0 && (
                                <div className="mt-2">
                                  <Text fw={500} size="sm" className="mb-1">
                                    Key Achievements
                                  </Text>
                                  <List size="sm" spacing="xs">
                                    {exp.achievements.map((achievement, i) => (
                                      <List.Item key={i}>
                                        {achievement}
                                      </List.Item>
                                    ))}
                                  </List>
                                </div>
                              )}
                          </Accordion.Panel>
                        </Accordion.Item>
                      )
                    )}
                  </Accordion>
                ) : (
                  <Text color="dimmed" className="py-4">
                    No experience data found
                  </Text>
                )}
              </Tabs.Panel>

              <Tabs.Panel value="education" pt="md">
                {selectedResult.extractedData.education &&
                selectedResult.extractedData.education.length > 0 ? (
                  <Accordion>
                    {selectedResult.extractedData.education.map(
                      (edu, index) => (
                        <Accordion.Item value={`edu-${index}`} key={index}>
                          <Accordion.Control>
                            <div>
                              <Text fw={600}>
                                {edu.degree}
                                {edu.field ? `, ${edu.field}` : ""}
                              </Text>
                              <Group>
                                <Text size="sm">{edu.institution}</Text>
                                <Text size="sm">·</Text>
                                <Text size="sm">
                                  {formatDate(edu.startDate)} -{" "}
                                  {formatDate(edu.endDate)}
                                </Text>
                              </Group>
                            </div>
                          </Accordion.Control>
                          <Accordion.Panel>
                            {edu.gpa && (
                              <Group>
                                <Text fw={500} size="sm">
                                  GPA:
                                </Text>
                                <Text size="sm">{edu.gpa}</Text>
                              </Group>
                            )}
                          </Accordion.Panel>
                        </Accordion.Item>
                      )
                    )}
                  </Accordion>
                ) : (
                  <Text className="py-4">No education data found</Text>
                )}
              </Tabs.Panel>

              <Tabs.Panel value="skills" pt="md">
                {selectedResult.extractedData.skills &&
                selectedResult.extractedData.skills.length > 0 ? (
                  <div className="space-y-4">
                    {selectedResult.extractedData.skills.map(
                      (skillGroup, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <Text fw={600} className="mb-2">
                            {skillGroup.category}
                          </Text>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.skills?.map((skill, i) => (
                              <Badge key={i} size="lg" variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <Text color="dimmed" className="py-4">
                    No skills data found
                  </Text>
                )}
              </Tabs.Panel>
            </Tabs>

            <Divider my="md" />

            <div className="flex justify-between items-center">
              <Badge size="lg" variant="filled" color="blue">
                {selectedResult.fileName}
              </Badge>

              <div className="flex items-center">
                <IconCalendar size={16} className="text-gray-500 mr-1" />
                <Text size="sm" color="dimmed">
                  Processed:{" "}
                  {new Date(selectedResult.processedAt).toLocaleDateString()}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
