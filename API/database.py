from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+mysqlconnector://root:724463@localhost:3306/ticket"

engine = create_engine(DATABASE_URL)
Sessionlocak = sessionmaker(bind = engine , autoflush=False , autocommit = False)
Base = declarative_base()