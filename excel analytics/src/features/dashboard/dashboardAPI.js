// API utility to fetch upload history for the current user
export async function fetchUploadHistory(token) {
  const res = await fetch('/api/upload/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (res.status === 401) throw new Error('Unauthorized: Please log in again.');
  if (res.status === 404) throw new Error('Upload history endpoint not found.');
  if (!res.ok) throw new Error('Failed to fetch upload history');
  return res.json();
}
