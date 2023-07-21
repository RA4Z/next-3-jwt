import { tokenService } from "../src/services/auth/tokenService"
import nookies from 'nookies'

export default function AuthPageSSR(props) {
    console.log(tokenService.get())
    return (
        <div>
            <h1>
                Auth Page Server Side Render
            </h1>
            <pre>
                {JSON.stringify(props, null, 2)}
            </pre>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    console.log()
    const cookies = nookies.get(ctx)
    console.log('cookies', cookies)
    return {
        props: {
            token: tokenService.get(ctx)
        },
    }
}