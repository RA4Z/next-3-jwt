import { authService } from "./authService";
import { useRouter } from 'next/router'
import React from "react";

export function withSession(funcao) {
    return async (ctx) => {
        try {
            const session = await authService.getSession(ctx)
            const modifiedCtx = {
                ...ctx,
                req: {
                    ...ctx.req,
                    session,
                }
            }
            return funcao(modifiedCtx);
        } catch (err) {
            return {
                redirect: {
                    permanent: false,
                    destination: '/?error=401',
                }
            }
        }
    }
}

export function useSession() {
    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        authService.getSession()
            .then((userSession) => {
                setSession(userSession)
            })
            .catch((err) => {
                setError(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return {
        data: { session },
        error,
        loading
    }
}

export function withSessionHOC(Component) {
    return function Wrapper(props) {
        const session = useSession();
        const router = useRouter();

        if (session.loading && session.error) {
            console.log("Redireciona o usuário para a home")
            router.push("/?error=401")
        }

        const modifiedProps = {
            ...props,
            session: session.data.session
        }
        return (
            <Component {...modifiedProps} />
        )
    }
}
