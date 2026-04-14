import { useMemo } from "react";

import { useOAuthTokensQuery } from "@/entities/oauth-token";
import { useWorkflowListQuery } from "@/entities/workflow";

import {
  DASHBOARD_METRICS,
  getConnectedServiceCards,
  getDashboardIssues,
  getRecommendedServiceCards,
  sortWorkflowsByUpdatedAtDesc,
} from "./dashboard";

const DASHBOARD_WORKFLOW_PAGE_SIZE = 20;

export const useDashboardData = () => {
  const workflowQuery = useWorkflowListQuery(0, DASHBOARD_WORKFLOW_PAGE_SIZE);
  const oauthTokenQuery = useOAuthTokensQuery();

  const workflows = useMemo(
    () => sortWorkflowsByUpdatedAtDesc(workflowQuery.data?.content ?? []),
    [workflowQuery.data],
  );

  const issues = useMemo(() => getDashboardIssues(workflows), [workflows]);

  const connectedServices = useMemo(
    () => getConnectedServiceCards(oauthTokenQuery.data ?? []),
    [oauthTokenQuery.data],
  );

  const recommendedServices = useMemo(
    () => getRecommendedServiceCards(oauthTokenQuery.data ?? []),
    [oauthTokenQuery.data],
  );

  const handleReloadWorkflows = () => {
    void workflowQuery.refetch();
  };

  const handleReloadServices = () => {
    void oauthTokenQuery.refetch();
  };

  return {
    metrics: DASHBOARD_METRICS,
    issues,
    connectedServices,
    recommendedServices,
    isWorkflowsLoading: workflowQuery.isLoading,
    isWorkflowsError: workflowQuery.isError,
    isServicesLoading: oauthTokenQuery.isLoading,
    isServicesError: oauthTokenQuery.isError,
    handleReloadWorkflows,
    handleReloadServices,
  };
};
