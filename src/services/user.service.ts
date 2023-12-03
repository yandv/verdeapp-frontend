import { getAxiosInstance } from '@/utils/axios.instance';

export default class UserService {
  static async createUser(email: string, userName: string, password: string) {
    return await getAxiosInstance().post('users', { email, userName, password });
  }

  static async authUser(user: string, password: string) {
    return await getAxiosInstance().post('auth/login', { user, password });
  }

  static async getUserByJwt(jwt: string) {
    return await getAxiosInstance().get('auth/profile', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }

  static async getUsers(page: number = 1, limit: number = 10) {
    return await getAxiosInstance().get(`users?page=${page}&limit=${limit}`);
  }
}
