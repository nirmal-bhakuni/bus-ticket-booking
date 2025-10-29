from sqlalchemy import Column, Integer, Date, String
from database import Base

class TravelHistory(Base):
    __tablename__ = "travel_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    departure = Column(String(128), nullable=False)
    destination = Column(String(128), nullable=False)
    travel_date = Column(Date, nullable=False)