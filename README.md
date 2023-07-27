# next-3-jwt

## Access Token:
- **Para que serve?**
- Pegar qualquer tipo de informação do usuário
- Atualizar ...
- Inserir ...
- Deletar ...
- **Duração**
    - Dura pouco tempo/O mínimo possível
- **Risco se ele vazar**
    - Quanto maior o tempo de vida dele, maior o estrago que quem tiver o token pode fazer
    
## Refresh Token
- **Para que serve?**
    - Literalmente, para não precisar pedir a senha e o usuário para gerar um novo access_token
- **Duração**
    - Duração dele é longa
    - O refresh token a nível de back end tá associado ao usuário de alguma forma
- **Risco se ele vazar**
    - Se ele vazar, o usuário novo pode gerar tokens INFINITO (access token, refresh token)
    - Precisa ter alguma forma de invalidar os refresh tokens