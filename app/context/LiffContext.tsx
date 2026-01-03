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
import { fetchUserData, type UserData, type UserNotFound } from "../lib/api";

interface LiffContextType {
  isInitialized: boolean;
  isLoggedIn: boolean;
  isInClient: boolean;
  profile: LiffProfile | null;
  userData: UserData | null;
  userNotFound: UserNotFound | null;
  error: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshUserData: () => Promise<void>;
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
        login,
        logout,
        refreshUserData,
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
