import { User } from '../models/user.interface';

const testUser = { id: 1, firstName: 'John', lastName: 'Doe', age: 20 };

export default {
  getAllUsers: async (): Promise<User[]> => {
    // will return list of existing users from DB
    return Promise.resolve([testUser, testUser]);
  },

  getUserById: async (id: User['id']): Promise<User> => {
    // will return a user object
    return Promise.resolve(testUser);
  }
}