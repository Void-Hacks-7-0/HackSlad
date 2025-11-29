import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    print("Importing passlib...")
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
    print("Hashing password...")
    hash = pwd_context.hash("test")
    print(f"Hash success: {hash[:20]}...")
    
    print("Verifying password...")
    verify = pwd_context.verify("test", hash)
    print(f"Verify success: {verify}")
except Exception as e:
    print(f"Passlib Error: {e}")
