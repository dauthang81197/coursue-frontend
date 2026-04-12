import apiClient from "./client";

export const mediaApi = {
  /**
   * Fetch a media asset as an authenticated blob and return a local object URL.
   * The caller is responsible for revoking the URL with URL.revokeObjectURL().
   */
  getStreamUrl: async (mediaId: string): Promise<string> => {
    const response = await apiClient.get(`/media/${mediaId}/stream`, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  },
};
