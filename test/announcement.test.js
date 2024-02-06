const announcement = require('../model/announcement');
const { query } = require('../database');

// Mocking the query 
jest.mock('../database', () => ({
  query: jest.fn(),
}));

describe('Announcement Module', () => {
  describe('addAnnouncement function', () => {
    it('should call callback with result when adding announcement', async () => {
      // Mocking the result of the query function
      const mockResult = { announcementid: 1, title: 'New Announcement' };
       query.mockResolvedValueOnce(mockResult);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addAnnouncement function
      await announcement.addAnnouncement('New Announcement', 'Description', 'image.jpg', 1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO announcements ( title , description, image, eventid) VALUES ($1, $2, $3, $4) RETURNING*`,
        ['New Announcement', 'Description', 'image.jpg', 1]
      );

      // Expecting the callback function to be called with null error and the result
      expect(callback).toHaveBeenCalledWith(null, mockResult);
    });

    it('should call callback with error when adding announcement fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addAnnouncement function
      await announcement.addAnnouncement('New Announcement', 'Description', 'image.jpg', 1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO announcements ( title , description, image, eventid) VALUES ($1, $2, $3, $4) RETURNING*`,
        ['New Announcement', 'Description', 'image.jpg', 1]
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getAnnouncements function', () => {
    it('should call callback with announcements list', async () => {
      // Mocking the result of the query function
      const mockAnnouncements = [
        {
          announcementid: 1,
          eventid: 1,
          title: 'Sample Announcement 1',
          description: 'This is a sample description for the first announcement.',
          created_on: '2024-02-07 10:30:00',
          updated_on: '2024-02-07 12:45:00',
        },
        {
          announcementid: 2,
          eventid: 1,
          title: 'Sample Announcement 2',
          description: 'Another sample description for the second announcement.',
          created_on: '2024-02-06 14:20:00',
          updated_on: '2024-02-06 16:55:00',
        },
        // Add more objects as needed
      ];
      query.mockResolvedValueOnce(mockAnnouncements);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getAnnouncements function
      await announcement.getAnnouncements(callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT announcementid, eventid, title, description, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements ORDER BY updated_at DESC;`
      );

      // Expecting the callback function to be called with null error and the list of announcements
      expect(callback).toHaveBeenCalledWith(null, mockAnnouncements);
    });

    it('should call callback with error when getting announcements fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getAnnouncements function
      await announcement.getAnnouncements(callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT announcementid, eventid, title, description, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements ORDER BY updated_at DESC;`
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getAnnouncementById function', () => {
    it('should call callback with announcement details by id', async () => {
      // Mocking the result of the query function
      const mockAnnouncement = { announcementid: 1, title: 'Announcement 1' };
      query.mockResolvedValueOnce(mockAnnouncement);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getAnnouncementById function
      await announcement.getAnnouncementById(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT announcementid,eventid, title, description, image, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements WHERE announcementid = $1;`,
        [1]
      );

      // Expecting the callback function to be called with null error and the announcement details
      expect(callback).toHaveBeenCalledWith(null, mockAnnouncement);
    });

    it('should call callback with null when announcement id does not exist', async () => {
      // Mocking the result of the query function
      query.mockResolvedValueOnce(null);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getAnnouncementById function with a non-existent id
      await announcement.getAnnouncementById(999, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT announcementid,eventid, title, description, image, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements WHERE announcementid = $1;`,
        [999]
      );

      // Expecting the callback function to be called with null error and null announcement
      expect(callback).toHaveBeenCalledWith(null, null);
    });

    it('should call callback with error when getting announcement by id fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getAnnouncementById function
      await announcement.getAnnouncementById(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT announcementid,eventid, title, description, image, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements WHERE announcementid = $1;`,
        [1]
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('updateAnnouncement function', () => {
    it('should call callback with updated announcement details', async () => {
      // Mocking the result of the query function
      const mockUpdatedAnnouncement = { announcementid: 1, title: 'Updated Announcement' };
      query.mockResolvedValueOnce(mockUpdatedAnnouncement);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the updateAnnouncement function
      await announcement.updateAnnouncement(1, 'Updated Announcement', 'Updated Description', 'updated-image.jpg', 2, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `UPDATE announcements SET title = $1, description = $2, image = $3,eventid = $4 WHERE announcementid = $5 RETURNING *`,
        ['Updated Announcement', 'Updated Description', 'updated-image.jpg', 2, 1]
      );

      // Expecting the callback function to be called with null error and the updated announcement details
      expect(callback).toHaveBeenCalledWith(null, mockUpdatedAnnouncement);
    });

    it('should call callback with error when updating announcement fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the updateAnnouncement function
      await announcement.updateAnnouncement(1, 'Updated Announcement', 'Updated Description', 'updated-image.jpg', 2, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `UPDATE announcements SET title = $1, description = $2, image = $3,eventid = $4 WHERE announcementid = $5 RETURNING *`,
        ['Updated Announcement', 'Updated Description', 'updated-image.jpg', 2, 1]
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('deleteAnnouncement function', () => {
    it('should call callback with result when deleting announcement', async () => {
      // Mocking the result of the query function
      const mockResult = { message: 'Announcement deleted successfully' };
      query.mockResolvedValueOnce(mockResult);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the deleteAnnouncement function
      await announcement.deleteAnnouncement(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`DELETE FROM announcements WHERE announcementid = $1;`, [1]);

      // Expecting the callback function to be called with null error and the result
      expect(callback).toHaveBeenCalledWith(null, mockResult);
    });

    it('should call callback with error when deleting announcement fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the deleteAnnouncement function
      await announcement.deleteAnnouncement(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`DELETE FROM announcements WHERE announcementid = $1;`, [1]);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getEventList function', () => {
    it('should call callback with event list', async () => {
      // Mocking the result of the query function
      const mockEvents = [{ eventid: 1, title: 'Event 1' }, { eventid: 2, title: 'Event 2' }];
      query.mockResolvedValueOnce(mockEvents);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getEventList function
      await announcement.getEventList(callback);

      // Expecting the query function to be called
      expect(query).toHaveBeenCalledWith(`SELECT eventid, title FROM events`);

      // Expecting the callback function to be called with null error and the list of events
      expect(callback).toHaveBeenCalledWith(null, mockEvents);
    });

    it('should call callback with error when getting event list fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getEventList function
      await announcement.getEventList(callback);

      // Expecting the query function to be called
      expect(query).toHaveBeenCalledWith(`SELECT eventid, title FROM events`);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getAnnouncementsByEventId function', () => {
    it('should call callback with announcements for a specific event', async () => {
      // Mocking the result of the query function
      const mockAnnouncements = [
        { announcementid: 1, title: 'Announcement 1' },
        { announcementid: 2, title: 'Announcement 2' },
      ];
      query.mockResolvedValueOnce(mockAnnouncements);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getAnnouncementsByEventId function
      await announcement.getAnnouncementsByEventId(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT announcementid, eventid, title, description, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements WHERE eventid = $1 ORDER BY updated_at DESC;`,
        [1]
      );

      // Expecting the callback function to be called with null error and the list of announcements
      expect(callback).toHaveBeenCalledWith(null, mockAnnouncements);
    });

    it('should call callback with error when getting announcements for a specific event fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getAnnouncementsByEventId function
      await announcement.getAnnouncementsByEventId(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT announcementid, eventid, title, description, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements WHERE eventid = $1 ORDER BY updated_at DESC;`,
        [1]
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });
});
