const user = require("../model/user");
const { query } = require('../database');

// Mocking the query 
jest.mock('../database', () => ({
  query: jest.fn(),
}));

 describe('User Module', () => {
  describe('getAdmin function', () => {
    it('should call callback with admin/event manager users', async () => {
      // Mocking the result of the query function
      const mockAdminUsers = [
        { username: 'admin1', type: 'admin' },
        { username: 'admin2', type: 'event manager' },
        // Add more objects as needed
      ];
      query.mockResolvedValueOnce(mockAdminUsers);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getAdmin function
      await user.getAdmin(callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT username, type FROM role;`);

      // Expecting the callback function to be called with null error and the list of admin/event manager users
      expect(callback).toHaveBeenCalledWith(null, mockAdminUsers);
    });

    it('should call callback with error when getting admin users fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getAdmin function
      await user.getAdmin(callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT username, type FROM role;`);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('getUserByType function', () => {
    it('should call callback with users sorted per role type', async () => {
      // Mocking the result of the query function
      const mockUsersByType = [
        { roleid: 1, username: 'user1', password: 'password1', type: 'regular' },
        { roleid: 2, username: 'user2', password: 'password2', type: 'admin' },
        // Add more objects as needed
      ];
      query.mockResolvedValueOnce(mockUsersByType);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getUserByType function
      await user.getUserByType('regular', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT roleid, username, password, type FROM announcements WHERE type = $1;`, ['regular']);

      // Expecting the callback function to be called with null error and the list of users sorted per role type
      expect(callback).toHaveBeenCalledWith(null, mockUsersByType);
    });

    it('should call callback with error when getting users by type fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getUserByType function
      await user.getUserByType('admin', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT roleid, username, password, type FROM announcements WHERE type = $1;`, ['admin']);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('deleteUser function', () => {
    it('should call callback with result when deleting a user', async () => {
      // Mocking the result of the query function
      const mockResult = { message: 'User deleted successfully' };
      query.mockResolvedValueOnce(mockResult);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the deleteUser function
      await user.deleteUser(1, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`DELETE FROM role WHERE roleid = $1;`, [1]);

      // Expecting the callback function to be called with null error and the result
      expect(callback).toHaveBeenCalledWith(null, mockResult);
    });

    it('should call callback with error when deleting a user fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the deleteUser function
      await user.deleteUser(2, callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`DELETE FROM role WHERE roleid = $1;`, [2]);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('addUser function', () => {
    it('should call callback with added user details', async () => {
      // Mocking the result of the query function
      const mockAddedUser = { userid: 1, first_name: 'John', last_name: 'Doe', company: 'ABC Inc.', uid: '123456', type: 'regular' };
      query.mockResolvedValueOnce(mockAddedUser);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addUser function
      await user.addUser('John', 'Doe', 'ABC Inc.', '123456', 'regular', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO users (first_name, last_name, company, uid, type) VALUES ($1, $2, $3, $4, $5) RETURNING*`,
        ['John', 'Doe', 'ABC Inc.', '123456', 'regular']
      );

      // Expecting the callback function to be called with null error and the added user details
      expect(callback).toHaveBeenCalledWith(null, mockAddedUser);
    });

    it('should call callback with error when adding a user fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addUser function
      await user.addUser('Jane', 'Doe', 'XYZ Corp.', '789012', 'admin', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO users (first_name, last_name, company, uid, type) VALUES ($1, $2, $3, $4, $5) RETURNING*`,
        ['Jane', 'Doe', 'XYZ Corp.', '789012', 'admin']
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('addLinkedinUser function', () => {
    it('should call callback with added user details (LinkedIn)', async () => {
      // Mocking the result of the query function
      const mockAddedLinkedinUser = { userid: 2, first_name: 'Jane', last_name: 'Doe', company: 'XYZ Corp.', linkedinurl: 'linkedin.com/janedoe', uid: '456789', type: 'admin' };
      query.mockResolvedValueOnce(mockAddedLinkedinUser);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addLinkedinUser function
      await user.addLinkedinUser('Jane', 'Doe', 'XYZ Corp.', 'linkedin.com/janedoe', '456789', 'admin', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO users (first_name, last_name, company, linkedinurl, uid, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*`,
        ['Jane', 'Doe', 'XYZ Corp.', 'linkedin.com/janedoe', '456789', 'admin']
      );

      // Expecting the callback function to be called with null error and the added user details (LinkedIn)
      expect(callback).toHaveBeenCalledWith(null, mockAddedLinkedinUser);
    });

    it('should call callback with error when adding a LinkedIn user fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addLinkedinUser function
      await user.addLinkedinUser('John', 'Doe', 'ABC Inc.', 'linkedin.com/johndoe', '123456', 'regular', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO users (first_name, last_name, company, linkedinurl, uid, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*`,
        ['John', 'Doe', 'ABC Inc.', 'linkedin.com/johndoe', '123456', 'regular']
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  // describe('getUsers function', () => {
  //   it('should call callback with all users for admin/frontend', async () => {
  //     // Mocking the result of the query function
  //     const mockAllUsers = [
  //       { first_name: 'John', last_name: 'Doe', type: 'regular' },
  //       { first_name: 'Jane', last_name: 'Doe', type: 'admin' },
  //       // Add more objects as needed
  //     ];
  //     query.mockResolvedValueOnce(mockAllUsers);

  //     // Mocking the callback function
  //     const callback = jest.fn();

  //     // Calling the getUsers function
  //     await user.getUsers(callback);

  //     // Expecting the query function to be called with the correct parameters
  //     expect(query).toHaveBeenCalledWith(`SELECT first_name , last_name , type  FROM users`);

  //     // Expecting the callback function to be called with null error and the list of all users for admin/frontend
  //     expect(callback).toHaveBeenCalledWith(null, mockAllUsers);
  //   });

  //   it('should call callback with error when getting all users fails', async () => {
  //     // Mocking an error for the query function
  //     const mockError = new Error('Database error');
  //     query.mockRejectedValueOnce(mockError);

  //     // Mocking the callback function
  //     const callback = jest.fn();

  //     // Calling the getUsers function
  //     await user.getUsers(callback);

  //     // Expecting the query function to be called with the correct parameters
  //     expect(query).toHaveBeenCalledWith(`SELECT first_name , last_name , type  FROM users`);

  //     // Expecting the callback function to be called with the error
  //     expect(callback).toHaveBeenCalledWith(mockError, null);
  //   });

  //   // Add more test cases for edge cases or specific scenarios
  // });

  // describe('getUserList function', () => {
  //   it('should call callback with all users at an event for user-facing frontend', async () => {
  //     // Mocking the result of the query function
  //     const mockUserList = [
  //       { first_name: 'John', last_name: 'Doe', company: 'ABC Inc.', linkedinurl: 'linkedin.com/johndoe', jobtitle: 'Engineer', profile_pic: 'john.jpg' },
  //       { first_name: 'Jane', last_name: 'Doe', company: 'XYZ Corp.', linkedinurl: 'linkedin.com/janedoe', jobtitle: 'Manager', profile_pic: 'jane.jpg' },
  //       // Add more objects as needed
  //     ];
  //     query.mockResolvedValueOnce(mockUserList);

  //     // Mocking the callback function
  //     const callback = jest.fn();

  //     // Calling the getUserList function
  //     await user.getUserList(callback);

  //     // Expecting the query function to be called with the correct parameters
  //     expect(query).toHaveBeenCalledWith(`SELECT first_name , last_name , company ,linkedinurl, jobtitle , profile_pic FROM users`);

  //     // Expecting the callback function to be called with null error and the list of all users at an event for user-facing frontend
  //     expect(callback).toHaveBeenCalledWith(null, mockUserList);
  //   });

  //   it('should call callback with error when getting user list fails', async () => {
  //     // Mocking an error for the query function
  //     const mockError = new Error('Database error');
  //     query.mockRejectedValueOnce(mockError);

  //     // Mocking the callback function
  //     const callback = jest.fn();

  //     // Calling the getUserList function
  //     await user.getUserList(callback);

  //     // Expecting the query function to be called with the correct parameters
  //     expect(query).toHaveBeenCalledWith(`SELECT first_name , last_name , company ,linkedinurl, jobtitle , profile_pic FROM users`);

  //     // Expecting the callback function to be called with the error
  //     expect(callback).toHaveBeenCalledWith(mockError, null);
  //   });

  //   // Add more test cases for edge cases or specific scenarios
  // });

  // describe('getUserById function', () => {
  //   it('should call callback with specific user by userid', async () => {
  //     // Mocking the result of the query function
  //     const mockUserById = { userid: 1, uid: '123456', first_name: 'John', last_name: 'Doe', company: 'ABC Inc.', linkedinurl: 'linkedin.com/johndoe', jobtitle: 'Engineer', profile_pic: 'john.jpg' };
  //     query.mockResolvedValueOnce({ rows: [mockUserById] });

  //     // Mocking the callback function
  //     const callback = jest.fn();

  //     // Calling the getUserById function
  //     await user.getUserById(1, callback);

  //     // Expecting the query function to be called with the correct parameters
  //     expect(query).toHaveBeenCalledWith(`SELECT userid, uid, first_name, last_name, company, linkedinurl, jobtitle , profile_pic FROM users WHERE userid = $1`, [1]);

  //     // Expecting the callback function to be called with null error and the specific user by userid
  //     expect(callback).toHaveBeenCalledWith(null, mockUserById);
  //   });

  //   it('should call callback with null when user is not found by userid', async () => {
  //     // Mocking the result of the query function with an empty array
  //     query.mockResolvedValueOnce({ rows: [] });

  //     // Mocking the callback function
  //     const callback = jest.fn();

  //     // Calling the getUserById function
  //     await user.getUserById(2, callback);

  //     // Expecting the query function to be called with the correct parameters
  //     expect(query).toHaveBeenCalledWith(`SELECT userid, uid, first_name, last_name, company, linkedinurl, jobtitle , profile_pic FROM users WHERE userid = $1`, [2]);

  //     // Expecting the callback function to be called with null error and null result when user is not found
  //     expect(callback).toHaveBeenCalledWith(null, null);
  //   });

  //   it('should call callback with error when getting user by userid fails', async () => {
  //     // Mocking an error for the query function
  //     const mockError = new Error('Database error');
  //     query.mockRejectedValueOnce(mockError);

  //     // Mocking the callback function
  //     const callback = jest.fn();

  //     // Calling the getUserById function
  //     await user.getUserById(3, callback);

  //     // Expecting the query function to be called with the correct parameters
  //     expect(query).toHaveBeenCalledWith(`SELECT userid, uid, first_name, last_name, company, linkedinurl, jobtitle , profile_pic FROM users WHERE userid = $1`, [3]);

  //     // Expecting the callback function to be called with the error
  //     expect(callback).toHaveBeenCalledWith(mockError, null);
  //   });

  //   // Add more test cases for edge cases or specific scenarios
  // });

  describe('getUserByUid function', () => {
    it('should call callback with specific user by linkedin userid', async () => {
      // Mocking the result of the query function
      const mockUserByUid = { userid: 4, uid: '456789', first_name: 'Jane', last_name: 'Doe', company: 'XYZ Corp.', linkedinurl: 'linkedin.com/janedoe', jobtitle: 'Manager', profile_pic: 'jane.jpg' };
      query.mockResolvedValueOnce(mockUserByUid);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getUserByUid function
      await user.getUserByUid('456789', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT userid, uid, first_name, last_name, company, linkedinurl, jobtitle , profile_pic FROM users WHERE uid = $1`, ['456789']);

      // Expecting the callback function to be called with null error and the specific user by linkedinn userid
      expect(callback).toHaveBeenCalledWith(null, mockUserByUid);
    });

    it('should call callback with null when user is not found by linkedin userid', async () => {
      // Mocking the result of the query function with an empty array
      query.mockResolvedValueOnce(null);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getUserByUid function
      await user.getUserByUid('789012', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT userid, uid, first_name, last_name, company, linkedinurl, jobtitle , profile_pic FROM users WHERE uid = $1`, ['789012']);

      // Expecting the callback function to be called with null error and null result when user is not found
      expect(callback).toHaveBeenCalledWith(null, null);
    });

    it('should call callback with error when getting user by linkedin userid fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the getUserByUid function
      await user.getUserByUid('101112', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(`SELECT userid, uid, first_name, last_name, company, linkedinurl, jobtitle , profile_pic FROM users WHERE uid = $1`, ['101112']);

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('updateUsers function', () => {
    it('should call callback with updated user details', async () => {
      // Mocking the result of the query function
      const mockUpdatedUser = { userid: 5, uid: '123456', company: 'Updated Corp.', jobtitle: 'Senior Engineer', linkedinurl: 'linkedin.com/updateduser', profile_pic: 'updated.jpg' };
      query.mockResolvedValueOnce(mockUpdatedUser);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the updateUsers function
      await user.updateUsers('123456', 'Updated Corp.', 'Senior Engineer', 'linkedin.com/updateduser', 'updated.jpg', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `UPDATE users SET company = $2, jobtitle = $3, linkedinurl = $4, profile_pic = $5 WHERE uid = $1 RETURNING *`,
        ['123456', 'Updated Corp.', 'Senior Engineer', 'linkedin.com/updateduser', 'updated.jpg']
      );

      // Expecting the callback function to be called with null error and the updated user details
      expect(callback).toHaveBeenCalledWith(null, mockUpdatedUser);
    });

    it('should call callback with error when updating user details fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the updateUsers function
      await user.updateUsers('456789', 'New Corp.', 'Manager', 'linkedin.com/newuser', 'new.jpg', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `UPDATE users SET company = $2, jobtitle = $3, linkedinurl = $4, profile_pic = $5 WHERE uid = $1 RETURNING *`,
        ['456789', 'New Corp.', 'Manager', 'linkedin.com/newuser', 'new.jpg']
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError,null);
    });

    // Add more test cases for edge cases or specific scenarios
  });

  describe('addManager function', () => {
    it('should call callback with added manager details', async () => {
      // Mocking the result of the query function
      const mockAddedManager = { roleid: 1, username: 'manager1', password: 'password123', type: 'admin' };
      query.mockResolvedValueOnce(mockAddedManager);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addManager function
      await user.addManager('manager1', 'password123', 'admin', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO role (username, password, type) VALUES ($1, $2, $3) RETURNING*`,
        ['manager1', 'password123', 'admin']
      );

      // Expecting the callback function to be called with null error and the added manager details
      expect(callback).toHaveBeenCalledWith(null,mockAddedManager);
    });

    it('should call callback with error when adding a manager fails', async () => {
      // Mocking an error for the query function
      const mockError = new Error('Database error');
      query.mockRejectedValueOnce(mockError);

      // Mocking the callback function
      const callback = jest.fn();

      // Calling the addManager function
      await user.addManager('manager2', 'password456', 'event manager', callback);

      // Expecting the query function to be called with the correct parameters
      expect(query).toHaveBeenCalledWith(
        `INSERT INTO role (username, password, type) VALUES ($1, $2, $3) RETURNING*`,
        ['manager2', 'password456', 'event manager']
      );

      // Expecting the callback function to be called with the error
      expect(callback).toHaveBeenCalledWith(mockError, null);
    });

    // Add more test cases for edge cases or specific scenarios
  });
});
