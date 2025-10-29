from fastapi import APIRouter , HTTPException , Depends, status
from sqlalchemy.orm import Session
from models import users as us
import schemas
from schemas import users
from schemas.users import UserCreate, UserResponse
from database import Sessionlocak
from utils.hash import hash_password , verify_password

router = APIRouter(prefix="/auth",tags=["authentication"])
def get_db():
    db = Sessionlocak()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup",response_model = UserResponse)
def crete_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(us.user).filter(us.user.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400 , detail = "email already registered")
    hash_pw = hash_password(user.password)    
    new_user = us.user(username = user.username , email = user.email , Password = hash_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# @router.post("/singup", response_model=schemas.users.UserResponse)
# def create_user(user: schemas.users.UserCreate, db: Session = Depends(get_db)):
#     print("Received request:", user.dict())
#     existing_user = db.query(models.users.user).filter(models.users.user.email == user.email).first()
#     if existing_user:
#         print("User already exists")
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     try:
#         hash_pw = hash_password(user.password)
#         print("Password hashed successfully:", hash_pw)
#     except Exception as e:
#         print("Error while hashing password:", e)
#         raise HTTPException(status_code=500, detail=str(e))
    
#     new_user = models.users.user(username=user.username, email=user.email, password=hash_pw)
#     try:
#         db.add(new_user)
#         db.commit()
#         db.refresh(new_user)
#         print("User created successfully:", new_user.id)
#     except Exception as e:
#         print("Database error:", e)
#         raise HTTPException(status_code=500, detail=str(e))
    
#     return new_user
