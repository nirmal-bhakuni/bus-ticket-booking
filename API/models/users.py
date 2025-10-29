from sqlalchemy import Column , Integer , String
from sqlalchemy.orm import relationship
from database import Base

class user(Base):
    __tablename__ = "users"

    id = Column(Integer , primary_key=True , index = True)
    username = Column(String(50) , unique= True , nullable= False)
    email = Column(String(100) , unique= True , nullable=False)
    Password = Column(String(255) , nullable=False)

    tickets = relationship("tickets" , back_populates="user")