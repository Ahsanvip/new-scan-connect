import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create Neon serverless SQL client
export const sql = neon(process.env.DATABASE_URL);

// Database utility functions
export const db = {
  /**
   * Check if an activation code exists and get its status
   */
  async getCodeStatus(code: string) {
    const result = await sql`
      SELECT code, used, is_active 
      FROM activation_codes 
      WHERE code = ${code}
    `;
    return result[0] || null;
  },

  /**
   * Get vehicle information by activation code
   */
  async getVehicleByCode(code: string) {
    const result = await sql`
      SELECT v.id, v.whatsapp, v.owner_name, v.car_model, v.car_registration, v.city
      FROM vehicles v
      WHERE v.activation_code = ${code}
    `;
    return result[0] || null;
  },

  /**
   * Activate a code and create vehicle record
   */
  async activateCode(codeStr: string, vehicleData: {
    whatsapp: string;
    ownerName: string;
    address?: string;
    carRegistration: string;
    carModel: string;
    city: string;
  }) {
    try {
      // Start transaction-like operations
      // First, update the activation code
      await sql`
        UPDATE activation_codes 
        SET used = true, is_active = true 
        WHERE code = ${codeStr} AND used = false
      `;

      // Then create the vehicle record
      const result = await sql`
        INSERT INTO vehicles (
          whatsapp, owner_name, address, car_registration, 
          car_model, city, activation_code
        )
        VALUES (
          ${vehicleData.whatsapp},
          ${vehicleData.ownerName},
          ${vehicleData.address || null},
          ${vehicleData.carRegistration},
          ${vehicleData.carModel},
          ${vehicleData.city},
          ${codeStr}
        )
        RETURNING id
      `;

      return { success: true, vehicleId: result[0].id };
    } catch (error) {
      console.error('Error activating code:', error);
      return { success: false, error: 'Failed to activate code' };
    }
  },

  /**
   * Log a notification
   */
  async logNotification(vehicleId: string, method: string, reason: string, coords?: string) {
    try {
      await sql`
        INSERT INTO notifications (vehicle_id, method, reason, scanner_coords)
        VALUES (${vehicleId}, ${method}, ${reason}, ${coords || null})
      `;
      return { success: true };
    } catch (error) {
      console.error('Error logging notification:', error);
      return { success: false };
    }
  },

  /**
   * Check and update rate limit for an IP
   */
  async checkRateLimit(ipAddress: string, maxRequests: number = 5, windowMs: number = 900000) {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);

    try {
      // Get current rate limit record
      const existing = await sql`
        SELECT request_count, window_start 
        FROM rate_limits 
        WHERE ip_address = ${ipAddress}
      `;

      if (existing.length === 0) {
        // Create new rate limit record
        await sql`
          INSERT INTO rate_limits (ip_address, request_count, window_start)
          VALUES (${ipAddress}, 1, ${now.toISOString()})
        `;
        return { allowed: true, remaining: maxRequests - 1 };
      }

      const record = existing[0];
      const recordWindowStart = new Date(record.window_start);

      if (recordWindowStart < windowStart) {
        // Window expired, reset
        await sql`
          UPDATE rate_limits 
          SET request_count = 1, window_start = ${now.toISOString()}
          WHERE ip_address = ${ipAddress}
        `;
        return { allowed: true, remaining: maxRequests - 1 };
      }

      if (record.request_count >= maxRequests) {
        // Rate limit exceeded
        return { allowed: false, remaining: 0 };
      }

      // Increment count
      await sql`
        UPDATE rate_limits 
        SET request_count = request_count + 1 
        WHERE ip_address = ${ipAddress}
      `;
      return { allowed: true, remaining: maxRequests - record.request_count - 1 };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      // Fail open to prevent blocking in case of database issues
      return { allowed: true, remaining: maxRequests };
    }
  },
};
