from fastapi import FastAPI, Depends, Cookie, Response
from database import engine, session
import database_moduls
from sqlalchemy.orm import Session
from moduls import User
from security import hash_password, verify_password
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database_moduls.Base.metadata.create_all(engine)

def init_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

@app.get("/user")
def get_user(id: str | None = Cookie(default=None),db: Session = Depends(init_db)):
    user = db.query(database_moduls.Db_user).filter(database_moduls.Db_user.id==id).first()
    if user:
        return user
    return "user not found"

@app.post("/user")
def create_user(user: User, db: Session = Depends(init_db)):
    hashed_password = hash_password(user.password)

    db_user = database_moduls.Db_user(
        username = user.username,
        email = user.email,
        password = hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return f"sucessfully add user. User id is {db_user.id}"


@app.put("/user")
def update_user(
    user: User,
    id: str | None = Cookie(default=None),
    db: Session = Depends(init_db)
):
    old_user = db.query(database_moduls.Db_user).filter(database_moduls.Db_user.id==id).first()
    if old_user:
        old_user.username = user.username
        old_user.email = user.email
        old_user.password = user.password
        db.commit()
        return "user updated"
    return "user not found"

@app.delete("/user")
def delete_user(id: str | None = Cookie(default=None), db: Session = Depends(init_db)):
    db_user = db.query(database_moduls.Db_user).filter(database_moduls.Db_user.id==id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return "user deleted sucessfully"
    return "user not found"

@app.post("/login_user")
def login_user(email: str,password: str, response: Response, db: Session = Depends(init_db)):
    user = db.query(database_moduls.Db_user).filter(database_moduls.Db_user.email == email).first()
    if not user:
        return {"error": "Invalid email or password"}

    if verify_password(password, user.password):
        response.set_cookie(
            key="user_id",
            value=str(user_id),
            httponly=True,
            secure=True,
            samesite="lax"
        )
        return {"message": "Login successful"}

    return {"error": "Invalid email or password"}

@app.post("/logout")
def logout_user(response: Response,id: str | None = Cookie(default=None), db: Session = Depends(init_db)):
    response.delete_cookie(
        key="user_id",
        httponly=True,
        secure=True,
        samesite="lax"
    )
    return "logout sucessfully"

@app.get("/check-auth")
def check_auth(
    user_id: str | None = Cookie(default=None)
):
    if user_id is None:
        return {"logged_in": False}

    return {"logged_in": True}