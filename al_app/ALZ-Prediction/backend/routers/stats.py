from fastapi import APIRouter
import json
import os

router = APIRouter(
    prefix="/stats",
    tags=["stats"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATS_PATH = os.path.join(BASE_DIR, 'ml', 'stats.json')

@router.get("/")
def get_stats():
    if not os.path.exists(STATS_PATH):
        return {"error": "Stats not found"}
    
    with open(STATS_PATH, 'r') as f:
        stats = json.load(f)
    return stats
