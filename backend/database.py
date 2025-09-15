# backend/database.py

from pymongo import MongoClient
from pymongo.database import Database

# --- MongoDB Connection ---
# Replace with your MongoDB connection string.
# For local MongoDB: "mongodb://localhost:27017/"
# For Atlas: "mongodb+srv://<user>:<password>@<cluster-url>/"
MONGO_DATABASE_URL = "mongodb+srv://r4-rahul123:r4rahul123@cluster05.fawchhh.mongodb.net/?retryWrites=true&w=majority"
DATABASE_NAME = "resume_parser"

class MongoDB:
    def __init__(self, db_url: str, db_name: str):
        self.client = MongoClient(db_url)
        self.db = self.client[db_name]

    def get_db(self) -> Database:
        return self.db

    def close(self):
        self.client.close()

# Create a single instance of the MongoDB connection
mongodb = MongoDB(MONGO_DATABASE_URL, DATABASE_NAME)

# Dependency function to get the database session
def get_mongo_db() -> Database:
    """
    FastAPI dependency that provides a MongoDB database instance.
    """
    return mongodb.get_db()

# Optional: Add shutdown event in main.py to close connection gracefully
def close_mongo_connection():
    mongodb.close()