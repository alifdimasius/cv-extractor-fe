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
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandLinkedin,
  IconExternalLink,
  IconFileDescription,
  IconWorld,
  IconCertificate,
  IconLanguage,
  IconDeviceLaptop,
  IconTrophy,
  IconBook,
  IconUserCheck,
} from "@tabler/icons-react";

// Updated type definition based on response from API
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
      website?: string;
      summary?: string;
    };
    education?: Array<{
      institution?: string;
      degree?: string;
      field?: string;
      startDate?: string;
      endDate?: string;
      gpa?: string;
      description?: string;
      _id?: string;
    }>;
    experience?: Array<{
      company?: string;
      position?: string;
      startDate?: string;
      endDate?: string;
      location?: string;
      description?: string;
      achievements?: string[];
      _id?: string;
    }>;
    skills?: Array<{
      category?: string;
      skills?: string[];
      _id?: string;
    }>;
    certifications?: Array<{
      name?: string;
      issuer?: string;
      date?: string;
      expires?: boolean;
      expirationDate?: string;
      _id?: string;
    }>;
    languages?: Array<{
      language?: string;
      proficiency?: string;
      _id?: string;
    }>;
    projects?: Array<{
      name?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      technologies?: string[];
      url?: string;
      _id?: string;
    }>;
    publications?: Array<{
      title?: string;
      publisher?: string;
      date?: string;
      authors?: string[];
      url?: string;
      _id?: string;
    }>;
    awards?: Array<{
      title?: string;
      issuer?: string;
      date?: string;
      description?: string;
      _id?: string;
    }>;
    references?: Array<{
      name?: string;
      position?: string;
      company?: string;
      contact?: string;
      relationship?: string;
      _id?: string;
    }>;
  };
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

  // Function to check if a section has data
  const hasData = (section?: any[]) => {
    return section && section.length > 0;
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
              color="blue"
              variant="light"
              size="lg"
              leftSection={<IconFileDescription size={14} />}
            >
              PDF
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
                {selectedResult.extractedData.personalInfo.website && (
                  <div className="flex items-center">
                    <IconWorld size={18} className="text-blue-600 mr-2" />
                    <Text>
                      {selectedResult.extractedData.personalInfo.website}
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
                {hasData(selectedResult.extractedData.experience) && (
                  <Tabs.Tab
                    value="experience"
                    leftSection={<IconBriefcase size={16} />}
                  >
                    Experience
                  </Tabs.Tab>
                )}
                {hasData(selectedResult.extractedData.education) && (
                  <Tabs.Tab
                    value="education"
                    leftSection={<IconSchool size={16} />}
                  >
                    Education
                  </Tabs.Tab>
                )}
                {hasData(selectedResult.extractedData.skills) && (
                  <Tabs.Tab
                    value="skills"
                    leftSection={<IconTools size={16} />}
                  >
                    Skills
                  </Tabs.Tab>
                )}
                {hasData(selectedResult.extractedData.certifications) && (
                  <Tabs.Tab
                    value="certifications"
                    leftSection={<IconCertificate size={16} />}
                  >
                    Certifications
                  </Tabs.Tab>
                )}
                {hasData(selectedResult.extractedData.languages) && (
                  <Tabs.Tab
                    value="languages"
                    leftSection={<IconLanguage size={16} />}
                  >
                    Languages
                  </Tabs.Tab>
                )}
                {hasData(selectedResult.extractedData.projects) && (
                  <Tabs.Tab
                    value="projects"
                    leftSection={<IconDeviceLaptop size={16} />}
                  >
                    Projects
                  </Tabs.Tab>
                )}
                {hasData(selectedResult.extractedData.publications) && (
                  <Tabs.Tab
                    value="publications"
                    leftSection={<IconBook size={16} />}
                  >
                    Publications
                  </Tabs.Tab>
                )}
                {hasData(selectedResult.extractedData.awards) && (
                  <Tabs.Tab
                    value="awards"
                    leftSection={<IconTrophy size={16} />}
                  >
                    Awards
                  </Tabs.Tab>
                )}
                {hasData(selectedResult.extractedData.references) && (
                  <Tabs.Tab
                    value="references"
                    leftSection={<IconUserCheck size={16} />}
                  >
                    References
                  </Tabs.Tab>
                )}
              </Tabs.List>

              {/* Experience Tab */}
              {hasData(selectedResult.extractedData.experience) && (
                <Tabs.Panel value="experience" pt="md">
                  <Accordion>
                    {selectedResult.extractedData.experience?.map(
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
                </Tabs.Panel>
              )}

              {/* Education Tab */}
              {hasData(selectedResult.extractedData.education) && (
                <Tabs.Panel value="education" pt="md">
                  <Accordion>
                    {selectedResult.extractedData.education?.map(
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
                            {edu.description && (
                              <Text size="sm" className="mt-2">
                                {edu.description}
                              </Text>
                            )}
                          </Accordion.Panel>
                        </Accordion.Item>
                      )
                    )}
                  </Accordion>
                </Tabs.Panel>
              )}

              {/* Skills Tab */}
              {hasData(selectedResult.extractedData.skills) && (
                <Tabs.Panel value="skills" pt="md">
                  <div className="space-y-4">
                    {selectedResult.extractedData.skills?.map(
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
                </Tabs.Panel>
              )}

              {/* Certifications Tab */}
              {hasData(selectedResult.extractedData.certifications) && (
                <Tabs.Panel value="certifications" pt="md">
                  <List spacing="md">
                    {selectedResult.extractedData.certifications?.map(
                      (cert, index) => (
                        <List.Item
                          key={index}
                          icon={
                            <IconCertificate
                              size={18}
                              className="text-blue-600"
                            />
                          }
                        >
                          <Text fw={500}>{cert.name}</Text>
                          {cert.issuer && (
                            <Text size="sm" color="dimmed">
                              Issued by {cert.issuer}
                            </Text>
                          )}
                          {cert.date && (
                            <Text size="sm" color="dimmed">
                              Date: {formatDate(cert.date)}
                            </Text>
                          )}
                          {cert.expires && cert.expirationDate && (
                            <Text size="sm" color="dimmed">
                              Expires: {formatDate(cert.expirationDate)}
                            </Text>
                          )}
                        </List.Item>
                      )
                    )}
                  </List>
                </Tabs.Panel>
              )}

              {/* Languages Tab */}
              {hasData(selectedResult.extractedData.languages) && (
                <Tabs.Panel value="languages" pt="md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedResult.extractedData.languages?.map(
                      (lang, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded flex items-center"
                        >
                          <IconLanguage
                            size={20}
                            className="text-blue-600 mr-2"
                          />
                          <div>
                            <Text fw={500}>{lang.language}</Text>
                            {lang.proficiency && (
                              <Text size="xs" color="dimmed">
                                {lang.proficiency}
                              </Text>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </Tabs.Panel>
              )}

              {/* Projects Tab */}
              {hasData(selectedResult.extractedData.projects) && (
                <Tabs.Panel value="projects" pt="md">
                  <Accordion>
                    {selectedResult.extractedData.projects?.map(
                      (project, index) => (
                        <Accordion.Item value={`project-${index}`} key={index}>
                          <Accordion.Control>
                            <div>
                              <Text fw={600}>{project.name}</Text>
                              {project.startDate && (
                                <Text size="sm" color="dimmed">
                                  {formatDate(project.startDate)}
                                  {project.endDate &&
                                    ` - ${formatDate(project.endDate)}`}
                                </Text>
                              )}
                            </div>
                          </Accordion.Control>
                          <Accordion.Panel>
                            {project.description && (
                              <Text size="sm" className="mb-3">
                                {project.description}
                              </Text>
                            )}
                            {project.technologies &&
                              project.technologies.length > 0 && (
                                <div className="mb-2">
                                  <Text size="sm" fw={500}>
                                    Technologies:
                                  </Text>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {project.technologies.map((tech, i) => (
                                      <Badge
                                        key={i}
                                        size="sm"
                                        variant="outline"
                                        color="blue"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            {project.url && (
                              <div className="flex items-center mt-2">
                                <IconWorld
                                  size={14}
                                  className="text-blue-600 mr-1"
                                />
                                <Text size="sm" className="text-blue-600">
                                  {project.url}
                                </Text>
                              </div>
                            )}
                          </Accordion.Panel>
                        </Accordion.Item>
                      )
                    )}
                  </Accordion>
                </Tabs.Panel>
              )}

              {/* Publications Tab */}
              {hasData(selectedResult.extractedData.publications) && (
                <Tabs.Panel value="publications" pt="md">
                  <Accordion>
                    {selectedResult.extractedData.publications?.map(
                      (pub, index) => (
                        <Accordion.Item value={`pub-${index}`} key={index}>
                          <Accordion.Control>
                            <div>
                              <Text fw={600}>{pub.title}</Text>
                              {pub.publisher && (
                                <Text size="sm" color="dimmed">
                                  {pub.publisher}{" "}
                                  {pub.date && `(${formatDate(pub.date)})`}
                                </Text>
                              )}
                            </div>
                          </Accordion.Control>
                          <Accordion.Panel>
                            {pub.authors && pub.authors.length > 0 && (
                              <Text size="sm" className="mb-2">
                                <span className="font-medium">Authors:</span>{" "}
                                {pub.authors.join(", ")}
                              </Text>
                            )}
                            {pub.url && (
                              <div className="flex items-center mt-2">
                                <IconWorld
                                  size={14}
                                  className="text-blue-600 mr-1"
                                />
                                <Text size="sm" className="text-blue-600">
                                  {pub.url}
                                </Text>
                              </div>
                            )}
                          </Accordion.Panel>
                        </Accordion.Item>
                      )
                    )}
                  </Accordion>
                </Tabs.Panel>
              )}

              {/* Awards Tab */}
              {hasData(selectedResult.extractedData.awards) && (
                <Tabs.Panel value="awards" pt="md">
                  <List spacing="md">
                    {selectedResult.extractedData.awards?.map(
                      (award, index) => (
                        <List.Item
                          key={index}
                          icon={
                            <IconTrophy size={18} className="text-yellow-600" />
                          }
                        >
                          <Text fw={500}>{award.title}</Text>
                          <div className="ml-2">
                            {award.issuer && (
                              <Text size="sm" color="dimmed">
                                Issued by {award.issuer}
                              </Text>
                            )}
                            {award.date && (
                              <Text size="sm" color="dimmed">
                                Date: {formatDate(award.date)}
                              </Text>
                            )}
                            {award.description && (
                              <Text size="sm" mt="xs">
                                {award.description}
                              </Text>
                            )}
                          </div>
                        </List.Item>
                      )
                    )}
                  </List>
                </Tabs.Panel>
              )}

              {/* References Tab */}
              {hasData(selectedResult.extractedData.references) && (
                <Tabs.Panel value="references" pt="md">
                  <div className="grid grid-cols-1 gap-4">
                    {selectedResult.extractedData.references?.map(
                      (ref, index) => (
                        <Card key={index} withBorder>
                          <Text fw={600}>{ref.name}</Text>
                          {ref.position && (
                            <Text size="sm">
                              {ref.position}{" "}
                              {ref.company && `at ${ref.company}`}
                            </Text>
                          )}
                          {ref.contact && (
                            <Text size="sm" className="mt-1">
                              Contact: {ref.contact}
                            </Text>
                          )}
                          {ref.relationship && (
                            <Text size="sm" color="dimmed" className="mt-1">
                              {ref.relationship}
                            </Text>
                          )}
                        </Card>
                      )
                    )}
                  </div>
                </Tabs.Panel>
              )}
            </Tabs>

            <Divider my="md" />

            <div className="flex justify-between items-center">
              <Badge size="lg" variant="filled" color="blue">
                {selectedResult.fileName}
              </Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
