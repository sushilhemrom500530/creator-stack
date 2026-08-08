export interface ParsedUserAgent {
  browser: string;
  os: string;
  device: string;
}

export class UserAgentUtil {
  static parse(userAgentString?: string): ParsedUserAgent {
    if (!userAgentString) {
      return { browser: 'Unknown', os: 'Unknown', device: 'Desktop' };
    }

    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    let device = 'Desktop';

    const ua = userAgentString.toLowerCase();

    // Device detection
    if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua)) {
      device = /ipad|tablet/i.test(ua) ? 'Tablet' : 'Mobile';
    }

    // OS detection
    if (ua.includes('win')) os = 'Windows';
    else if (ua.includes('mac')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    // Browser detection
    if (ua.includes('edg/')) browser = 'Edge';
    else if (ua.includes('chrome') && !ua.includes('chromium')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
    else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';

    return { browser, os, device };
  }
}
