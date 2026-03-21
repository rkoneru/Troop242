/**
 * Unit tests for Zod validation schemas
 * Tests all auth, user, activity, and invitation schemas
 */

import { validate, validateOrThrow, authSchemas, userSchemas, activitySchemas, announcementSchemas, invitationSchemas } from '../validation';

describe('Validation Schemas', () => {
  describe('authSchemas.register', () => {
    it('should validate valid registration data', () => {
      const data = {
        email: 'scout@example.com',
        name: 'John Scout',
        password: 'Password123',
        confirmPassword: 'Password123',
      };
      const result = validate(data, authSchemas.register);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should reject mismatched passwords', () => {
      const data = {
        email: 'scout@example.com',
        name: 'John Scout',
        password: 'Password123',
        confirmPassword: 'Password456',
      };
      const result = validate(data, authSchemas.register);
      expect(result.valid).toBe(false);
      expect(result.errors.confirmPassword).toBe('Passwords do not match');
    });

    it('should reject weak passwords', () => {
      const data = {
        email: 'scout@example.com',
        name: 'John Scout',
        password: 'weakpass',
        confirmPassword: 'weakpass',
      };
      const result = validate(data, authSchemas.register);
      expect(result.valid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'not-an-email',
        name: 'John Scout',
        password: 'Password123',
        confirmPassword: 'Password123',
      };
      const result = validate(data, authSchemas.register);
      expect(result.valid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it('should reject short names', () => {
      const data = {
        email: 'scout@example.com',
        name: 'J',
        password: 'Password123',
        confirmPassword: 'Password123',
      };
      const result = validate(data, authSchemas.register);
      expect(result.valid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });
  });

  describe('authSchemas.login', () => {
    it('should validate valid login data', () => {
      const data = {
        email: 'scout@example.com',
        password: 'Password123',
      };
      const result = validate(data, authSchemas.login);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid',
        password: 'Password123',
      };
      const result = validate(data, authSchemas.login);
      expect(result.valid).toBe(false);
    });

    it('should require password', () => {
      const data = {
        email: 'scout@example.com',
        password: '',
      };
      const result = validate(data, authSchemas.login);
      expect(result.valid).toBe(false);
    });
  });

  describe('userSchemas.scoutProfile', () => {
    it('should validate valid scout profile', () => {
      const data = {
        name: 'John Scout',
        email: 'scout@example.com',
        phone: '555-123-4567',
        rank: 'Star',
      };
      const result = validate(data, userSchemas.scoutProfile);
      expect(result.valid).toBe(true);
    });

    it('should accept valid rank values', () => {
      const ranks = ['Scout', 'Tenderfoot', 'Second Class', 'First Class', 'Star', 'Life', 'Eagle'];
      ranks.forEach(rank => {
        const data = {
          name: 'John Scout',
          email: 'scout@example.com',
          rank,
        };
        const result = validate(data, userSchemas.scoutProfile);
        expect(result.valid).toBe(true);
      });
    });

    it('should reject invalid rank', () => {
      const data = {
        name: 'John Scout',
        email: 'scout@example.com',
        rank: 'InvalidRank',
      };
      const result = validate(data, userSchemas.scoutProfile);
      expect(result.valid).toBe(false);
    });

    it('should validate optional phone', () => {
      const data = {
        name: 'John Scout',
        email: 'scout@example.com',
      };
      const result = validate(data, userSchemas.scoutProfile);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid phone format', () => {
      const data = {
        name: 'John Scout',
        email: 'scout@example.com',
        phone: 'not-a-phone-number',
      };
      const result = validate(data, userSchemas.scoutProfile);
      expect(result.valid).toBe(false);
    });
  });

  describe('activitySchemas.create', () => {
    it('should validate valid activity', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const data = {
        title: 'Camping Trip',
        type: 'activity',
        date: tomorrow.toISOString(),
        time: '14:30',
        location: 'Camp Forested',
        description: 'A fun camping experience with all scouts',
        spots: 25,
        dues: 50,
      };
      const result = validate(data, activitySchemas.create);
      expect(result.valid).toBe(true);
    });

    it('should reject past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const data = {
        title: 'Camping Trip',
        type: 'activity',
        date: yesterday.toISOString(),
        time: '14:30',
        location: 'Camp Forested',
        description: 'A fun camping experience with all scouts',
        spots: 25,
      };
      const result = validate(data, activitySchemas.create);
      expect(result.valid).toBe(false);
    });

    it('should validate both activity and event types', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      ['activity', 'event'].forEach(type => {
        const data = {
          title: 'Test',
          type,
          date: tomorrow.toISOString(),
          time: '14:30',
          location: 'Location',
          description: 'A description of the activity',
          spots: 10,
        };
        const result = validate(data, activitySchemas.create);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('announcementSchemas.create', () => {
    it('should validate valid announcement', () => {
      const data = {
        title: 'Important Update',
        body: 'This is an important update for all members',
        pinned: true,
      };
      const result = validate(data, announcementSchemas.create);
      expect(result.valid).toBe(true);
    });

    it('should reject short body', () => {
      const data = {
        title: 'Update',
        body: 'Short',
      };
      const result = validate(data, announcementSchemas.create);
      expect(result.valid).toBe(false);
    });
  });

  describe('invitationSchemas.create', () => {
    it('should validate valid invitation', () => {
      const data = {
        role: 'scout',
        expiresInDays: 30,
      };
      const result = validate(data, invitationSchemas.create);
      expect(result.valid).toBe(true);
    });

    it('should use default expiration', () => {
      const data = {
        role: 'leader',
      };
      const result = validate(data, invitationSchemas.create);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid roles', () => {
      const data = {
        role: 'admin',
        expiresInDays: 30,
      };
      const result = validate(data, invitationSchemas.create);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateOrThrow', () => {
    it('should return result on success', () => {
      const data = {
        email: 'scout@example.com',
        password: 'Password123',
      };
      const result = validateOrThrow(data, authSchemas.login);
      expect(result.valid).toBe(true);
    });

    it('should throw on validation failure', () => {
      const data = {
        email: 'invalid',
        password: '',
      };
      expect(() => {
        validateOrThrow(data, authSchemas.login);
      }).toThrow();
    });

    it('should include context in error message', () => {
      const data = {
        email: 'invalid',
        password: 'Password123',
      };
      expect(() => {
        validateOrThrow(data, authSchemas.login, 'user_login');
      }).toThrow(/user_login/);
    });
  });
});
