/**
 * Tests for useForm custom hook
 */

import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';

describe('useForm', () => {
  const initialValues = {
    email: '',
    password: '',
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize form values', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit)
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle field changes', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit)
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com', type: 'text' },
      });
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('should handle checkbox changes', () => {
    const { result } = renderHook(() =>
      useForm({ ...initialValues, remember: false }, mockOnSubmit)
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'remember', checked: true, type: 'checkbox' },
      });
    });

    expect(result.current.values.remember).toBe(true);
  });

  it('should mark field as touched on blur', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit)
    );

    act(() => {
      result.current.handleBlur({
        target: { name: 'email' },
      });
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('should call onSubmit with form values', async () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit)
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com', type: 'text' },
      });
      result.current.handleChange({
        target: { name: 'password', value: 'password123', type: 'text' },
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      });
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should run validation on submit', async () => {
    const mockValidate = jest.fn(values => {
      const errors = {};
      if (!values.email) errors.email = 'Email required';
      return errors;
    });

    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit, mockValidate)
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      });
    });

    expect(mockValidate).toHaveBeenCalled();
    expect(result.current.errors.email).toBe('Email required');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should reset form to initial values', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit)
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com', type: 'text' },
      });
      result.current.handleBlur({
        target: { name: 'email' },
      });
    });

    expect(result.current.values.email).toBe('test@example.com');
    expect(result.current.touched.email).toBe(true);

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.touched).toEqual({});
    expect(result.current.errors).toEqual({});
  });

  it('should clear error on change', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit)
    );

    act(() => {
      result.current.setFieldError('email', 'Invalid email');
    });

    expect(result.current.errors.email).toBe('Invalid email');

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com', type: 'text' },
      });
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('should set field value programmatically', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit)
    );

    act(() => {
      result.current.setFieldValue('email', 'programmatic@example.com');
    });

    expect(result.current.values.email).toBe('programmatic@example.com');
  });

  it('should set field error programmatically', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit)
    );

    act(() => {
      result.current.setFieldError('email', 'Custom error');
    });

    expect(result.current.errors.email).toBe('Custom error');
  });

  it('should handle submission errors', async () => {
    const mockError = new Error('Submission failed');
    const mockFailingSubmit = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useForm(initialValues, mockFailingSubmit)
    );

    await act(async () => {
      try {
        await result.current.handleSubmit({
          preventDefault: jest.fn(),
        });
      } catch (e) {
        // Expected
      }
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});
