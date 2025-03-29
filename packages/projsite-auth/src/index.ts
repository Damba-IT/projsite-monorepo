/**
 * @file Shared authentication utilities for Projsite applications
 */

import { User } from '@projsite/types';
import { Clerk } from '@clerk/backend';

// Authentication helper functions

/**
 * Verify a JWT token and retrieve the user
 */
export async function verifyToken(token: string): Promise<User | null> {
  try {
    // This is a placeholder implementation
    // In a real implementation, this would verify the token with Clerk's API
    if (!token) return null;

    // Example implementation using Clerk
    const clerk = Clerk({ apiKey: process.env.CLERK_API_KEY });
    const jwtPayload = await clerk.verifyToken(token);
    
    if (!jwtPayload) return null;

    return {
      id: jwtPayload.sub,
      name: jwtPayload.name || '',
      email: jwtPayload.email || '',
      organizationIds: jwtPayload.organizationIds || []
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * Check if a user has permission to access a resource
 */
export function checkPermission(user: User, resourceId: string, requiredPermission: string): boolean {
  // This is a placeholder implementation
  // In a real implementation, this would check the user's permissions against the resource
  return !!user && !!resourceId && !!requiredPermission;
}

/**
 * Check if a user belongs to an organization
 */
export function isUserInOrganization(user: User, organizationId: string): boolean {
  if (!user || !organizationId) return false;
  return user.organizationIds.includes(organizationId);
}

// Export other authentication utilities as needed 