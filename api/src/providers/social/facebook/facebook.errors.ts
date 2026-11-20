import { BadRequestException } from '@nestjs/common';

/**
 * Graph API error codes that mean the stored token can no longer be used
 * and the user must reconnect the Page.
 * https://developers.facebook.com/docs/graph-api/guides/error-handling
 */
const AUTH_ERROR_CODES = new Set([102, 190]);
const AUTH_ERROR_SUBCODES = new Set([458, 459, 460, 463, 464, 467, 492]);

/** Permission errors (missing scope / page role). Reconnecting with the right grants fixes them. */
const PERMISSION_ERROR_CODES = new Set([10, 200, 210]);

/** Messenger: message sent outside of the allowed 24h standard messaging window. */
const OUTSIDE_MESSAGING_WINDOW_SUBCODES = new Set([2018278, 2018108]);

export interface GraphApiErrorBody {
  message?: string;
  type?: string;
  code?: number;
  error_subcode?: number;
  error_user_title?: string;
  error_user_msg?: string;
  fbtrace_id?: string;
}

export class FacebookGraphError extends BadRequestException {
  readonly code?: number;
  readonly subcode?: number;
  readonly fbtraceId?: string;
  readonly graphType?: string;

  constructor(error: GraphApiErrorBody | undefined, fallbackMessage: string) {
    super(FacebookGraphError.toUserMessage(error, fallbackMessage));
    this.code = error?.code;
    this.subcode = error?.error_subcode;
    this.fbtraceId = error?.fbtrace_id;
    this.graphType = error?.type;
  }

  /** Token expired / revoked / password changed — the user must reconnect. */
  get requiresReauth(): boolean {
    if (this.code !== undefined && AUTH_ERROR_CODES.has(this.code)) return true;
    return this.subcode !== undefined && AUTH_ERROR_SUBCODES.has(this.subcode);
  }

  get isPermissionError(): boolean {
    return this.code !== undefined && PERMISSION_ERROR_CODES.has(this.code) && !this.isOutsideMessagingWindow;
  }

  get isOutsideMessagingWindow(): boolean {
    return this.subcode !== undefined && OUTSIDE_MESSAGING_WINDOW_SUBCODES.has(this.subcode);
  }

  private static toUserMessage(error: GraphApiErrorBody | undefined, fallback: string): string {
    if (!error) return fallback;
    if (error.error_subcode !== undefined && OUTSIDE_MESSAGING_WINDOW_SUBCODES.has(error.error_subcode)) {
      return 'This person has not messaged your Page in the last 24 hours, so Facebook does not allow a reply right now.';
    }
    if (
      (error.code !== undefined && AUTH_ERROR_CODES.has(error.code)) ||
      (error.error_subcode !== undefined && AUTH_ERROR_SUBCODES.has(error.error_subcode))
    ) {
      return 'Your Facebook connection has expired or was revoked. Please reconnect your Facebook Page.';
    }
    return error.error_user_msg || error.message || fallback;
  }
}
