const events = require('../model/events');
const { query } = require('../database');

// Mocking the query 
jest.mock('../database', () => ({
  query: jest.fn(),
}));

describe('Events Module', () => {
  describe('addEvent function', () => {
    it('should call callback with result when adding event', async () => {
      // Mocking the result of the query function
      const mockResult = { eventid: 1, title: 'New Event' };
      query.mockResolvedValueOnce(mockResult);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addEvent function
      await events.addEvent(
        'New Event',
        'banner.jpg',
        '2024-02-07T10:00',
        '2024-02-07T12:00',
        'Location',
        'Speaker',
        'Description',
        'survey-link',
        callback
      );

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `
                INSERT INTO events (title, image_banner, time_start, time_end, location, keynote_speaker, description, survey_link)
                VALUES ($1, $2,TO_TIMESTAMP($3, 'YYYY-MM-DD HH24:MI:SS'),
                TO_TIMESTAMP($4, 'YYYY-MM-DD HH24:MI:SS') , $5, $6, $7, $8)
                RETURNING *
            `,
        [
          'New Event',
          'banner.jpg',
          "2024-02-07 02:00:0",
          "2024-02-07 04:00:0",
          'Location',
          'Speaker',
          'Description',
          'survey-link',
        ]
      );

      // Expecting the callback function to be called with null error and the result
      expect(callback).toHaveBeenCalledWith(null, mockResult);
    });

    it('should call callback with error when adding event fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addEvent function
      await events.addEvent(
        'New Event',
        'banner.jpg',
        '2024-02-07T10:00',
        '2024-02-07T12:00',
        'Location',
        'Speaker',
        'Description',
        'survey-link',
        callback
      );

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `
                INSERT INTO events (title, image_banner, time_start, time_end, location, keynote_speaker, description, survey_link)
                VALUES ($1, $2,TO_TIMESTAMP($3, 'YYYY-MM-DD HH24:MI:SS'),
                TO_TIMESTAMP($4, 'YYYY-MM-DD HH24:MI:SS') , $5, $6, $7, $8)
                RETURNING *
            `,
        [
          'New Event',
          'banner.jpg',
          "2024-02-07 02:00:0",
          "2024-02-07 04:00:0",
          'Location',
          'Speaker',
          'Description',
          'survey-link',
        ]
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getEvents function', () => {
    it('should call callback with events list', async () => {
      // Mocking the result of the query function
      const mockEvents = [
        {
          eventid: 1,
          title: 'Sample Event 1',
          image_banner: 'banner1.jpg',
          time_start: '2024-02-07 10:00:00',
          time_end: '2024-02-07 12:00:00',
          location: 'Location 1',
          keynote_speaker: 'Speaker 1',
          description: 'This is a sample description for the first event.',
          survey_link: 'survey-link1',
        },
        {
          eventid: 2,
          title: 'Sample Event 2',
          image_banner: 'banner2.jpg',
          time_start: '2024-02-06 14:00:00',
          time_end: '2024-02-06 16:00:00',
          location: 'Location 2',
          keynote_speaker: 'Speaker 2',
          description: 'Another sample description for the second event.',
          survey_link: 'survey-link2',
        },
        // Add more objects as needed
      ];
      query.mockResolvedValueOnce(mockEvents);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getEvents function
      await events.getEvents(callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT eventid, title, image_banner,
                        TO_CHAR(time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start",
                        TO_CHAR(time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end",
                        location, keynote_speaker, description, survey_link
                            FROM events ORDER BY time_start ASC;`
      );

      // Expecting the callback function to be called with null error and the list of events
      expect(callback).toHaveBeenCalledWith(null, mockEvents);
    });

    it('should call callback with error when getting events fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getEvents function
      await events.getEvents(callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT eventid, title, image_banner,
                        TO_CHAR(time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start",
                        TO_CHAR(time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end",
                        location, keynote_speaker, description, survey_link
                            FROM events ORDER BY time_start ASC;`
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getEventById function', () => {
    it('should call callback with event details by id', async () => {
      // Mocking the result of the query function
      const mockEvent = {
        eventid: 1,
        title: 'Event 1',
        image_banner: 'banner.jpg',
        time_start: '2024-02-07 10:00:00',
        time_end: '2024-02-07 12:00:00',
        location: 'Location 1',
        keynote_speaker: 'Speaker 1',
        description: 'This is a sample description for the event.',
        survey_link: 'survey-link',
      };
      query.mockResolvedValueOnce(mockEvent);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getEventById function
      await events.getEventbyId(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT eventid, title, image_banner,
       TO_CHAR(time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start",
       TO_CHAR(time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end",
       location, keynote_speaker, description, survey_link
       FROM events WHERE eventid = $1`,[1]
      );

      // Expecting the callback function to be called with null error and the event details
      expect(callback).toHaveBeenCalledWith(null, mockEvent);
    });

    it('should call callback with error when getting event by id fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getEventById function
      await events.getEventbyId(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT eventid, title, image_banner,
       TO_CHAR(time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start",
       TO_CHAR(time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end",
       location, keynote_speaker, description, survey_link
       FROM events WHERE eventid = $1`,[1]
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('updateEvent function', () => {
    it('should call callback with updated event details', async () => {
      // Mocking the result of the query function
      const mockUpdatedEvent = {
        eventid: 1,
        title: 'Updated Event',
        image_banner: 'new-banner.jpg',
        time_start: '2024-02-07 14:00:00',
        time_end: '2024-02-07 16:00:00',
        location: 'New Location',
        keynote_speaker: 'New Speaker',
        description: 'Updated description for the event.',
        survey_link: 'new-survey-link',
      };
      query.mockResolvedValueOnce(mockUpdatedEvent);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the updateEvent function
      await events.updateEvent(
        1,
        'Updated Event',
        'new-banner.jpg',
        '2024-02-07T14:00',
        '2024-02-07T16:00',
        'New Location',
        'New Speaker',
        'Updated description for the event.',
        'new-survey-link',
        callback
      );

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        "UPDATE events SET title = $2, image_banner = $3, time_start = TO_TIMESTAMP($4, 'YYYY-MM-DD HH24:MI:SS'), time_end = TO_TIMESTAMP($5, 'YYYY-MM-DD HH24:MI:SS') , location = $6, keynote_speaker = $7, description = $8, survey_link = $9 WHERE eventid = $1 RETURNING *",

        [
          1,
          'Updated Event',
          'new-banner.jpg',
          "2024-02-07 06:00:0",
          "2024-02-07 08:00:0",
          'New Location',
          'New Speaker',
          'Updated description for the event.',
          'new-survey-link',
        ]
      );

      // Expecting the callback function to be called with null error and the updated event details
      expect(callback).toHaveBeenCalledWith(null, mockUpdatedEvent);
    });

    it('should call callback with error when updating event fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the updateEvent function
      await events.updateEvent(
        1,
        'Updated Event',
        'new-banner.jpg',
        '2024-02-07T14:00',
        '2024-02-07T16:00',
        'New Location',
        'New Speaker',
        'Updated description for the event.',
        'new-survey-link',
        callback
      );

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `UPDATE events SET title = $2, image_banner = $3, time_start = TO_TIMESTAMP($4, 'YYYY-MM-DD HH24:MI:SS'), time_end = TO_TIMESTAMP($5, 'YYYY-MM-DD HH24:MI:SS') , location = $6, keynote_speaker = $7, description = $8, survey_link = $9 WHERE eventid = $1 RETURNING *`,

        [
          1,
          'Updated Event',
          'new-banner.jpg',
          "2024-02-07 06:00:0",
          "2024-02-07 08:00:0",
          'New Location',
          'New Speaker',
          'Updated description for the event.',
          'new-survey-link',
        ]
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('deleteEvent function', () => {
    it('should call callback with success message after deleting event', async () => {
      // Mocking the result of the query function
      const mockResult = { message: 'Event deleted successfully.' };
      query.mockResolvedValueOnce(mockResult);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the deleteEvent function
      await events.deleteEvent(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `DELETE FROM events WHERE eventid = $1`,
        [1]
      );

      // Expecting the callback function to be called with null error and the success message
      expect(callback).toHaveBeenCalledWith(null, mockResult);
    });

    it('should call callback with error when deleting event fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the deleteEvent function
      await events.deleteEvent(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `DELETE FROM events WHERE eventid = $1`,
        [1]
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });
  describe('saveEvent function', () => {
    it('should call callback with saved event details', async () => {
      // Mocking the result of the query function
      const mockSavedEvent = {
        savedid: 1,
        uid: 123,
        eventid: 1,
      };
      query.mockResolvedValueOnce(mockSavedEvent);
  
      // Mocking the callback function
      const callback = jest.fn();
  
      // Calling the saveEvent function
      await events.savevents(123, 1, callback);
  
      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO savedevent (uid, eventid) VALUES ($1, $2) RETURNING *`,
        [123, 1]
      );
  
      // Expecting the callback function to be called with null error and the saved event details
      expect(callback).toHaveBeenCalledWith(null, mockSavedEvent);
    });
  
    it('should call callback with error when saving event fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);
  
      // Mocking the callback function
      const callback = jest.fn();
  
      // Calling the saveEvent function
      await events.savevents(123, 1, callback);
  
      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO savedevent (uid, eventid) VALUES ($1, $2) RETURNING *`,
        [123, 1]
      );
  
      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });
  
    // Add more test cases for edge cases or specific scenarios
  });
  describe('getUserSavedEvents function', () => {
    it('should call callback with user\'s saved events', async () => {
      // Mocking the result of the query function
      const mockUserSavedEvents = [
        {
          eventid: 1,
          title: 'Saved Event 1',
          image_banner: 'url_to_image',
          time_start: '2024-02-07 10:00:00',
          time_end: '2024-02-07 15:00:00',
          location: 'Event Location',
          keynote_speaker: 'John Doe',
          description: 'Description of the event',
          survey_link: 'survey_link_here',
          // ... (add other properties)
        },
        {
          eventid: 2,
          title: 'Saved Event 2',
          image_banner: 'url_to_image',
          time_start: '2024-02-08 12:00:00',
          time_end: '2024-02-08 17:00:00',
          location: 'Another Location',
          keynote_speaker: 'Jane Doe',
          description: 'Description of another event',
          survey_link: 'another_survey_link_here',
          // ... (add other properties)
        },
        // Add more objects as needed
      ];
      query.mockResolvedValueOnce(mockUserSavedEvents);
  
      // Mocking the callback function
      const callback = jest.fn();
  
      // Calling the getUserSavedEvents function
      await events.getusersave(123, callback);
  
      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT e.eventid, e.title, e.image_banner, TO_CHAR(e.time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start", TO_CHAR(e.time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end", e.location, e.keynote_speaker, e.description, e.survey_link FROM events e JOIN savedevent s ON e.eventid = s.eventid WHERE s.uid = $1; `,
        [123]
      );
  
      // Expecting the callback function to be called with null error and the list of saved events
      expect(callback).toHaveBeenCalledWith(null, mockUserSavedEvents);
    });
  
    it('should call callback with error when getting user\'s saved events fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);
  
      // Mocking the callback function
      const callback = jest.fn();
  
      // Calling the getUserSavedEvents function
      await events.getusersave(123, callback);
  
      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT e.eventid, e.title, e.image_banner, TO_CHAR(e.time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start", TO_CHAR(e.time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end", e.location, e.keynote_speaker, e.description, e.survey_link FROM events e JOIN savedevent s ON e.eventid = s.eventid WHERE s.uid = $1; `,

        [123]
      );
  
      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });
  
    // Add more test cases for edge cases or specific scenarios
  });
  
  describe('deleteSavedEvent function', () => {
    it('should call callback with result when deleting saved event', async () => {
      // Mocking the result of the query function
      const mockResult = { message: 'Saved event deleted successfully' };
      query.mockResolvedValueOnce(mockResult);
  
      // Mocking the callback function
      const callback = jest.fn();
  
      // Calling the deleteSavedEvent function
      await events.deletesaveEvent(1, 123, callback);
  
      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `DELETE FROM savedevent WHERE eventid = $1 AND uid = $2`,
        [1, 123]
      );
  
      // Expecting the callback function to be called with null error and the result
      expect(callback).toHaveBeenCalledWith(null, mockResult);
    });
  
    it('should call callback with error when deleting saved event fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);
  
      // Mocking the callback function
      const callback = jest.fn();
  
      // Calling the deleteSavedEvent function
      await events.deletesaveEvent(1, 123, callback);
  
      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `DELETE FROM savedevent WHERE eventid = $1 AND uid = $2`,
        [1, 123]
      );
  
      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });
  
    // Add more test cases for edge cases or specific scenarios
  });
  
  describe('getMostSavedEvent function', () => {
    it('should call callback with the most saved event', async () => {
      // Mocking the result of the query function
      const mockMostSavedEvent = {
        eventid: 1,
        title: 'Most Saved Event',
        image_banner: 'url_to_image',
        time_start: '2024-02-09 08:00:00',
        time_end: '2024-02-09 14:00:00',
        location: 'Top Location',
        keynote_speaker: 'Key Speaker',
        description: 'Description of the most saved event',
        survey_link: 'most_saved_survey_link_here',
        // ... (add other properties)
      };
      query.mockResolvedValueOnce(mockMostSavedEvent);
  
      // Mocking the callback function
      const callback = jest.fn();
  
      // Calling the getMostSavedEvent function
      await events.getmostsavedEvent(callback);
  
      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT e.eventid, e.title, COUNT(s.savedid) as savedCount FROM events e JOIN savedevent s ON e.eventid = s.eventid GROUP BY e.eventid ORDER BY savedCount DESC LIMIT 1;`
      );
  
      // Expecting the callback function to be called with null error and the most saved event
      expect(callback).toHaveBeenCalledWith(null, mockMostSavedEvent);
    });
  
    it('should call callback with error when getting most saved event fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);
  
      // Mocking the callback function
      const callback = jest.fn();
  
      // Calling the getMostSavedEvent function
      await events.getmostsavedEvent(callback);
  
      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `SELECT e.eventid, e.title, COUNT(s.savedid) as savedCount FROM events e JOIN savedevent s ON e.eventid = s.eventid GROUP BY e.eventid ORDER BY savedCount DESC LIMIT 1;`
      );
  
      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });
  
    // Add more test cases for edge cases or specific scenarios
  });
  

  // Add more describe blocks for other functions in events.js
});

