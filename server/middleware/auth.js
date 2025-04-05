/**
 * Authentication middleware
 * 
 * For the MVP, this is a simplified implementation
 * In production, this would validate JWT tokens or session cookies
 */

/**
 * Check if the request is authenticated
 */
export const authenticate = (req, res, next) => {
    // For MVP, we simply check for a custom header
    // In production, this would validate tokens
    
    if (!req.headers['x-user-role']) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    next();
  };
  
  /**
   * Check if the request is from an admin user
   */
  export const requireAdmin = (req, res, next) => {
    // First run the authenticate middleware
    authenticate(req, res, () => {
      // Then check if user is admin
      if (req.headers['x-user-role'] !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'Admin access required'
        });
      }
      
      next();
    });
  };