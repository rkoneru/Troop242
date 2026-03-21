/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Announce screen reader messages
 * Use for dynamic updates that don't get announced automatically
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority); // 'polite' or 'assertive'
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Visually hidden but screen reader visible
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement (browsers read and then remove)
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check color contrast ratio (WCAG AAA = 7:1, AA = 4.5:1)
 * Returns true if meets AA standard
 */
export function isContrastSufficient(color1, color2, level = 'AA') {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const contrast = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

  return level === 'AAA' ? contrast >= 7 : contrast >= 4.5;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Get relative luminance (WCAG formula)
 */
function getRelativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map(x => {
    x = x / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Trap focus within modal (prevent tabbing outside)
 */
export function trapFocus(element, callback) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  element.addEventListener('keydown', handleKeyDown);

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Set focus on an element with optional message
 */
export function setFocus(element, message) {
  if (element) {
    element.focus();
    if (message) {
      announceToScreenReader(message, 'assertive');
    }
  }
}

/**
 * Get focus-visible state (keyboard focus vs mouse click)
 */
export function isFocusVisible() {
  return document.body.hasAttribute('data-focus-visible');
}

/**
 * Utility to skip to main content
 */
export function createSkipLink(mainContentSelector = 'main') {
  const link = document.createElement('a');
  link.href = mainContentSelector;
  link.textContent = 'Skip to main content';
  link.className = 'sr-only sr-only-focusable';

  link.addEventListener('click', (e) => {
    e.preventDefault();
    const main = document.querySelector(mainContentSelector);
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      main.addEventListener('blur', () => {
        main.removeAttribute('tabindex');
      });
    }
  });

  return link;
}

/**
 * Prevent automatic screen zoom on input focus (iOS)
 */
export function disableAutoZoom() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content',
      'width=device-width, initial-scale=1, user-scalable=yes'
    );
  }
}

/**
 * Respect prefers-reduced-motion preference
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Disable animations if user prefers reduced motion
 */
export function respectMotionPreference() {
  if (prefersReducedMotion()) {
    // Remove animation classes
    document.body.style.animationDuration = '0.01ms';
    document.body.style.transitionDuration = '0.01ms';
  }
}

/**
 * Validate ARIA attributes
 */
export function validateAriaLabels(element = document.body) {
  const issues = [];

  // Check images have alt text
  const images = element.querySelectorAll('img:not([alt])');
  if (images.length > 0) {
    issues.push(`${images.length} images missing alt text`);
  }

  // Check buttons have accessible text
  const buttons = element.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  buttons.forEach((btn) => {
    if (!btn.textContent.trim()) {
      issues.push('Button missing accessible text or aria-label');
    }
  });

  // Check form inputs have labels
  const inputs = element.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  inputs.forEach((input) => {
    const label = element.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.id) {
      issues.push('Input missing associated label or aria-label');
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
}
