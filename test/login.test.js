const login = require('../model/login');
const { query } = require('../database');

// Mocking the query 
jest.mock('../database', () => ({
  query: jest.fn(),
}));

describe('Login Module', () => {
  describe('verify function', () => {
    it('should call callback with user details when user exists', async () => {
      // Mocking the result of the query function
      const mockUser = { username: 'testuser', role: 'admin' };
      query.mockResolvedValueOnce({ rows: [mockUser] });

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the verify function
      await login.verify('testuser', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith('select * from role where username = $1', ['testuser']);

      // Expecting the callback function to be called with null error and user details
      expect(callback).toHaveBeenCalledWith(null, mockUser);
    });

    it('should call callback with null when user does not exist', async () => {
      // Mocking the result of the query function
      query.mockResolvedValueOnce({ rows: [] });

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the verify function
      await login.verify('nonexistentuser', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith('select * from role where username = $1', ['nonexistentuser']);

      // Expecting the callback function to be called with null error and null user
      expect(callback).toHaveBeenCalledWith(null, null);
    });

    it('should call callback with error when query fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the verify function
      await login.verify('testuser', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith('select * from role where username = $1', ['testuser']);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });
  });
});