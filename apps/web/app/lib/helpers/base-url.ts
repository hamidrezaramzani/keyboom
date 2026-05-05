export const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  const hostname = window.location.hostname;

  if (hostname !== "localhost" && !hostname.includes("127.0.0.1")) {
    return `http://${hostname}:3001`;
  }

  return process.env.NEXT_PUBLIC_API_URL;
};
