import { useTemplateListQuery } from "@/entities";
import { useMemo } from "react";

export const useTemplateListData = () => {
  const { data, isLoading, isError, refetch } = useTemplateListQuery();

  const templates = useMemo(() => data ?? [], [data]);
  const hasTemplates = templates.length > 0;

  const handleReload = () => {
    void refetch();
  };

  return {
    templates,
    hasTemplates,
    isLoading,
    isError,
    handleReload,
  };
};
