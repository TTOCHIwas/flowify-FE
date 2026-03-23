export const colorSemanticToken = {
  // --- 브랜드 ---
  primary: {
    default: { value: "{colors.brand.500}" },
    hover: { value: "{colors.brand.600}" },
    subtle: { value: "{colors.brand.50}" },
  },

  // --- 노드 타입별 시맨틱 토큰 ---
  // nodeColor.xxx 형태로 NodeRegistry의 color 필드에서 참조
  nodeColor: {
    communication: { value: "{colors.blue.500}" },
    storage: { value: "{colors.green.500}" },
    spreadsheet: { value: "{colors.teal.500}" },
    webScraping: { value: "{colors.orange.500}" },
    calendar: { value: "{colors.red.500}" },
    trigger: { value: "{colors.slate.500}" },
    filter: { value: "{colors.yellow.500}" },
    loop: { value: "{colors.amber.500}" },
    condition: { value: "{colors.indigo.500}" },
    multiOutput: { value: "{colors.violet.500}" },
    dataProcess: { value: "{colors.cyan.500}" },
    outputFormat: { value: "{colors.pink.500}" },
    earlyExit: { value: "{colors.rose.500}" },
    notification: { value: "{colors.sky.500}" },
    llm: { value: "{colors.purple.500}" },
  },

  // --- 배경 (노드 헤더 hover, 선택 상태 등) ---
  nodeBg: {
    communication: { value: "{colors.blue.50}" },
    storage: { value: "{colors.green.50}" },
    spreadsheet: { value: "{colors.teal.50}" },
    webScraping: { value: "{colors.orange.50}" },
    calendar: { value: "{colors.red.50}" },
    trigger: { value: "{colors.slate.50}" },
    filter: { value: "{colors.yellow.50}" },
    loop: { value: "{colors.amber.50}" },
    condition: { value: "{colors.indigo.50}" },
    multiOutput: { value: "{colors.violet.50}" },
    dataProcess: { value: "{colors.cyan.50}" },
    outputFormat: { value: "{colors.pink.50}" },
    earlyExit: { value: "{colors.rose.50}" },
    notification: { value: "{colors.sky.50}" },
    llm: { value: "{colors.purple.50}" },
  },

  // --- 텍스트 ---
  text: {
    primary: { value: "{colors.neutral.900}" },
    secondary: { value: "{colors.neutral.600}" },
    disabled: { value: "{colors.neutral.400}" },
    inverse: { value: "{colors.neutral.0}" },
  },

  // --- 배경 ---
  bg: {
    canvas: { value: "{colors.neutral.50}" },
    surface: { value: "{colors.neutral.0}" },
    overlay: { value: "{colors.neutral.100}" },
  },

  // --- 보더 ---
  border: {
    default: { value: "{colors.neutral.200}" },
    strong: { value: "{colors.neutral.400}" },
    selected: { value: "{colors.brand.500}" },
  },

  // --- 상태 ---
  status: {
    success: { value: "{colors.success.500}" },
    warning: { value: "{colors.warning.500}" },
    error: { value: "{colors.error.500}" },
    info: { value: "{colors.info.500}" },
  },
};
