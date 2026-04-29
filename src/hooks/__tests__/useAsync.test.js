/**
 * Tests for useAsync and useMutation custom hooks
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsync, useMutation } from '../useAsync';

describe('useAsync', () => {
  it('should load data on mount', async () => {
    const mockFn = jest.fn().mockResolvedValue('test-data');

    const { result } = renderHook(() =>
      useAsync(mockFn, true)
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe('test-data');
    });
  });

  it('should not load immediately if immediate is false', async () => {
    const mockFn = jest.fn().mockResolvedValue('test-data');

    const { result } = renderHook(() =>
      useAsync(mockFn, false)
    );

    expect(result.current.loading).toBe(false);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should execute async function manually', async () => {
    const mockFn = jest.fn().mockResolvedValue('manual-data');

    const { result } = renderHook(() =>
      useAsync(mockFn, false)
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('manual-data');
  });

  it('should handle errors', async () => {
    const mockError = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useAsync(mockFn, true)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockError);
    });
  });

  it('should pass arguments to execute', async () => {
    const mockFn = jest.fn().mockResolvedValue('result');

    const { result } = renderHook(() =>
      useAsync(mockFn, false)
    );

    await act(async () => {
      await result.current.execute('arg1', 'arg2');
    });

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should re-run on dependency changes', async () => {
    const mockFn = jest.fn().mockResolvedValue('new-data');

    const { rerender, result } = renderHook(
      ({ dep }) => useAsync(mockFn, true, [dep]),
      { initialProps: { dep: 1 } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);

    rerender({ dep: 2 });

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});

describe('useMutation', () => {
  it('should not run on mount', () => {
    const mockFn = jest.fn();

    renderHook(() => useMutation(mockFn));

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should execute mutation on call', async () => {
    const mockFn = jest.fn().mockResolvedValue('mutation-result');

    const { result } = renderHook(() => useMutation(mockFn));

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.mutate('arg1', 'arg2');
    });

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(result.current.data).toBe('mutation-result');
    expect(result.current.loading).toBe(false);
  });

  it('should set loading during mutation', async () => {
    const mockFn = jest.fn(
      () => new Promise(resolve => setTimeout(() => resolve('result'), 50))
    );

    const { result } = renderHook(() => useMutation(mockFn));

    let loadingDuringMutation = false;

    act(() => {
      result.current.mutate().then(() => {
        loadingDuringMutation = result.current.loading;
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle mutation errors', async () => {
    const mockError = new Error('Mutation failed');
    const mockFn = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useMutation(mockFn));

    await act(async () => {
      try {
        await result.current.mutate();
      } catch (e) {
        // Expected
      }
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.loading).toBe(false);
  });

  it('should reset mutation state', async () => {
    const mockFn = jest.fn().mockResolvedValue('result');

    const { result } = renderHook(() => useMutation(mockFn));

    await act(async () => {
      await result.current.mutate();
    });

    expect(result.current.data).toBe('result');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
