/**
 * Leader Dashboard Validation Utilities
 * Validates forms, data, and business rules
 */

/**
 * Validate email format
 * @param {string} email - email to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true, error: '' };
}

/**
 * Validate scout name
 * @param {string} name - name to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateScoutName(name) {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Scout name is required' };
  }

  if (name.length < 2) {
    return { valid: false, error: 'Scout name must be at least 2 characters' };
  }

  if (name.length > 100) {
    return { valid: false, error: 'Scout name must be less than 100 characters' };
  }

  return { valid: true, error: '' };
}

/**
 * Validate phone number (US format)
 * @param {string} phone - phone to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export function validatePhone(phone) {
  if (!phone) {
    return { valid: true, error: '' }; // Optional field
  }

  // Allow various formats: 1234567890, (123) 456-7890, 123-456-7890, etc.
  const phoneRegex = /^[\d\s\-\(\)\.]+$/;

  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'Invalid phone format' };
  }

  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return { valid: false, error: 'Phone number must have at least 10 digits' };
  }

  return { valid: true, error: '' };
}

/**
 * Validate activity form
 * @param {object} activity - activity object to validate
 * @returns {object} - { valid: boolean, errors: object }
 */
export function validateActivityForm(activity) {
  const errors = {};

  if (!activity.title || !activity.title.trim()) {
    errors.title = 'Activity title is required';
  } else if (activity.title.length > 100) {
    errors.title = 'Activity title must be less than 100 characters';
  }

  if (!activity.date) {
    errors.date = 'Activity date is required';
  } else {
    const actDate = new Date(activity.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (actDate < today) {
      errors.date = 'Activity date cannot be in the past';
    }
  }

  if (activity.time && !/^\d{1,2}:\d{2}/.test(activity.time)) {
    errors.time = 'Invalid time format (use HH:MM)';
  }

  if (activity.location && activity.location.length > 200) {
    errors.location = 'Location must be less than 200 characters';
  }

  if (activity.description && activity.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  if (!activity.spots || activity.spots < 1) {
    errors.spots = 'Activity must have at least 1 spot';
  } else if (activity.spots > 1000) {
    errors.spots = 'Activity spots must be less than 1000';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate event form
 * @param {object} event - event object to validate
 * @returns {object} - { valid: boolean, errors: object }
 */
export function validateEventForm(event) {
  const errors = {};

  if (!event.title || !event.title.trim()) {
    errors.title = 'Event title is required';
  } else if (event.title.length > 100) {
    errors.title = 'Event title must be less than 100 characters';
  }

  if (!event.date) {
    errors.date = 'Event date is required';
  } else {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      errors.date = 'Event date cannot be in the past';
    }
  }

  if (event.time && !/^\d{1,2}:\d{2}/.test(event.time)) {
    errors.time = 'Invalid time format (use HH:MM)';
  }

  if (event.location && event.location.length > 200) {
    errors.location = 'Location must be less than 200 characters';
  }

  if (event.description && event.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate invitation form
 * @param {object} invitation - invitation object to validate
 * @returns {object} - { valid: boolean, errors: object }
 */
export function validateInvitationForm(invitation) {
  const errors = {};

  const nameValidation = validateScoutName(invitation.name);
  if (!nameValidation.valid) {
    errors.name = nameValidation.error;
  }

  const emailValidation = validateEmail(invitation.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }

  if (!invitation.type || !['scout', 'leader', 'parent'].includes(invitation.type)) {
    errors.type = 'Invalid invitation type';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Check if scout data contains duplicates
 * @param {array} scouts - scouts array
 * @param {string} email - email to check (excluding self)
 * @param {string|number} excludeId - scout ID to exclude from check
 * @returns {object} - { isDuplicate: boolean, error: string }
 */
export function checkDuplicateScout(scouts, email, excludeId = null) {
  if (!email) {
    return { isDuplicate: false, error: '' };
  }

  const exists = scouts.some(
    scout => scout.email.toLowerCase() === email.toLowerCase() && scout.id !== excludeId
  );

  if (exists) {
    return { isDuplicate: true, error: 'Scout with this email already exists' };
  }

  return { isDuplicate: false, error: '' };
}

/**
 * Check if activity already exists
 * @param {array} activities - activities array
 * @param {string} title - activity title
 * @param {string} date - activity date
 * @param {string|number} excludeId - activity ID to exclude from check
 * @returns {object} - { isDuplicate: boolean, error: string }
 */
export function checkDuplicateActivity(activities, title, date, excludeId = null) {
  if (!title || !date) {
    return { isDuplicate: false, error: '' };
  }

  const exists = activities.some(
    activity =>
      activity.title.toLowerCase() === title.toLowerCase() &&
      activity.date === date &&
      activity.id !== excludeId
  );

  if (exists) {
    return { isDuplicate: true, error: 'An activity with this name already exists on this date' };
  }

  return { isDuplicate: false, error: '' };
}

/**
 * Validate activity capacity (can't reduce below current signups)
 * @param {number} newSpots - new spots value
 * @param {number} currentSignups - current signup count
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateActivityCapacity(newSpots, currentSignups) {
  if (newSpots < currentSignups) {
    return {
      valid: false,
      error: `Cannot reduce spots below current signups (${currentSignups})`
    };
  }

  return { valid: true, error: '' };
}

/**
 * Check if activity is full
 * @param {object} activity - activity object
 * @returns {boolean}
 */
export function isActivityFull(activity) {
  if (!activity.signups) return false;
  return activity.signups.length >= activity.spots;
}

/**
 * Get all validation errors as formatted string
 * @param {object} errors - errors object from validation
 * @returns {string} - formatted error message
 */
export function formatValidationErrors(errors) {
  return Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join('\n');
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - user input
 * @returns {string} - sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Trim whitespace from object string values
 * @param {object} obj - object to trim
 * @returns {object} - trimmed object
 */
export function trimObjectStrings(obj) {
  const trimmed = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      trimmed[key] = value.trim();
    } else if (Array.isArray(value)) {
      trimmed[key] = value.map(v => (typeof v === 'string' ? v.trim() : v));
    } else {
      trimmed[key] = value;
    }
  }

  return trimmed;
}
