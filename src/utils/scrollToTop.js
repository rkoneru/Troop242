/**
 * Utility function to scroll to the top of the page with smooth behavior
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Hook-like function to scroll to top on navigation
 * Usage: onClick={() => { navigate('/path'); scrollToTop(); }}
 */
export const navigateAndScroll = (navigate, path) => {
  navigate(path);
  scrollToTop();
};
