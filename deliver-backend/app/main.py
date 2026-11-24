import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.dependencies import make_session
from app.routes.auth_routes import auth_router
from app.routes.order_routes import order_router
from app.routes.product_routes import product_router

app = FastAPI(title="API Python com FastAPI")

# Origens locais e produção por padrão. Outras origens podem ser adicionadas
# separadas por vírgula na variável CORS_ORIGINS no Render.
default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost",
    "http://127.0.0.1",
    "https://menuu-deliver.pages.dev",
]

configured_origins = os.getenv("CORS_ORIGINS", "")
origins = list(
    dict.fromkeys(default_origins + [origin.strip() for origin in configured_origins.split(",") if origin.strip()])
)

# CONFIG CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://menuu-deliver\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# INCLUINDO ROTAS
app.include_router(auth_router)
app.include_router(order_router)
app.include_router(product_router)


# ROTA RAIZ
@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {"message": "API Python com FastAPI!"}


# HEALTHCHECK (usado pelo Railway e pelo Docker)
@app.get("/health", tags=["Infra"])
def health(session: Session = Depends(make_session)):
    try:
        session.execute(text("SELECT 1"))
    except SQLAlchemyError:
        return JSONResponse(
            status_code=503,
            content={"status": "error", "database": "unavailable"},
        )
    return {"status": "ok", "database": "ok"}
