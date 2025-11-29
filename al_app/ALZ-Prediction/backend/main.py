from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routers import auth, prediction, stats

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Alzheimer's Prediction API")

# CORS setup
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(prediction.router)
app.include_router(stats.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Alzheimer's Prediction API"}
