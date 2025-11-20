// Constants for property types, roles, and other enums
export const PROPERTY_TYPES = {
  SELF_CONTAIN: 'self contain',
  ONE_BEDROOM: '1-bedroom',
  TWO_BEDROOM: '2-bedroom',
  THREE_BEDROOM: '3-bedroom',
  FOUR_BEDROOM: '4-bedroom',
};

export const PROPERTY_LABELS = {
  [PROPERTY_TYPES.SELF_CONTAIN]: 'Self Contain',
  [PROPERTY_TYPES.ONE_BEDROOM]: '1 Bedroom',
  [PROPERTY_TYPES.TWO_BEDROOM]: '2 Bedroom',
  [PROPERTY_TYPES.THREE_BEDROOM]: '3 Bedroom',
  [PROPERTY_TYPES.FOUR_BEDROOM]: '4 Bedroom',
};

export const USER_ROLES = {
  TENANT: 'tenant',
  LANDLORD: 'landlord',
};

export const ROLE_LABELS = {
  [USER_ROLES.TENANT]: 'Tenant',
  [USER_ROLES.LANDLORD]: 'Landlord',
};

// Occupancy limits by property type
export const OCCUPANCY_LIMITS = {
  [PROPERTY_TYPES.SELF_CONTAIN]: 1,
  [PROPERTY_TYPES.ONE_BEDROOM]: 2,
  [PROPERTY_TYPES.TWO_BEDROOM]: 4,
  [PROPERTY_TYPES.THREE_BEDROOM]: 6,
  [PROPERTY_TYPES.FOUR_BEDROOM]: 8,
};

// Validation rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_PATTERN: /^[0-9]{10,15}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Default pagination
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

// Toast/Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
