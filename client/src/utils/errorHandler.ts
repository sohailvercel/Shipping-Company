/**
 * Error Handling Utilities for Vessel Tracking System
 *
 * This module provides comprehensive error handling for tracking operations
 * with user-friendly feedback and proper error categorization.
 */

import { toast } from "react-hot-toast";

// Error types and categories
export enum ErrorCategory {
  NETWORK = "network",
  AUTHENTICATION = "authentication",
  VALIDATION = "validation",
  SERVER = "server",
  TRACKING = "tracking",
  WEBSOCKET = "websocket",
  UNKNOWN = "unknown",
}

export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface TrackingError {
  code: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  userMessage: string;
  retryable: boolean;
  action?: string;
}

export interface ErrorContext {
  vesselId?: string;
  vesselName?: string;
  operation?: string;
  userId?: string;
  endpoint?: string;
  requestId?: string;
  [key: string]: any;
}

// Predefined error messages
const ERROR_MESSAGES = {
  // Network errors
  NETWORK_OFFLINE:
    "You appear to be offline. Please check your internet connection.",
  NETWORK_TIMEOUT: "Request timed out. Please try again.",
  NETWORK_ERROR:
    "Network error occurred. Please check your connection and try again.",

  // Authentication errors
  AUTH_TOKEN_EXPIRED: "Your session has expired. Please log in again.",
  AUTH_UNAUTHORIZED: "You are not authorized to perform this action.",
  AUTH_INVALID_CREDENTIALS: "Invalid credentials provided.",

  // Validation errors
  VALIDATION_REQUIRED_FIELD: "Required field is missing.",
  VALIDATION_INVALID_FORMAT: "Invalid data format provided.",
  VALIDATION_VESSEL_NOT_FOUND: "Vessel not found or does not exist.",

  // Server errors
  SERVER_INTERNAL_ERROR:
    "An internal server error occurred. Please try again later.",
  SERVER_SERVICE_UNAVAILABLE:
    "Service is temporarily unavailable. Please try again later.",
  SERVER_RATE_LIMITED:
    "Too many requests. Please wait a moment before trying again.",

  // Tracking specific errors
  TRACKING_DATA_NOT_FOUND: "Tracking data not available for this vessel.",
  TRACKING_UPDATE_FAILED: "Failed to update vessel status. Please try again.",
  TRACKING_WEBSOCKET_FAILED: "Real-time updates are currently unavailable.",
  TRACKING_INVALID_STATUS: "Invalid vessel status provided.",
  TRACKING_PORT_NOT_FOUND: "Port information not found.",

  // WebSocket errors
  WEBSOCKET_CONNECTION_FAILED: "Failed to establish real-time connection.",
  WEBSOCKET_AUTH_FAILED: "Failed to authenticate real-time connection.",
  WEBSOCKET_SUBSCRIPTION_FAILED: "Failed to subscribe to vessel updates.",

  // Generic fallback
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
};

/**
 * Error Handler Class
 *
 * Central error handling with logging, user feedback, and recovery suggestions.
 */
export class TrackingErrorHandler {
  private static instance: TrackingErrorHandler;
  private errorLog: TrackingError[] = [];
  private maxLogSize = 100;

  static getInstance(): TrackingErrorHandler {
    if (!TrackingErrorHandler.instance) {
      TrackingErrorHandler.instance = new TrackingErrorHandler();
    }
    return TrackingErrorHandler.instance;
  }

  /**
   * Handle and categorize errors with appropriate user feedback
   */
  handleError(error: any, context?: ErrorContext): TrackingError {
    const trackingError = this.categorizeError(error, context);

    // Log the error
    this.logError(trackingError);

    // Show user feedback
    this.showUserFeedback(trackingError);

    // Report critical errors (in production, send to monitoring service)
    if (trackingError.severity === ErrorSeverity.CRITICAL) {
      this.reportCriticalError(trackingError);
    }

    return trackingError;
  }

