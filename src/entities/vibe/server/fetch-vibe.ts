export const fetchVibe = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Origin: "https://vibe.naver.com",
      Referer: "https://vibe.naver.com/",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("VIBE_REQUEST_FAILED");
  }

  return response.json();
};
