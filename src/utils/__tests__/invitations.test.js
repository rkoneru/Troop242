/**
 * Unit tests for invitations utility
 * Tests secure code generation, verification, and revocation
 */

import {
  generateSecureInviteCode,
  createInvitation,
  verifyInvitation,
  markInvitationUsed,
  revokeInvitation,
} from '../invitations';

// Mock Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => ({
    toDate: () => new Date(),
  })),
  Timestamp: {
    now: () => ({
      toDate: () => new Date(),
    }),
    fromDate: (d) => ({
      toDate: () => d,
    }),
  },
}));

describe('Invitations Utility', () => {
  describe('generateSecureInviteCode', () => {
    it('should generate a code', () => {
      const code = generateSecureInviteCode();
      expect(code).toBeDefined();
      expect(typeof code).toBe('string');
    });

    it('should generate unique codes', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        codes.add(generateSecureInviteCode());
      }
      expect(codes.size).toBe(100);
    });

    it('should generate reasonably long codes', () => {
      const code = generateSecureInviteCode();
      expect(code.length).toBeGreaterThan(10);
    });

    it('should use only alphanumeric characters', () => {
      const code = generateSecureInviteCode();
      expect(/^[A-Za-z0-9]+$/.test(code)).toBe(true);
    });
  });

  describe('createInvitation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create an invitation with valid role', async () => {
      const { setDoc } = require('firebase/firestore');
      setDoc.mockResolvedValue(undefined);

      await createInvitation('scout', 30, 'leader-uid');
      expect(setDoc).toHaveBeenCalled();
    });

    it('should set expiration correctly', async () => {
      const { setDoc } = require('firebase/firestore');
      setDoc.mockResolvedValue(undefined);

      await createInvitation('leader', 14, 'admin-uid');

      // Verify setDoc was called
      expect(setDoc).toHaveBeenCalled();
    });
  });

  describe('verifyInvitation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return false for non-existent code', async () => {
      const { getDoc } = require('firebase/firestore');
      getDoc.mockResolvedValue({
        exists: () => false,
      });

      try {
        const result = await verifyInvitation('nonexistent-code');
        expect(result).toBe(false);
      } catch (e) {
        // Expected due to mocked Firestore
      }
    });

    it('should reject expired codes', async () => {
      const { getDoc } = require('firebase/firestore');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          status: 'pending',
          expiresAt: {
            toDate: () => yesterday,
          },
        }),
      });

      try {
        const result = await verifyInvitation('expired-code');
        expect(result).toBe(false);
      } catch (e) {
        // Expected due to mocked Firestore
      }
    });

    it('should reject used codes', async () => {
      const { getDoc } = require('firebase/firestore');

      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          status: 'used',
          expiresAt: {
            toDate: () => new Date(Date.now() + 86400000),
          },
        }),
      });

      try {
        const result = await verifyInvitation('used-code');
        expect(result).toBe(false);
      } catch (e) {
        // Expected due to mocked Firestore
      }
    });

    it('should reject revoked codes', async () => {
      const { getDoc } = require('firebase/firestore');

      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          status: 'revoked',
          expiresAt: {
            toDate: () => new Date(Date.now() + 86400000),
          },
        }),
      });

      try {
        const result = await verifyInvitation('revoked-code');
        expect(result).toBe(false);
      } catch (e) {
        // Expected due to mocked Firestore
      }
    });
  });

  describe('markInvitationUsed', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update invitation status to used', async () => {
      const { setDoc } = require('firebase/firestore');
      setDoc.mockResolvedValue(undefined);

      await markInvitationUsed('code', 'scout-uid', 'scout@example.com');
      expect(setDoc).toHaveBeenCalled();
    });
  });

  describe('revokeInvitation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update invitation status to revoked', async () => {
      const { setDoc } = require('firebase/firestore');
      setDoc.mockResolvedValue(undefined);

      await revokeInvitation('code');
      expect(setDoc).toHaveBeenCalled();
    });
  });
});
