import axios from "axios"

/**
 *
 * @param baseURL
 * @param headers
 * @returns
 */
export const createAxiosInstance = (headers = {}, baseURL = 'http://localhost:8000/api') => {
  /**
   * Create Axios Instance
   */

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      ...headers,
    },
  })

  axiosInstance.interceptors.response.use(response => {
    /* ------------------------------ API Call End ------------------------------ */
    return response
  })

  return axiosInstance
}
const axiosClient = createAxiosInstance()
export default axiosClient
