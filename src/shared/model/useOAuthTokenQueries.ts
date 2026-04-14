import { useMutation, useQuery } from "@tanstack/react-query";

import { oauthApi } from "../api";
import { QUERY_KEYS } from "../constants";
import { queryClient } from "../libs";

export const useOAuthTokensQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.oauthTokens,
    queryFn: () => oauthApi.getTokens(),
    throwOnError: false,
  });

export const useConnectOAuthTokenMutation = () =>
  useMutation({
    mutationFn: (service: string) => oauthApi.connect(service),
  });

export const useDisconnectOAuthTokenMutation = () =>
  useMutation({
    mutationFn: (service: string) => oauthApi.disconnect(service),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.oauthTokens,
      });
    },
  });
