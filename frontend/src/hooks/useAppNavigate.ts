import { useNavigate } from "react-router-dom";

/**
 * Custom navigation hook
 * Wraps react-router's useNavigate for reuse across app
 */
export const useAppNavigate = () => {
  const navigate = useNavigate();

  // basic navigate function
  const goTo = (path: string) => {
    navigate(path);
  };

  // go back
  const back = () => {
    navigate(-1);
  };

  // replace route (useful after login/logout)
  const replace = (path: string) => {
    navigate(path, { replace: true });
  };

  return {
    goTo,
    back,
    replace,
  };
};
