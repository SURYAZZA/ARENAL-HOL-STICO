/** Cliente del panel: un único endpoint POST que usa la cookie de sesión. */
export async function adminApi<T = unknown>(op: string, payload: Record<string, unknown> = {}): Promise<T> {
	const response = await fetch('/api/admin', {
		method: 'POST',
		credentials: 'same-origin',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ op, ...payload }),
	});
	if (!response.ok) throw new Error(`admin:${response.status}`);
	return (await response.json()) as T;
}

export async function postJson(url: string, payload: Record<string, unknown>): Promise<void> {
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});
	if (!response.ok) throw new Error(`${url}:${response.status}`);
}
