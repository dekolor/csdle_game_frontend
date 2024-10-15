// app/api/fetchProfile.ts
export async function fetchProfile(): Promise<string> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return data;
}
