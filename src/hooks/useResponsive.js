import { useWindowDimensions } from 'react-native';

/**
 * Layout helpers for phone, tablet, and wide (desktop / web) viewports.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 768;
  const isDesktop = width >= 1024;

  return {
    width,
    height,
    isWide,
    isDesktop,
    contentMaxWidth: isDesktop ? 1100 : isWide ? 800 : width,
    formMaxWidth: isWide ? 440 : Math.min(width - 32, 400),
    columns: isDesktop ? 3 : isWide ? 2 : 1,
  };
}

export default useResponsive;
