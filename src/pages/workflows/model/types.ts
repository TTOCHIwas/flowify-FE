import { type ServiceBadgeKey } from "@/shared";

import { type WORKFLOW_FILTERS } from "./constants";

export type WorkflowFilterKey = (typeof WORKFLOW_FILTERS)[number]["key"];
export type { ServiceBadgeKey };
