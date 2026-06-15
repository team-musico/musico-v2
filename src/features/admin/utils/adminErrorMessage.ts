export const adminErrorMessage = (message?: string) => {
  if (message === "ADMIN_FORBIDDEN") return "관리자 권한이 없는 계정입니다.";
  if (message === "ADMIN_PLAYLIST_MIGRATION_REQUIRED") return "관리자 플레이리스트 DB 마이그레이션을 먼저 적용해 주세요.";

  return message;
};
