import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";

import {
  ROUTE_PATHS,
  clearAuthSession,
  storeAuthUser,
  storeTokens,
} from "@/shared";
import { authApi } from "@/shared/api";

type CallbackState = "pending" | "error";

const callbackErrorMessages = {
  missingExchangeCode: "로그인 정보 확인이 필요합니다.",
  oauthFailed: "로그인 인증에 실패했습니다.",
  expiredExchangeCode: "로그인 정보가 만료되었습니다. 다시 시도해 주세요.",
  exchangeFailed: "로그인 처리 중 오류가 발생했습니다.",
} as const;

const getCallbackErrorMessage = (
  errorCode: string | null,
  message: string | null,
) => {
  if (message) {
    return message;
  }

  switch (errorCode) {
    case "exchange_code_expired":
    case "exchange_code_invalid":
      return callbackErrorMessages.expiredExchangeCode;
    case "oauth_failed":
      return callbackErrorMessages.oauthFailed;
    default:
      return callbackErrorMessages.exchangeFailed;
  }
};

export default function AuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [callbackState, setCallbackState] = useState<CallbackState>("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const exchangeCode = searchParams.get("exchange_code");
    const errorCode = searchParams.get("error");
    const message = searchParams.get("message");

    let isMounted = true;

    const finalizeLogin = async () => {
      if (errorCode) {
        clearAuthSession();

        if (isMounted) {
          setCallbackState("error");
          setErrorMessage(getCallbackErrorMessage(errorCode, message));
        }
        return;
      }

      if (!exchangeCode) {
        clearAuthSession();

        if (isMounted) {
          setCallbackState("error");
          setErrorMessage(callbackErrorMessages.missingExchangeCode);
        }
        return;
      }

      try {
        const result = await authApi.exchange(exchangeCode);
        if (!isMounted) {
          return;
        }

        const { accessToken, refreshToken, user } = result;
        storeTokens(accessToken, refreshToken);
        storeAuthUser(user);
        navigate(ROUTE_PATHS.WORKFLOWS, { replace: true });
      } catch {
        if (!isMounted) {
          return;
        }

        clearAuthSession();
        setCallbackState("error");
        setErrorMessage(getCallbackErrorMessage(errorCode, message));
      }
    };

    void finalizeLogin();

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={6}
    >
      {callbackState === "pending" ? (
        <VStack
          gap={4}
          bg="white"
          borderRadius="24px"
          boxShadow="0 20px 60px rgba(15, 23, 42, 0.08)"
          px={8}
          py={10}
        >
          <Spinner size="lg" />
          <Text fontSize="lg" fontWeight="semibold">
            로그인 처리 중입니다.
          </Text>
          <Text color="gray.600">잠시만 기다려 주세요.</Text>
        </VStack>
      ) : (
        <VStack
          gap={4}
          bg="white"
          borderRadius="24px"
          boxShadow="0 20px 60px rgba(15, 23, 42, 0.08)"
          px={8}
          py={10}
          maxW="420px"
          textAlign="center"
        >
          <Text fontSize="lg" fontWeight="semibold">
            로그인 실패
          </Text>
          <Text color="gray.600">
            {errorMessage ?? callbackErrorMessages.exchangeFailed}
          </Text>
          <Button
            bg="gray.900"
            color="white"
            onClick={() => navigate(ROUTE_PATHS.LOGIN, { replace: true })}
            _hover={{ bg: "gray.800" }}
          >
            로그인 화면 이동
          </Button>
        </VStack>
      )}
    </Box>
  );
}
