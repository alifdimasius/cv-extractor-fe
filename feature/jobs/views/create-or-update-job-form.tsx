"use client";

import { JobData } from "../actions/get-jobs";

export function CreateOrUpdateJobForm({ jobData }: { jobData?: JobData }) {
  const isCreate = !jobData;
}
