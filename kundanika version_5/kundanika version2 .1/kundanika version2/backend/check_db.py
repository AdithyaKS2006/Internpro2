import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path

async def check_users():
    env_path = Path(__file__).parent / '.env'
    load_dotenv(env_path)
    
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print(f"Checking database: {db_name}")
    users = await db.users.find().to_list(100)
    
    print(f"Found {len(users)} users:")
    for u in users:
        print(f"- Email: {u['email']}, Role: {u['role']}, Hash Prefix: {u['password_hash'][:10]}...")

if __name__ == "__main__":
    asyncio.run(check_users())
