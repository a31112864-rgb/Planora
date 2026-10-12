from pydantic import BaseModel, EmailStr

class User(BaseModel):
    username: str
    email: str
    password: str

class loginUser(BaseModel):
    email: EmailStr
    password: str

class Projects(BaseModel):
    name: str

class Tasks(BaseModel):
    name: str
    project_id: int
    project_name: str
    status: str
    due_date: str
