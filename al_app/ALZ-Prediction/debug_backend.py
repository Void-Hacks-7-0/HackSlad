import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    print("Importing passlib...")
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    print("Hashing password...")
    hash = pwd_context.hash("test")
    print(f"Hash success: {hash[:10]}...")
except Exception as e:
    print(f"Passlib Error: {e}")

try:
    print("Importing database...")
    from backend.database import engine, SessionLocal
    from backend import models
    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)
    print("Tables created.")
    
    print("Testing DB session...")
    db = SessionLocal()
    user = models.User(username="debug_user", hashed_password="debug_password")
    # Check if user exists to avoid unique constraint error in debug
    existing = db.query(models.User).filter(models.User.username == "debug_user").first()
    if not existing:
        db.add(user)
        db.commit()
        print("User added to DB.")
    else:
        print("Debug user already exists.")
    db.close()
except Exception as e:
    print(f"Database Error: {e}")
