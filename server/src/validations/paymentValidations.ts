import { body } from "express-validator";

// SWIFT code format: 8 or 11 characters (AAAA BB CC DDD)
export const SWIFT_REGEX = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

// IBAN format: basic validation (2 letter country code + 2 check digits + up to 30 alphanumeric)
export const IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

// Currency codes (ISO 4217)
export const CURRENCY_REGEX = /^(USD|EUR|GBP|JPY|CHF|CAD|AUD)$/;

// Payment reference/description
export const PAYMENT_REFERENCE_REGEX = /^[a-zA-Z0-9\s.,'\-]{1,100}$/;

// Beneficiary name
export const BENEFICIARY_NAME_REGEX = /^[a-zA-Z\s.,'\-]{2,100}$/;

export const createPaymentValidators = [
  body("recipientName")
    .isString()
    .trim()
    .matches(BENEFICIARY_NAME_REGEX)
    .withMessage("Invalid beneficiary name format"),
  
  body("recipientSwift")
    .isString()
    .trim()
    .toUpperCase()
    .matches(SWIFT_REGEX)
    .withMessage("Invalid SWIFT/BIC code format"),
  
  body("recipientAccount")
    .isString()
    .trim()
    .toUpperCase()
    .matches(IBAN_REGEX)
    .withMessage("Invalid IBAN format"),
  
  body("amount")
    .isFloat({ min: 0.01, max: 999999999 })
    .withMessage("Amount must be a positive number"),
  
  body("currency")
    .isString()
    .trim()
    .toUpperCase()
    .matches(CURRENCY_REGEX)
    .withMessage("Invalid currency code"),
  
  body("reference")
    .isString()
    .trim()
    .matches(PAYMENT_REFERENCE_REGEX)
    .withMessage("Invalid payment reference format"),
];
