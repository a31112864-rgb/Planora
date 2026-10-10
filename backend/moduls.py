from pydantic import BaseModel, EmailStr

class User(BaseModel):
    username: str
    email: str
    password: str

class loginUser(BaseModel):
    email: EmailStr
    password: str