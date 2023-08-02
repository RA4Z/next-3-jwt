// ARQUITETURA HEXAGONAL

import { tokenService } from "../../services/auth/tokenService";

// PORTS & ADAPTERS
export async function HttpClient(fetchUrl, fetchOptions) {
    const options = {
        ...fetchOptions,
        headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
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
            if(fetchOptions.refresh != 401) return response;

            console.log('Middleware: Rodar código para atualizar o token')
            // Try to update tokens
            const refreshResponse = await HttpClient('http://localhost:3000/api/refresh', {
                method: 'GET'
            })
            const newAccessToken = refreshResponse.body.data.access_token;
            const newRefreshToken = refreshResponse.body.data.refresh_token;

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
            return retryResponse;
        })
}