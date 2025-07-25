/**
 * Environment Configuration
 *
 * This module provides type-safe access to environment variables used throughout the application.
 * All environment variables are documented here for easy reference and validation.
 */

export interface Environment {
  // Application Configuration
  NODE_ENV: string;
  APP_URL: string;
  SESSION_KEY: string;

  // Keycloak Authentication
  KEYCLOAK_BASE: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;

  // Azure Storage
  AZURE_STORAGE_ACCOUNT_NAME: string;
  AZURE_STORAGE_ACCOUNT_KEY: string;
  AZURE_CONTAINER_NAME: string;

  // Backend API
  BACKEND_URL: string;
  BACKEND_KEY: string;

  // WiFi API
  WIFI_API_URL: string;
  WIFI_API_KEY: string;

  // Devices API
  DEVICES_API_URL: string;
  DEVICES_API_KEY: string;

  // OPERATORS API KEY
  OPERATORS_API_KEY: string;

  // NAS API
  NAS_API_URL: string;
  NAS_API_KEY: string;
}

/**
 * Loads environment variables with validation and warnings for missing values.
 * Missing variables are set to empty strings to prevent build crashes.
 */
export function loadEnvironment(): Environment {
  const requiredVars: (keyof Environment)[] = [
    "NODE_ENV",
    "APP_URL",
    "SESSION_KEY",
    "KEYCLOAK_BASE",
    "KEYCLOAK_REALM",
    "KEYCLOAK_CLIENT_ID",
    "AZURE_STORAGE_ACCOUNT_NAME",
    "AZURE_STORAGE_ACCOUNT_KEY",
    "AZURE_CONTAINER_NAME",
    "BACKEND_URL",
    "BACKEND_KEY",
    "WIFI_API_URL",
    "WIFI_API_KEY",
    "DEVICES_API_URL",
    "DEVICES_API_KEY",
    "NAS_API_URL",
    "NAS_API_KEY",
  ];

  const missingVars: string[] = [];
  const env: Environment = {} as Environment;

  for (const varName of requiredVars) {
    const value = process.env[varName];

    if (!value) {
      missingVars.push(varName);
      env[varName] = "";
    } else {
      env[varName] = value;
    }
  }

  // Log warnings for missing variables
  if (missingVars.length > 0) {
    console.warn("Missing environment variables:");
    missingVars.forEach((varName) => {
      console.warn(`   - ${varName}`);
    });
    console.warn(
      "   These variables have been set to empty strings to prevent build failures."
    );
  }

  return env;
}

// Export a singleton instance for use throughout the application
export const env = loadEnvironment();
