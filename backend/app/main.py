from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import public, admin
from .database import init_db
from .config import settings

app = FastAPI(title="BiosciZone API", version="1.0.0")

# CORS Configuration - origins read from environment variable
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to BiosciZone API"}

# Include routers
app.include_router(public.router, prefix="/api", tags=["Public"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

# Command to initialize DB schema
@app.post("/api/init-db", tags=["System"])
def initialize_database():
    try:
        init_db()
        return {"message": "Database tables created successfully"}
    except Exception as e:
        return {"error": str(e)}
