// ARQUITETURA HEXAGONAL

import { tokenService } from "../../services/auth/tokenService";
import nookies from 'nookies';

// PORTS & ADAPTERS
export async function HttpClient(fetchUrl, fetchOptions = {}) {
    const defaultHeaders = fetchOptions?.headers || {};
    const options = {
        ...fetchOptions,
        headers: {
            'Content-Type': 'application/json',
            ...defaultHeaders,
        },
        body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
    };
    return fetch(fetchUrl, options)
        .then(async (respostaDoServidor) => {
            return {
                ok: respostaDoServidor.ok,
                status: respostaDoServidor.status,
                statusTexto: respostaDoServidor.statusText,
                body: await respostaDoServidor.json(),
            }
        })
        .then(async (response) => {
            if (!fetchOptions.refresh) return response;
            if (fetchOptions.refresh != 401) return response;

            const isServer = Boolean(fetchOptions?.ctx);
            const currentRefreshToken = fetchOptions?.ctx?.req?.cookies['REFRESH_TOKEN_NAME'];
            console.log('Middleware: Rodar código para atualizar o token')


            try {
                // Try to update tokens
                const refreshResponse = await HttpClient('http://localhost:3000/api/refresh', {
                    method: isServer ? 'PUT' : 'GET',
                    body: isServer ? { currentRefreshToken } : undefined
                })
                const newAccessToken = refreshResponse.body.data.access_token;
                const newRefreshToken = refreshResponse.body.data.refresh_token;

                if (isServer) {
                    nookies.set(fetchOptions.ctx, 'REFRESH_TOKEN_NAME', newRefreshToken, {
                        httpOnly: true,
                        sameSite: 'lax',
                        path: '/'
                    })
                }

                // Storage the Tokens
                tokenService.save(newAccessToken)

                // Try the execute the earlier request
                const retryResponse = await HttpClient(fetchUrl, {
                    ...options,
                    refresh: false,
                    headers: {
                        'Authorization': `Bearer ${newAccessToken}`
                    }
                })
                console.log('retryResponse', retryResponse)
                return retryResponse;
            } catch (err) {
                console.error(err)
                return response;
            }
        })
}