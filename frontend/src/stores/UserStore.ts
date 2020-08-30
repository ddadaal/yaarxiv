import { useState, useCallback, useEffect } from "react";
import { changeToken } from "src/apis/fetch";
import { UserRole } from "src/models/User";
import { setCookie, parseCookies, destroyCookie } from "nookies";

const STORAGE_KEY = "User";

type Ctx = Parameters<typeof parseCookies>[0];

export function getCurrentUserInCookie(ctx?: Ctx): User | null {
  return JSON.parse(parseCookies(ctx)[STORAGE_KEY]);
}

interface User {
  userId: string;
  name: string;
  token: string;
  remember: boolean;
  role: UserRole;
}

export function getUserInfoInStorage(): User | null {
  const cookies = parseCookies();
  const data = cookies[STORAGE_KEY];
  if (data) {
    const user =  JSON.parse(data) as User;
    changeToken(user.token);
    return user;
  } else {
    return null;
  }
}

function saveUserInfo(user: User) {
  setCookie(null, STORAGE_KEY, JSON.stringify(user), { maxAge: 30 * 24 * 60 * 60 });
}

export function UserStore() {
  const [user, setUser] = useState<User | null>(null);

  const loggedIn = !!user;

  const logout = useCallback(() => {
    destroyCookie(null, STORAGE_KEY);
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
