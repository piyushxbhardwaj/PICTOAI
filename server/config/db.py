import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load env variables from .env
load_dotenv(override=True)

MONGODB_URI = os.getenv("MONGODB_URI")
db = None
client = None

try:
    if not MONGODB_URI:
        print("[WARNING] MONGODB_URI environment variable is missing from .env!")
    else:
        # Connect to MongoDB client
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=3000)
        # Verify connection
        client.admin.command('ping')
        db = client["PictoAI"]
        print("[DATABASE] Connected successfully (PyMongo)")
except Exception as e:
    print(f"[DATABASE] Connection failed: {e}")
    print("[DATABASE] Running server, but database-dependent features will be offline.")
    db = None
