const jwt = require('jsonwebtoken')

const SECRET_KEY = '8a4x8sadsv4817ads874A'

const nossoToken = jwt.sign(
    {
        name: 'Robert',
    },
    SECRET_KEY,
    {
        subject: '1',
        expiresIn: '10s',
    }
)
const TOKEN_GERADO = nossoToken
 
console.log(jwt.verify(TOKEN_GERADO, SECRET_KEY))

console.log(jwt.decode(nossoToken))