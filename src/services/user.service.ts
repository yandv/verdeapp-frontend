import { axiosInstance } from '@/utils/axios.instance';

export default class UserService {
  static async createUser(email: string, userName: string, password: string) {
    return await axiosInstance.post('users', { email, userName, password });
  }

  static async authUser(user: string, password: string) {
    return await axiosInstance.post('auth/login', { user, password });
  }
}
