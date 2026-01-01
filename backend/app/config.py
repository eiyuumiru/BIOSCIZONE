from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    TURSO_DATABASE_URL: str
    TURSO_AUTH_TOKEN: str
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

settings = Settings()
