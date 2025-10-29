from sqlalchemy import Integer,String , Column
from sqlalchemy.orm import relationship
from database import Base

class bus(Base):

    __tablename__ = "bus"
    id = Column(Integer , primary_key= True, index= True)
    Bus_name = Column(String(100),nullable=False)
    route = Column(String(200),nullable = False)
    capacity = Column(Integer , nullable = False)

    tickets= relationship("Ticket",back_populates="bus")
