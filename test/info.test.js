const importantInformation = require("../model/importantInfo");
const { query } = require('../database');

// Mocking the query 
jest.mock('../database', () => ({
  query: jest.fn(),
}));

describe('ImportantInformation Module', () => {
  describe('addImportantInformation function', () => {
    it('should call callback with result when adding important information', async () => {
      // Mocking the result of the query function
      const mockResult = { infoid: 1, title: 'New Information' };
      query.mockResolvedValueOnce(mockResult);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addImportantInformation function
      await importantInformation.addImportantInfomation('New Information', 'Subtitle', 'Description', 'image.jpg', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO importantinfo (title, subtitle, description, image) VALUES ($1, $2, $3, $4) RETURNING*`,
        ['New Information', 'Subtitle', 'Description', 'image.jpg']
      );

      // Expecting the callback function to be called with null error and the result
      expect(callback).toHaveBeenCalledWith(null, mockResult);
    });

    it('should call callback with error when adding important information fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addImportantInformation function
      await importantInformation.addImportantInfomation('New Information', 'Subtitle', 'Description', 'image.jpg', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO importantinfo (title, subtitle, description, image) VALUES ($1, $2, $3, $4) RETURNING*`,
        ['New Information', 'Subtitle', 'Description', 'image.jpg']
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getImportantInformation function', () => {
    it('should call callback with important information list', async () => {
      // Mocking the result of the query function
      const mockInformation = [
        {
          infoid: 1,
          title: 'Sample Information 1',
          subtitle: 'Subtitle 1',
          description: 'This is a sample description for the first information.',
          image: 'image1.jpg',
        },
        {
          infoid: 2,
          title: 'Sample Information 2',
          subtitle: 'Subtitle 2',
          description: 'Another sample description for the second information.',
          image: 'image2.jpg',
        },
        // Add more objects as needed
      ];
      query.mockResolvedValueOnce(mockInformation);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getImportantInformation function
      await importantInformation.getImportantInfomation(callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT infoid, title, subtitle, description, image FROM importantinfo`);

      // Expecting the callback function to be called with null error and the list of information
      expect(callback).toHaveBeenCalledWith(null, mockInformation);
    });

    it('should call callback with error when getting important information fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getImportantInformation function
      await importantInformation.getImportantInfomation(callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT infoid, title, subtitle, description, image FROM importantinfo`);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getImportantInformationById function', () => {
    it('should call callback with important information details by id', async () => {
      // Mocking the result of the query function
      const mockInformation = { infoid: 1, title: 'Information 1' };
      query.mockResolvedValueOnce(mockInformation);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getImportantInformationById function
      await importantInformation.getImportantInformationById(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith('SELECT * FROM importantinfo WHERE infoid = $1', [1]);

      // Expecting the callback function to be called with null error and the information details
      expect(callback).toHaveBeenCalledWith(null, mockInformation);
    });

    it('should call callback with null when information id does not exist', async () => {
      // Mocking the result of the query function
      query.mockResolvedValueOnce(null);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getImportantInformationById function with a non-existent id
      await importantInformation.getImportantInformationById(999, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith('SELECT * FROM importantinfo WHERE infoid = $1', [999]);

      // Expecting the callback function to be called with null error and null information
      expect(callback).toHaveBeenCalledWith(null, null);
    });

    it('should call callback with error when getting information by id fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getImportantInformationById function
      await importantInformation.getImportantInformationById(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith('SELECT * FROM importantinfo WHERE infoid = $1', [1]);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('updateImportantInformation function', () => {
    it('should call callback with updated information details', async () => {
      // Mocking the result of the query function
      const mockUpdatedInformation = { infoid: 1, title: 'Updated Information' };
      query.mockResolvedValueOnce(mockUpdatedInformation);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the updateImportantInformation function
      await importantInformation.updateImportantInformation(1, 'Updated Information', 'Updated Subtitle', 'Updated Description', 'updated-image.jpg', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        'UPDATE importantinfo SET title = $2, subtitle = $3, description = $4, image = $5 WHERE infoid = $1 RETURNING *',
        [1, 'Updated Information', 'Updated Subtitle', 'Updated Description', 'updated-image.jpg']
      );

      // Expecting the callback function to be called with null error and the updated information details
      expect(callback).toHaveBeenCalledWith(null, mockUpdatedInformation);
    });

    it('should call callback with error when updating information fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the updateImportantInformation function
      await importantInformation.updateImportantInformation(1, 'Updated Information', 'Updated Subtitle', 'Updated Description', 'updated-image.jpg', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        'UPDATE importantinfo SET title = $2, subtitle = $3, description = $4, image = $5 WHERE infoid = $1 RETURNING *',
        [1, 'Updated Information', 'Updated Subtitle', 'Updated Description', 'updated-image.jpg']
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('deleteImportantInformation function', () => {
    it('should call callback with result when deleting important information', async () => {
      // Mocking the result of the query function
      const mockResult = { message: 'Information deleted successfully' };
      query.mockResolvedValueOnce(mockResult);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the deleteImportantInformation function
      await importantInformation.deleteImportantInformation(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`DELETE FROM importantinfo WHERE infoid=$1`, [1]);

      // Expecting the callback function to be called with null error and the result
      expect(callback).toHaveBeenCalledWith(null, mockResult);
    });

    it('should call callback with error when deleting information fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the deleteImportantInformation function
      await importantInformation.deleteImportantInformation(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`DELETE FROM importantinfo WHERE infoid=$1`, [1]);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });
});
