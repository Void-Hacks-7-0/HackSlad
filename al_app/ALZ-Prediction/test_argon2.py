from passlib.context import CryptContext

try:
    pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
    hash = pwd_context.hash("test")
    print(f"Argon2 Hash success: {hash[:20]}...")
except Exception as e:
    print(f"Argon2 Error: {e}")
