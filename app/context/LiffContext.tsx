"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  initializeLiff,
  isLoggedIn,
  login,
  logout,
  getProfile,
  getAccessToken,
  isInClient,
  type LiffProfile,
} from "../lib/liff";
import { fetchUserData, updateDisplayName as apiUpdateDisplayName, type UserData, type UserNotFound } from "../lib/api";

interface LiffContextType {
  isInitialized: boolean;
  isLoggedIn: boolean;
  isInClient: boolean;
  profile: LiffProfile | null;
  userData: UserData | null;
  userNotFound: UserNotFound | null;
  error: string | null;
  isLoading: boolean;
  isUpdating: boolean;
  login: () => void;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  updateDisplayName: (newName: string) => Promise<{ success: boolean; error: string | null }>;
}

const LiffContext = createContext<LiffContextType | null>(null);

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [inClient, setInClient] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userNotFound, setUserNotFound] = useState<UserNotFound | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadUserData = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setError("No access token available");
      return;
    }

    const { data, notFound, error: fetchError } = await fetchUserData(accessToken);

    if (fetchError) {
      setError(fetchError);
    } else if (notFound) {
      setUserNotFound(notFound);
      setUserData(null);
    } else if (data) {
      setUserData(data);
      setUserNotFound(null);
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        await initializeLiff();
        setIsInitialized(true);
        setInClient(isInClient());

        if (isLoggedIn()) {
          setLoggedIn(true);
          const userProfile = await getProfile();
          setProfile(userProfile);
          await loadUserData();
        }
      } catch (err) {
        console.error("LIFF initialization failed:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize LIFF");
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [loadUserData]);

  const refreshUserData = useCallback(async () => {
    setIsLoading(true);
    await loadUserData();
    setIsLoading(false);
  }, [loadUserData]);

  const updateDisplayName = useCallback(async (newName: string): Promise<{ success: boolean; error: string | null }> => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      return { success: false, error: "No access token available" };
    }

    setIsUpdating(true);
    const { data, error: updateError } = await apiUpdateDisplayName(accessToken, newName);
    setIsUpdating(false);

    if (updateError) {
      return { success: false, error: updateError };
    }

    if (data) {
      // Update local userData with new display name
      if (userData) {
        setUserData({ ...userData, display_name: data.display_name });
      }
      return { success: true, error: null };
    }

    return { success: false, error: "Unknown error" };
  }, [userData]);

  return (
    <LiffContext.Provider
      value={{
        isInitialized,
        isLoggedIn: loggedIn,
        isInClient: inClient,
        profile,
        userData,
        userNotFound,
        error,
        isLoading,
        isUpdating,
        login,
        logout,
        refreshUserData,
        updateDisplayName,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
}

export function useLiff() {
  const context = useContext(LiffContext);
  if (!context) {
    throw new Error("useLiff must be used within a LiffProvider");
  }
  return context;
}
