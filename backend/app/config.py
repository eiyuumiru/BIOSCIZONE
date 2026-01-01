from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    TURSO_DATABASE_URL: str
    TURSO_AUTH_TOKEN: str
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str
    # CORS: comma-separated list of allowed origins (e.g., "https://example.vercel.app,http://localhost:5173")
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

settings = Settings()
