// ARQUITETURA HEXAGONAL
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
        });
}