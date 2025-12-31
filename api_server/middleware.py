from fastapi import Request
from fastapi.responses import JSONResponse
from auth import decode_access_token

EXCLUDED_PREFIXES = (
    "/login",
    "/signup",
    "/docs",
    "/openapi.json",
)


async def auth_middleware(request: Request, call_next):
    # Allow CORS preflight
    if request.method == "OPTIONS":
        return await call_next(request)

    if request.url.path.startswith((
        "/login",
        "/signup",
        "/docs",
        "/openapi.json",
        "/risk",

    )):
        return await call_next(request)

    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"detail": "Missing Authorization header"})

    token = auth_header.split(" ")[1]
    payload = decode_access_token(token)

    if not payload:
        return JSONResponse(status_code=401, content={"detail": "Invalid or expired token"})

    request.state.user = payload
    return await call_next(request)
