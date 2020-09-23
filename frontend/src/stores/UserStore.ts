import { useState, useCallback, useLayoutEffect } from "react";
import { changeToken } from "src/apis/fetch";
import { UserRole } from "src/models/User";
import { setCookie, parseCookies, destroyCookie } from "nookies";

const STORAGE_KEY = "User";
const COOKIE_PATH = "/";

type Ctx = Parameters<typeof parseCookies>[0];

export function getCurrentUserInCookie(ctx?: Ctx): User | null {
  const cookie = parseCookies(ctx)[STORAGE_KEY];
  if (cookie) {
    return JSON.parse(cookie);
  } else {
    return null;
  }
}

export interface User {
  id: string;
  email: string;
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
    return user;
  } else {
    return null;
  }
}

export function UserStore(initialUser: User | null = null) {
  const [user, setUser] = useState<User | null>(initialUser);

  const loggedIn = !!user;

  const logout = useCallback(() => {
    destroyCookie(null, STORAGE_KEY, { path: COOKIE_PATH });
    setUser(null);
    changeToken("");
  }, []);

  const login = useCallback((user: User) => {
    setUser(user);
    changeToken(user.token);
    if (user.remember) {
      setCookie(null, STORAGE_KEY, JSON.stringify(user), {
        maxAge: 30 * 24 * 60 * 60,
        path: COOKIE_PATH,
      });
    }
  }, []);

  return { loggedIn, user, logout, login };
}
