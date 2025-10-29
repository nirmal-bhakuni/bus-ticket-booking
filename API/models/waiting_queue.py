from sqlalchemy import Column , String , Integer , ForeignKey , Date ,DateTime
from sqlalchemy.orm import relationship
from datetime import datetime , timezone
from database import Base

class Waitingqueue(Base):
    id = Column(Integer , primary_key=True,index = True)
    ticket_id = Column(Integer , ForeignKey("ticket.id"),nullable=False)
    bus_id = Column(Integer , ForeignKey("bus.id"), nullable = False)
    travel_date = Column(Date ,nullable=False)
    queue_at = Column(datetime ,default=lambda: datetime.now(timezone.utc))

    ticket = relationship("Ticket")
    bus = relationship("bus")