  /**
   * Categorize and structure the error
   */
  private categorizeError(error: any, context?: ErrorContext): TrackingError {
    let category = ErrorCategory.UNKNOWN;
    let severity = ErrorSeverity.MEDIUM;
    let code = "UNKNOWN_ERROR";
    let message = error.message || "Unknown error occurred";
    let userMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
    let retryable = true;
    let action: string | undefined;

    // Network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      category = ErrorCategory.NETWORK;
      severity = ErrorSeverity.HIGH;
      code = "NETWORK_ERROR";
      userMessage = ERROR_MESSAGES.NETWORK_ERROR;
      retryable = true;
      action = "Check your internet connection and retry";
    } else if (
      error.code === "NETWORK_ERROR" ||
      error.message.includes("Network Error")
    ) {
      category = ErrorCategory.NETWORK;
      severity = ErrorSeverity.HIGH;
      code = "NETWORK_OFFLINE";
      userMessage = ERROR_MESSAGES.NETWORK_OFFLINE;
      retryable = true;
    } else if (error.name === "TimeoutError" || error.code === "TIMEOUT") {
      category = ErrorCategory.NETWORK;
      severity = ErrorSeverity.MEDIUM;
      code = "NETWORK_TIMEOUT";
      userMessage = ERROR_MESSAGES.NETWORK_TIMEOUT;
      retryable = true;
    }

    // HTTP status code errors
    else if (error.status || error.response?.status) {
      const status = error.status || error.response.status;

      if (status === 401) {
        category = ErrorCategory.AUTHENTICATION;
        severity = ErrorSeverity.HIGH;
        code = "AUTH_UNAUTHORIZED";
        userMessage = ERROR_MESSAGES.AUTH_UNAUTHORIZED;
        retryable = false;
        action = "Please log in again";
      } else if (status === 403) {
        category = ErrorCategory.AUTHENTICATION;
        severity = ErrorSeverity.HIGH;
        code = "AUTH_TOKEN_EXPIRED";
        userMessage = ERROR_MESSAGES.AUTH_TOKEN_EXPIRED;
        retryable = false;
        action = "Please refresh your session";
      } else if (status === 404) {
        category = ErrorCategory.VALIDATION;
        severity = ErrorSeverity.MEDIUM;
        code = "VALIDATION_VESSEL_NOT_FOUND";
        userMessage = context?.vesselName
          ? `Vessel "${context.vesselName}" not found`
          : ERROR_MESSAGES.VALIDATION_VESSEL_NOT_FOUND;
        retryable = false;
      } else if (status === 422) {
        category = ErrorCategory.VALIDATION;
        severity = ErrorSeverity.MEDIUM;
        code = "VALIDATION_INVALID_FORMAT";
        userMessage =
          error.response?.data?.message ||
          ERROR_MESSAGES.VALIDATION_INVALID_FORMAT;
        retryable = false;
      } else if (status === 429) {
        category = ErrorCategory.SERVER;
        severity = ErrorSeverity.MEDIUM;
        code = "SERVER_RATE_LIMITED";
        userMessage = ERROR_MESSAGES.SERVER_RATE_LIMITED;
        retryable = true;
        action = "Wait a moment before trying again";
      } else if (status >= 500) {
        category = ErrorCategory.SERVER;
        severity = ErrorSeverity.HIGH;
        code = "SERVER_INTERNAL_ERROR";
        userMessage = ERROR_MESSAGES.SERVER_INTERNAL_ERROR;
        retryable = true;
      }
    }

    // Tracking-specific errors
    else if (error.type === "TRACKING_ERROR") {
      category = ErrorCategory.TRACKING;
      severity = ErrorSeverity.MEDIUM;

      if (error.code === "VESSEL_NOT_FOUND") {
        code = "TRACKING_DATA_NOT_FOUND";
        userMessage = ERROR_MESSAGES.TRACKING_DATA_NOT_FOUND;
        retryable = false;
      } else if (error.code === "STATUS_UPDATE_FAILED") {
        code = "TRACKING_UPDATE_FAILED";
        userMessage = ERROR_MESSAGES.TRACKING_UPDATE_FAILED;
        retryable = true;
      } else if (error.code === "INVALID_STATUS") {
        code = "TRACKING_INVALID_STATUS";
        userMessage = ERROR_MESSAGES.TRACKING_INVALID_STATUS;
        retryable = false;
      }
    }

