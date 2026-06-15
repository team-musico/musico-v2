"use client";

import { ArrowLeft, KeyRound, Loader2, LockKeyhole, Music2, User } from "lucide-react";
import Link from "next/link";
import { APP_MESSAGES } from "messages/app-messages";
import { useAuthScreen } from "@/features/auth/hooks/useAuthScreen";

const AuthScreen = () => {
  const auth = useAuthScreen();
  const messages = APP_MESSAGES.ko.auth;
  const title = auth.mode === "login" ? messages.titleLogin : messages.titleSignup;
  const subtitle = auth.mode === "login"
    ? messages.subtitleLogin
    : messages.subtitleSignup;

  return (
    <main className="mp3-auth-stage grid min-h-screen place-items-center bg-app-bg px-4 py-8 text-mp3-text">
      <section className="mp3-auth-device w-full max-w-[430px]">
        <div className="mb-5 flex items-start justify-between gap-4 px-3 pt-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mp3-brand">musico</p>
            <h1 className="mt-1 text-3xl font-bold leading-none text-mp3-subtle">{title}</h1>
            <p className="mt-2 text-sm font-semibold text-mp3-muted">{subtitle}</p>
          </div>
          <div className="grid size-12 place-items-center rounded-full border border-mp3-border bg-white text-mp3-primary shadow-sm">
            <Music2 size={22} />
          </div>
        </div>

        <form onSubmit={auth.submitAuth} className="mp3-auth-screen-shell">
          <div className="mp3-auth-screen">
            <div className="mb-5 flex items-center justify-between border-b border-mp3-status-border px-4 py-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase text-mp3-muted">
                <LockKeyhole size={14} />
                {messages.secureAccess}
              </span>
              <span className="rounded bg-mp3-primary-soft px-2 py-1 text-[10px] font-bold uppercase text-mp3-primary">
                {auth.mode === "login" ? messages.signInBadge : messages.joinBadge}
              </span>
            </div>

            <div className="grid gap-3 px-4 pb-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase text-mp3-muted">{messages.username}</span>
                <span className="mp3-auth-field">
                  <User size={17} />
                  <input
                    value={auth.username}
                    onChange={auth.handleUsernameChange}
                    className="min-w-0 flex-1 bg-transparent font-bold text-mp3-text outline-none placeholder:text-mp3-rank"
                    placeholder={messages.usernamePlaceholder}
                  />
                </span>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase text-mp3-muted">{messages.password}</span>
                <span className="mp3-auth-field">
                  <KeyRound size={17} />
                  <input
                    value={auth.password}
                    onChange={auth.handlePasswordChange}
                    type="password"
                    className="min-w-0 flex-1 bg-transparent font-bold text-mp3-text outline-none placeholder:text-mp3-rank"
                    placeholder={messages.passwordPlaceholder}
                  />
                </span>
              </label>

              <button
                disabled={auth.loading}
                className="mp3-auth-primary-button mt-1 flex h-12 items-center justify-center gap-2 rounded-md font-bold text-white active:brightness-95 disabled:opacity-65"
              >
                {auth.loading ? <Loader2 className="animate-spin" size={18} /> : <LockKeyhole size={18} />}
                {auth.loading ? messages.pending : auth.mode === "login" ? messages.login : messages.createAccount}
              </button>

              {auth.message ? (
                <p className="rounded-md border border-mp3-border bg-mp3-surface-soft p-3 text-sm font-semibold text-mp3-system">
                  {auth.message}
                </p>
              ) : null}

              <button
                type="button"
                className="rounded-md py-2 text-sm font-bold text-mp3-primary active:bg-mp3-primary-soft"
                onClick={auth.toggleMode}
              >
                {auth.mode === "login" ? messages.noAccount : messages.hasAccount}
              </button>

              <Link className="flex items-center justify-center gap-2 rounded-md py-2 text-sm font-bold text-mp3-muted active:bg-mp3-system-soft" href="/">
                <ArrowLeft size={15} />
                {messages.backToPlayer}
              </Link>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AuthScreen;
