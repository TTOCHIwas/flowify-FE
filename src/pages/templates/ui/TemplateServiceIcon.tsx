import { MdLanguage, MdWidgets } from "react-icons/md";

import { Box, Flex, Icon, Image, Text } from "@chakra-ui/react";

type Props = {
  icon?: string | null;
  requiredServices: string[];
};

type TemplateServiceIconKey =
  | "calendar"
  | "gmail"
  | "google-drive"
  | "google-sheets"
  | "notion"
  | "slack"
  | "web"
  | "unknown";

const isAssetUrl = (value: string) =>
  /^(https?:)?\/\//.test(value) ||
  value.startsWith("/") ||
  value.startsWith("data:");

const normalizeServiceKey = (value: string | null | undefined) => {
  switch (value) {
    case "calendar":
    case "google-calendar":
      return "calendar";
    case "gmail":
      return "gmail";
    case "google-drive":
      return "google-drive";
    case "google-sheets":
      return "google-sheets";
    case "notion":
      return "notion";
    case "slack":
      return "slack";
    case "web":
    case "web-scraping":
      return "web";
    default:
      return "unknown";
  }
};

const getIconKey = (
  icon: string | null | undefined,
  requiredServices: string[],
): TemplateServiceIconKey => {
  if (icon && !isAssetUrl(icon)) {
    return normalizeServiceKey(icon);
  }

  return normalizeServiceKey(requiredServices[0]);
};

export const TemplateServiceIcon = ({ icon, requiredServices }: Props) => {
  if (icon && isAssetUrl(icon)) {
    return (
      <Flex boxSize="38px" align="center" justify="center" flexShrink={0}>
        <Image
          src={icon}
          alt=""
          boxSize="30px"
          objectFit="contain"
          borderRadius="lg"
        />
      </Flex>
    );
  }

  const iconKey = getIconKey(icon, requiredServices);

  const content = (() => {
    switch (iconKey) {
      case "calendar":
        return (
          <Box
            boxSize="30px"
            bg="bg.surface"
            borderRadius="lg"
            border="1px solid"
            borderColor="blue.100"
            overflow="hidden"
            boxShadow="0 6px 12px rgba(66, 133, 244, 0.10)"
          >
            <Box h="8px" bg="blue.500" />
            <Flex h="22px" align="center" justify="center">
              <Text fontSize="2xs" fontWeight="bold" color="blue.500">
                31
              </Text>
            </Flex>
          </Box>
        );
      case "notion":
        return (
          <Flex
            boxSize="30px"
            align="center"
            justify="center"
            bg="bg.surface"
            borderRadius="lg"
            border="2px solid"
            borderColor="neutral.950"
            boxShadow="0 6px 12px rgba(15, 23, 42, 0.08)"
          >
            <Text fontSize="sm" fontWeight="bold" color="neutral.950">
              N
            </Text>
          </Flex>
        );
      case "google-drive":
        return (
          <svg aria-hidden="true" height="30" viewBox="0 0 30 30" width="30">
            <polygon
              fill="#0F9D58"
              points="10,4 15.4,13.2 10.6,21.6 5.2,12.4"
            />
            <polygon
              fill="#FFC107"
              points="10.6,21.6 15.4,13.2 25,13.2 20.2,21.6"
            />
            <polygon fill="#4285F4" points="15.4,13.2 10,4 19.6,4 25,13.2" />
          </svg>
        );
      case "gmail":
        return (
          <svg aria-hidden="true" height="30" viewBox="0 0 30 30" width="30">
            <rect fill="white" height="20" rx="5" width="24" x="3" y="5" />
            <path
              d="M6 22V10.5L15 17L24 10.5V22"
              fill="none"
              stroke="#EA4335"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <path
              d="M6 10.5L9.8 13.4V22"
              fill="none"
              stroke="#4285F4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <path
              d="M24 10.5L20.2 13.4V22"
              fill="none"
              stroke="#34A853"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <path
              d="M15 17L24 10.5"
              fill="none"
              stroke="#FBBC04"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          </svg>
        );
      case "google-sheets":
        return (
          <svg aria-hidden="true" height="30" viewBox="0 0 30 30" width="30">
            <path
              d="M8 4.5h10l4 4v17H8z"
              fill="#34A853"
              stroke="#2B8E46"
              strokeWidth="1"
            />
            <path d="M18 4.5v4h4" fill="#7BD88F" />
            <path
              d="M11 13h8M11 17h8M15 9v12"
              stroke="white"
              strokeWidth="1.8"
            />
          </svg>
        );
      case "slack":
        return (
          <svg aria-hidden="true" height="30" viewBox="0 0 30 30" width="30">
            <rect fill="#36C5F0" height="10" rx="5" width="6" x="6" y="3" />
            <rect fill="#2EB67D" height="6" rx="3" width="10" x="9" y="6" />
            <rect fill="#E01E5A" height="10" rx="5" width="6" x="18" y="9" />
            <rect fill="#ECB22E" height="6" rx="3" width="10" x="11" y="18" />
            <rect fill="#2EB67D" height="10" rx="5" width="6" x="9" y="18" />
            <rect fill="#E01E5A" height="6" rx="3" width="10" x="6" y="11" />
          </svg>
        );
      case "web":
        return (
          <Flex
            boxSize="30px"
            align="center"
            justify="center"
            bg="bg.surface"
            borderRadius="lg"
            border="1px solid"
            borderColor="border.default"
          >
            <Icon as={MdLanguage} boxSize={4.5} color="text.primary" />
          </Flex>
        );
      case "unknown":
      default:
        return (
          <Flex
            boxSize="30px"
            align="center"
            justify="center"
            bg="bg.overlay"
            borderRadius="lg"
            border="1px solid"
            borderColor="border.default"
          >
            <Icon as={MdWidgets} boxSize={4.5} color="text.primary" />
          </Flex>
        );
    }
  })();

  return (
    <Flex boxSize="38px" align="center" justify="center" flexShrink={0}>
      {content}
    </Flex>
  );
};