    // WebSocket errors
    else if (error.type === "WEBSOCKET_ERROR") {
      category = ErrorCategory.WEBSOCKET;
      severity = ErrorSeverity.MEDIUM;

      if (error.code === "CONNECTION_FAILED") {
        code = "WEBSOCKET_CONNECTION_FAILED";
        userMessage = ERROR_MESSAGES.WEBSOCKET_CONNECTION_FAILED;
        retryable = true;
        action = "Real-time updates will retry automatically";
      } else if (error.code === "AUTH_FAILED") {
        code = "WEBSOCKET_AUTH_FAILED";
        userMessage = ERROR_MESSAGES.WEBSOCKET_AUTH_FAILED;
        retryable = true;
      }
    }

    // Build object without including undefined optional fields to satisfy exactOptionalPropertyTypes
    const base: Omit<TrackingError, "context" | "action"> & {
      context?: Record<string, any>;
      action?: string;
    } = {
      code,
      message,
      category,
      severity,
      timestamp: new Date(),
      userMessage,
      retryable,
    };
    if (context !== undefined) {
      base.context = context;
    }
    if (action !== undefined) {
      base.action = action;
    }
    return base as TrackingError;
  }

  /**
   * Log error for debugging and analysis
   */
  private logError(error: TrackingError): void {
    // Add to in-memory log
    this.errorLog.unshift(error);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.pop();
    }

    // Console logging with appropriate level
    const logData = {
      ...error,
      context: error.context,
    };

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error("CRITICAL TRACKING ERROR:", logData);
        break;
      case ErrorSeverity.HIGH:
        console.error("TRACKING ERROR:", logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn("TRACKING WARNING:", logData);
        break;
      case ErrorSeverity.LOW:
        console.info("TRACKING INFO:", logData);
        break;
    }
  }

  /**
   * Show user-friendly feedback
   */
  private showUserFeedback(error: TrackingError): void {
    const options = {
      id: error.code, // Prevent duplicate toasts
      duration: error.severity === ErrorSeverity.HIGH ? 6000 : 4000,
    };

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        toast.error(error.userMessage, options);
        break;
      case ErrorSeverity.MEDIUM:
        toast.error(error.userMessage, options);
        break;
      case ErrorSeverity.LOW:
        toast(error.userMessage, { ...options, icon: "⚠️" });
        break;
    }

    // Show action suggestion if available
    if (error.action) {
      const actionMessage = error.action; // Preserve narrowing across async boundary
      setTimeout(() => {
        toast(actionMessage, {
          icon: "💡",
          duration: 3000,
          id: `${error.code}_action`,
        });
      }, 1000);
    }
  }

  /**
   * Report critical errors to monitoring service
   */
  private reportCriticalError(error: TrackingError): void {
    // In production, send to error monitoring service like Sentry
    console.error("CRITICAL ERROR REPORTED:", error);

    // Could integrate with services like:
    // - Sentry
    // - LogRocket
    // - Rollbar
    // - Custom error reporting API
  }

  /**
   * Get recent error log
   */
  getErrorLog(limit = 10): TrackingError[] {
    return this.errorLog.slice(0, limit);
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Check if there are recent critical errors
   */
  hasCriticalErrors(timeWindow = 5 * 60 * 1000): boolean {
    const now = new Date();
    return this.errorLog.some(
      (error) =>
        error.severity === ErrorSeverity.CRITICAL &&
        now.getTime() - error.timestamp.getTime() < timeWindow
    );
  }
}

// Convenience functions
export const errorHandler = TrackingErrorHandler.getInstance();

export const handleTrackingError = (
  error: any,
  context?: ErrorContext
): TrackingError => {
  return errorHandler.handleError(error, context);
};

export const createTrackingError = (
  code: string,
  message: string
): TrackingError => {
  const error = new Error(message);
  (error as any).type = "TRACKING_ERROR";
  (error as any).code = code;
  return errorHandler.handleError(error);
};

// Retry utility with exponential backoff
export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: any) => boolean;
}

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
  context?: ErrorContext
): Promise<T> => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = (error) => {
      const trackingError = errorHandler.handleError(error, context);
      return trackingError.retryable;
    },
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !retryCondition(error)) {
        throw error;
      }

      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export default TrackingErrorHandler;
