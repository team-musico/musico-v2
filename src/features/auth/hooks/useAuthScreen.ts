import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { APP_MESSAGES } from "messages/app-messages";
import { authApi } from "@/features/auth/api/auth-api";

type AuthMode = "login" | "signup";
const authMessages = APP_MESSAGES.ko.auth;

export const useAuthScreen = () => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const nextPath = useMemo(() => {
    if (typeof window === "undefined") return "/";
    const value = new URLSearchParams(window.location.search).get("next");

    return value?.startsWith("/") ? value : "/";
  }, []);

  useEffect(() => {
    const verifyStoredSession = async (token: string) => {
      const { response } = await authApi.me(token);

      if (response.ok) {
        router.replace(nextPath);
        return;
      }

      window.localStorage.removeItem("musico-access-token");
      window.localStorage.removeItem("musico-refresh-token");
    };

    const token = window.localStorage.getItem("musico-access-token");
    if (!token) return;
    verifyStoredSession(token);
  }, [nextPath, router]);

  const signInAfterSignup = async () => {
    const { response, payload } = await authApi.login(username, password);

    if (!response.ok) {
      throw new Error(payload.message ?? authMessages.loginFailed);
    }

    window.localStorage.setItem("musico-access-token", payload.accessToken);
    window.localStorage.setItem("musico-refresh-token", payload.refreshToken);
  };

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { response, payload } = mode === "signup"
        ? await authApi.signup(username, password)
        : await authApi.login(username, password);

      if (!response.ok) {
        throw new Error(payload.message ?? "Authentication failed.");
      }

      if (mode === "signup") {
        await signInAfterSignup();
        setMessage(authMessages.signupDone);
        router.replace(nextPath);
        return;
      }

      window.localStorage.setItem("musico-access-token", payload.accessToken);
      window.localStorage.setItem("musico-refresh-token", payload.refreshToken);
      setMessage(authMessages.loginDone);
      router.replace(nextPath);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : authMessages.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const toggleMode = () => {
    setMode((value) => (value === "login" ? "signup" : "login"));
  };

  return {
    handlePasswordChange,
    handleUsernameChange,
    loading,
    message,
    mode,
    password,
    submitAuth,
    toggleMode,
    username,
  };
};
