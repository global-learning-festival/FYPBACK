const map = require("../model/map");
const { query } = require('../database');

// Mocking the query 
jest.mock('../database', () => ({
  query: jest.fn(),
}));

describe('Map Module', () => {
  describe('addMarker function', () => {
    it('should call callback with result when adding a marker', async () => {
      // Mocking the result of the query function
      const mockResult = { mapid: 1, location_name: 'New Marker' };
      query.mockResolvedValueOnce(mockResult);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addMarker function
      await map.addmarker('New Marker', 'Category', 'Description', '1.234,5.678', 'marker.jpg', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO marker (location_name, category, description, coordinates, image) VALUES ($1, $2, $3, $4, $5) RETURNING*`,
        ['New Marker', 'Category', 'Description', '1.234,5.678', 'marker.jpg']
      );

      // Expecting the callback function to be called with null error and the result
      expect(callback).toHaveBeenCalledWith(null, mockResult);
    });

    it('should call callback with error when adding a marker fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addMarker function
      await map.addmarker('New Marker', 'Category', 'Description', '1.234,5.678', 'marker.jpg', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO marker (location_name, category, description, coordinates, image) VALUES ($1, $2, $3, $4, $5) RETURNING*`,
        ['New Marker', 'Category', 'Description', '1.234,5.678', 'marker.jpg']
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getMarker function', () => {
    it('should call callback with marker list', async () => {
      // Mocking the result of the query function
      const mockMarkers = [
        {
          mapid: 1,
          location_name: 'Marker 1',
          category: 'Category 1',
          description: 'Description for Marker 1',
          coordinates: '1.234,5.678',
          image: 'marker1.jpg',
        },
        {
          mapid: 2,
          location_name: 'Marker 2',
          category: 'Category 2',
          description: 'Description for Marker 2',
          coordinates: '2.345,6.789',
          image: 'marker2.jpg',
        },
        // Add more objects as needed
      ];
      query.mockResolvedValueOnce(mockMarkers);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getMarker function
      await map.getmarker(callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT mapid, location_name, category, description, coordinates, image FROM marker`);

      // Expecting the callback function to be called with null error and the list of markers
      expect(callback).toHaveBeenCalledWith(null, mockMarkers);
    });

    it('should call callback with error when getting markers fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getMarker function
      await map.getmarker(callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT mapid, location_name, category, description, coordinates, image FROM marker`);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getMarkerById function', () => {
    it('should call callback with marker details by id', async () => {
      // Mocking the result of the query function
      const mockMarker = { mapid: 1, location_name: 'Marker 1' };
      query.mockResolvedValueOnce(mockMarker);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getMarkerById function
      await map.getmarkerindiv(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith('SELECT mapid, location_name, category, description, coordinates, image FROM marker where mapid = $1 ', [1]);

      // Expecting the callback function to be called with null error and the marker details
      expect(callback).toHaveBeenCalledWith(null, mockMarker);
    });

    it('should call callback with null when marker id does not exist', async () => {
      // Mocking the result of the query function
      query.mockResolvedValueOnce(null);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getMarkerById function with a non-existent id
      await map.getmarkerindiv(999, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith('SELECT mapid, location_name, category, description, coordinates, image FROM marker where mapid = $1 ', [999]);

      // Expecting the callback function to be called with null error and null marker
      expect(callback).toHaveBeenCalledWith(null, null);
    });

    it('should call callback with error when getting marker by id fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getMarkerById function
      await map.getmarkerindiv(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith('SELECT mapid, location_name, category, description, coordinates, image FROM marker where mapid = $1 ', [1]);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('updateMarker function', () => {
    it('should call callback with updated marker details', async () => {
      // Mocking the result of the query function
      const mockUpdatedMarker = { mapid: 1, location_name: 'Updated Marker' };
      query.mockResolvedValueOnce(mockUpdatedMarker);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the updateMarker function
      await map.updatemarker(1, 'Updated Marker', 'Updated Category', 'Updated Description', 'updated-marker.jpg', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        'UPDATE marker SET location_name = $2, category = $3, description = $4 , image = $5 WHERE mapid = $1 RETURNING *',
        [1, 'Updated Marker', 'Updated Category', 'Updated Description', 'updated-marker.jpg']
      );

      // Expecting the callback function to be called with null error and the updated marker details
      expect(callback).toHaveBeenCalledWith(null, mockUpdatedMarker);
    });

    it('should call callback with error when updating marker fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the updateMarker function
      await map.updatemarker(1, 'Updated Marker', 'Updated Category', 'Updated Description', 'updated-marker.jpg', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        'UPDATE marker SET location_name = $2, category = $3, description = $4 , image = $5 WHERE mapid = $1 RETURNING *',
        [1, 'Updated Marker', 'Updated Category', 'Updated Description', 'updated-marker.jpg']
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('deleteMarker function', () => {
    it('should call callback with result when deleting a marker', async () => {
      // Mocking the result of the query function
      const mockResult = { message: 'Marker deleted successfully' };
      query.mockResolvedValueOnce(mockResult);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the deleteMarker function
      await map.deletemarker(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`DELETE FROM marker WHERE mapid=$1`, [1]);

      // Expecting the callback function to be called with null error and the result
      expect(callback).toHaveBeenCalledWith(null, mockResult);
    });

    it('should call callback with error when deleting a marker fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the deleteMarker function
      await map.deletemarker(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`DELETE FROM marker WHERE mapid=$1`, [1]);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });
});
