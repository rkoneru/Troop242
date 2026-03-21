/**
 * Tests for useFirebaseCollection custom hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useFirebaseCollection } from '../useFirebaseCollection';

const mockGetDocs = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: mockCollection,
  getDocs: mockGetDocs,
  query: mockQuery,
}));

describe('useFirebaseCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCollection.mockReturnValue('mock-collection-ref');
    mockQuery.mockReturnValue('mock-query');
  });

  it('should load collection data on mount', async () => {
    const mockDocs = [
      {
        id: 'doc-1',
        data: () => ({ name: 'Scout 1', rank: 'Star' }),
      },
      {
        id: 'doc-2',
        data: () => ({ name: 'Scout 2', rank: 'Life' }),
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: mockDocs,
    });

    const { result } = renderHook(() =>
      useFirebaseCollection('scouts')
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([
        { id: 'doc-1', name: 'Scout 1', rank: 'Star' },
        { id: 'doc-2', name: 'Scout 2', rank: 'Life' },
      ]);
    });
  });

  it('should handle empty collection', async () => {
    mockGetDocs.mockResolvedValue({
      docs: [],
    });

    const { result } = renderHook(() =>
      useFirebaseCollection('scouts')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([]);
    });
  });

  it('should apply query constraints', async () => {
    const mockConstraints = ['where-constraint', 'orderby-constraint'];

    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: 'doc-1',
          data: () => ({ name: 'Filtered Scout', rank: 'Eagle' }),
        },
      ],
    });

    const { result } = renderHook(() =>
      useFirebaseCollection('scouts', mockConstraints)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(mockQuery).toHaveBeenCalledWith(
        'mock-collection-ref',
        ...mockConstraints
      );
    });
  });

  it('should handle errors', async () => {
    const mockError = new Error('Firestore error');
    mockGetDocs.mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useFirebaseCollection('scouts')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toEqual([]);
    });
  });

  it('should provide refetch function', async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: 'doc-1',
          data: () => ({ name: 'Scout', rank: 'Star' }),
        },
      ],
    });

    const { result } = renderHook(() =>
      useFirebaseCollection('scouts')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetDocs).toHaveBeenCalledTimes(1);

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(mockGetDocs).toHaveBeenCalledTimes(2);
    });
  });

  it('should log errors to console', async () => {
    const mockError = new Error('Collection error');
    mockGetDocs.mockRejectedValue(mockError);

    jest.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() => useFirebaseCollection('scouts'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching scouts'),
        mockError
      );
    });

    console.error.mockRestore();
  });

  it('should transform document structure correctly', async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: 'test-id',
          data: () => ({
            name: 'John Scout',
            email: 'john@example.com',
            rank: 'Tenderfoot',
          }),
        },
      ],
    });

    const { result } = renderHook(() =>
      useFirebaseCollection('scouts')
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([
        {
          id: 'test-id',
          name: 'John Scout',
          email: 'john@example.com',
          rank: 'Tenderfoot',
        },
      ]);
    });
  });
});
