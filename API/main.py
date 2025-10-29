from fastapi import FastAPI
import logging
logging.basicConfig(level=logging.DEBUG)

from routes import users 
from database import Base , engine

Base.metadata.create_all(bind = engine)


app = FastAPI(title="Bus Ticket Management System")

app.include_router(users.router)

@app.get("/")
def home():
    return {'message' : 'Bus ticket management system is running'}
