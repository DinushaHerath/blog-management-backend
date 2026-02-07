/**
 * Standardized API response helper
 */

class ApiResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Response message
   * @param {Object} data - Response data
   */
  static success(res, statusCode = 200, message = 'Success', data = null) {
    const response = {
      success: true,
      message,
      statusCode
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Error message
   * @param {Object} errors - Validation errors (optional)
   */
  static error(res, statusCode = 500, message = 'Error', errors = null) {
    const response = {
      success: false,
      message,
      statusCode
    };

    if (errors !== null) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Paginated response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Response message
   * @param {Object} data - Response data
   * @param {Object} pagination - Pagination metadata
   */
  static paginated(res, statusCode = 200, message = 'Success', data = [], pagination = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      statusCode,
      data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || 0,
        totalPages: pagination.totalPages || 0
      }
    });
  }

  /**
   * Created response (201)
   * @param {Object} res - Express response object
   * @param {String} message - Response message
   * @param {Object} data - Created resource data
   */
  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, 201, message, data);
  }

  /**
   * No content response (204)
   * @param {Object} res - Express response object
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Bad request response (400)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Object} errors - Validation errors
   */
  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, 400, message, errors);
  }

  /**
   * Unauthorized response (401)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   */
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, 401, message);
  }

  /**
   * Forbidden response (403)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   */
  static forbidden(res, message = 'Access denied') {
    return this.error(res, 403, message);
  }

  /**
   * Not found response (404)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, 404, message);
  }

  /**
   * Internal server error response (500)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   */
  static serverError(res, message = 'Internal server error') {
    return this.error(res, 500, message);
  }
}

module.exports = ApiResponse;
