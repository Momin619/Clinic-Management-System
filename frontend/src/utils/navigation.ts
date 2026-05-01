import type { NavigateFunction } from "react-router-dom";

let navigator: NavigateFunction | null = null;

// setter (used once in App)
export const setNavigator = (nav: NavigateFunction) => {
  navigator = nav;
};

// global helper function
export const navigateTo = (to: string, options?: any) => {
  if (navigator) {
    navigator(to, options);
  } else {
    console.warn("Navigator is not initialized yet");
  }
};
