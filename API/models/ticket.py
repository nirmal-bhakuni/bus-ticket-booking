from sqlalchemy import Column , Integer , String ,ForeignKey , Date , Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import date

class Ticket(Base):
    __tablename__ = "Tickets"

    id = Column(Integer , primary_key= True , index = True)
    user_id= Column(Integer , ForeignKey("users.id") , nullable = False)
    bus_id  = Column(Integer , ForeignKey("bus.id"),nullable = False)
    departure = Column(String(200) , nullable=False)
    destination = Column(String(200), nullable=False)
    travel_date = Column(Date, nullable= False)
    age = Column(Integer , nullabel = True)
    status = Column(String(20),default="Confirmed")
    created_at = Column(Date , default=date.today)
    complete = Column(Boolean ,default = False)

    user = relationship("user" , back_populates="tickets")
    bus = relationship("bus" , back_populates="tickets")
