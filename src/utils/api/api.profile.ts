import { UserProfile } from "@/store/usePortfolioStore";
import axiosInstance from "../axios";

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await axiosInstance.get<UserProfile>("/profile");
    return response.data;
  } catch (error) {
    console.error("Failed to load user profile:", error);
    return null;
  }
};
