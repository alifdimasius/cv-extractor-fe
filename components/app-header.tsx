"use client";

import { Group, Button, Text, Container } from "@mantine/core";
import { IconUpload, IconDatabase, IconBriefcase, IconBrandLine } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200">
      <Container size="xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Text
              component={Link}
              href="/"
              size="xl"
              fw={700}
              className="text-blue-600 no-underline flex items-center"
            >
              CV Extractor
            </Text>
          </div>

          <Group>
            <Button
              component={Link}
              href="/"
              variant={pathname === "/" ? "filled" : "light"}
              color="blue"
              leftSection={<IconUpload size={16} />}
            >
              Upload
            </Button>

            <Button
              component={Link}
              href="/records"
              variant={pathname === "/records" ? "filled" : "light"}
              color="blue"
              leftSection={<IconDatabase size={16} />}
            >
              Records
            </Button>
            <Button
              component={Link}
              href="/jobs"
              variant={pathname === "/jobs" ? "filled" : "light"}
              color="blue"
              leftSection={<IconBriefcase size={16} />}
            >
              Jobs
            </Button>
            <Button
              component={Link}
              href="/chat"
              variant={pathname === "/chat" ? "filled" : "light"}
              color="blue"
              leftSection={<IconBrandLine size={16} />}
            >
              Chat
            </Button>
          </Group>
        </div>
      </Container>
    </header>
  );
}
