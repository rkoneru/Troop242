/**
 * Custom hook for form state management and validation
 * Handles form values, errors, and submission
 */

import { useState, useCallback } from 'react';

/**
 * Hook for managing form state with validation
 * @param {Object} initialValues - Initial form field values
 * @param {Function} onSubmit - Callback on form submission
 * @param {Function} validate - Validation function (optional)
 * @returns {Object} Form state and handlers
 */
export function useForm(initialValues, onSubmit, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  });

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur if validator provided
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: validationErrors[name],
        }));
      }
    }
  });

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Run full validation
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setTouched(
          Object.keys(initialValues).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {})
        );
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (err) {
      // onSubmit should handle errors, but catch global failures
      console.error('Form submission error:', err);
      setErrors({ _global: err.message });
    } finally {
      setIsSubmitting(false);
    }
  });

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  });

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  });

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  });

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
}
