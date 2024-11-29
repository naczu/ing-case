import { expect } from '@open-wc/testing';
import { validateEmail, validatePhone, validateDateOfBirth, validateEmploymentDate } from './validators.js';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).to.be.true;
      expect(validateEmail('user.name+tag@example.co.uk')).to.be.true;
    });

    it('invalidates incorrect email formats', () => {
      expect(validateEmail('invalid')).to.be.false;
      expect(validateEmail('test@')).to.be.false;
      expect(validateEmail('@example.com')).to.be.false;
    });
  });

  describe('validatePhone', () => {
    it('validates correct phone formats', () => {
      expect(validatePhone('1234567890')).to.be.true;
    });

    it('invalidates incorrect phone formats', () => {
      expect(validatePhone('123')).to.be.false;
      expect(validatePhone('12345')).to.be.false;
      expect(validatePhone('123456789a')).to.be.false;
    });
  });

  describe('validateDateOfBirth', () => {
    it('validates acceptable age range', () => {
      const today = new Date();
      const age25 = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
      expect(validateDateOfBirth(age25.toISOString())).to.be.true;
    });

    it('invalidates unacceptable age range', () => {
      const today = new Date();
      const age15 = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
      const age80 = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());
      expect(validateDateOfBirth(age15.toISOString())).to.be.false;
      expect(validateDateOfBirth(age80.toISOString())).to.be.false;
    });
  });

  describe('validateEmploymentDate', () => {
    it('validates dates not in future', () => {
      const today = new Date();
      const pastDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      expect(validateEmploymentDate(pastDate.toISOString())).to.be.true;
      expect(validateEmploymentDate(today.toISOString())).to.be.true;
    });

    it('invalidates future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(validateEmploymentDate(futureDate.toISOString())).to.be.false;
    });
  });
});