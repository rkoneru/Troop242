/**
 * Unit tests for invitations utility
 * Tests secure code generation, verification, and revocation
 */

import {
  generateSecureInviteCode,
  generateSecurePassword,
  createInvitation,
  verifyInvitation,
  markInvitationUsed,
  revokeInvitation,
} from '../invitations';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

// Mock Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn((...args) => ({ path: args.join('/') })),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({
      toDate: () => new Date(),
    })),
    fromDate: jest.fn((date) => ({
      toDate: () => date,
    })),
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
      expect(/^[A-Z0-9]+$/.test(code)).toBe(true);
    });
  });

  describe('generateSecurePassword', () => {
    it('should generate a password of requested length', () => {
      const pwd = generateSecurePassword(16);
      expect(pwd.length).toBe(16);
    });

    it('should use characters from the charset', () => {
      const pwd = generateSecurePassword(100);
      const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
      for (const char of pwd) {
        expect(charset).toContain(char);
      }
    });
  });

  describe('createInvitation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create an invitation with valid role', async () => {
      setDoc.mockResolvedValue({ id: 'doc-id' });

      const code = await createInvitation('scout', 30, 'leader-uid');
      expect(code).toBeDefined();
      expect(setDoc).toHaveBeenCalled();

      const [docRef, data] = setDoc.mock.calls[0];
      expect(data.role).toBe('scout');
      expect(data.createdByUid).toBe('leader-uid');
    });

    it('should set expiration correctly', async () => {
      setDoc.mockResolvedValue({ id: 'doc-id' });

      await createInvitation('leader', 14, 'admin-uid');

      expect(setDoc).toHaveBeenCalled();
      expect(Timestamp.fromDate).toHaveBeenCalled();
    });

    it('should include metadata', async () => {
      setDoc.mockResolvedValue({ id: 'doc-id' });

      await createInvitation('scout', 30, 'leader-uid', { email: 'test@example.com' });

      const [, data] = setDoc.mock.calls[0];
      expect(data.email).toBe('test@example.com');
    });
  });

  describe('verifyInvitation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return null for non-existent code', async () => {
      getDoc.mockResolvedValue({
        exists: () => false,
      });

      const result = await verifyInvitation('nonexistent-code');
      expect(result).toBe(null);
    });

    it('should reject expired codes', async () => {
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

      const result = await verifyInvitation('expired-code');
      expect(result).toBe(null);
    });

    it('should reject used codes', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          status: 'used',
          expiresAt: {
            toDate: () => new Date(Date.now() + 86400000),
          },
        }),
      });

      const result = await verifyInvitation('used-code');
      expect(result).toBe(null);
    });

    it('should return invitation data for valid code', async () => {
      const invitationData = {
        status: 'pending',
        role: 'scout',
        expiresAt: {
          toDate: () => new Date(Date.now() + 86400000),
        },
      };
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => invitationData,
      });

      const result = await verifyInvitation('valid-code');
      expect(result).toEqual(invitationData);
    });
  });

  describe('markInvitationUsed', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update invitation status to used', async () => {
      setDoc.mockResolvedValue(undefined);

      await markInvitationUsed('code', 'scout-uid', 'scout@example.com');

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'used',
          usedBy: 'scout-uid',
          usedEmail: 'scout@example.com'
        }),
        { merge: true }
      );
    });
  });

  describe('revokeInvitation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update invitation status to revoked', async () => {
      setDoc.mockResolvedValue(undefined);

      await revokeInvitation('code');

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'revoked'
        }),
        { merge: true }
      );
    });
  });
});
