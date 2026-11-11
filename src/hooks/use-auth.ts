import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '@/lib/admin-api';

/**
 * Estado de la sesión del panel: isAuthed, isLoading, login, logout.
 * La sesión vive en una cookie HttpOnly; se consulta al montar.
 */
export function useAuth() {
	const [isAuthed, setIsAuthed] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		adminApi<{ authed: boolean }>('session')
			.then(result => setIsAuthed(result.authed))
			.catch(() => setIsAuthed(false))
			.finally(() => setIsLoading(false));
	}, []);

	return useMemo(
		() => ({
			isAuthed,
			isLoading,
			login: async (email: string, password: string) => {
				await adminApi('login', { email, password });
				setIsAuthed(true);
			},
			logout: async () => {
				await adminApi('logout');
				setIsAuthed(false);
				window.location.assign('/entrar');
			},
		}),
		[isAuthed, isLoading],
	);
}

export default useAuth;
