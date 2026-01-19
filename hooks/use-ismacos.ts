import * as React from "react";

// =============================================================================
// Types
// =============================================================================

interface NavigatorUAData {
  platform: string;
}

type NavigatorWithUAData = Navigator & { userAgentData?: NavigatorUAData };

// =============================================================================
// Hook
// =============================================================================

export function useIsMacOS() {
  const [isMacOS, setIsMacOS] = React.useState(false);

  React.useEffect(() => {
    const nav = navigator as NavigatorWithUAData;
    const isMac =
      nav.userAgentData?.platform === "macOS" ||
      /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsMacOS(isMac);
  }, []);

  return isMacOS;
}
