import { useState, useCallback, useEffect } from "react";
import { getApi } from "src/apis";
import { changeToken } from "src/apis/fetch";

const STORAGE_KEY = "User";

interface User {
  userId: string;
  name: string;
  token: string;
  remember: boolean;
}

export function getUserInfoInStorage(): User | null {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    const user =  JSON.parse(data) as User;
    changeToken(user.token);
    return user;
  } else {
    return null;
  }
}

function saveUserInfo(user: User) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function UserStore() {
  const [user, setUser] = useState<User | null>(null);

  const loggedIn = !!user;

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const login = useCallback((user: User) => {
    setUser(user);
    if (user.remember) {
      saveUserInfo(user);
    }
  }, []);

  useEffect(() => {
    const loggedInUser = getUserInfoInStorage();
    if (loggedInUser) {
      login(loggedInUser);
    }
  }, []);

  return { loggedIn, user, logout, login };
}
