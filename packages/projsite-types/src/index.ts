/**
 * @file Common TypeScript types for Projsite applications
 */

// Project-related types
export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Organization-related types
export interface Organization {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  organizationIds: string[];
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

// Export additional types needed by both frontend and backend 