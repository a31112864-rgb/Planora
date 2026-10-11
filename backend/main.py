from fastapi import FastAPI, Depends, Cookie, Response
from fastapi import HTTPException
from database import engine, session
import database_moduls
from sqlalchemy.orm import Session
from moduls import User, loginUser, Projects
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
    if db_user:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {
            "message": "User sign up successful!",
            "user_id": db_user.id
        }
    return {
        "message": "User sign up failed."
    }


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
def login_user(
    login_data: loginUser,
    response: Response,
    db: Session = Depends(init_db)
):
    user = db.query(database_moduls.Db_user).filter(
        database_moduls.Db_user.email == login_data.email
    ).first()

    if not user or not verify_password(
        login_data.password, user.password
    ):
        return {"error": "Invalid email or password"}

    response.set_cookie(
        key="user_id",
        value=str(user.id),  # ID from the database
        httponly=True,
        secure=False,        # Local HTTP development only
        samesite="lax",
        max_age=20000000
    )

    return {
        "message": "Login successful",
        "username": user.username
        
        }


@app.post("/logout")
def logout_user(response: Response):
    response.delete_cookie(
        key="user_id",
        httponly=True,
        secure=False,        # Match the login cookie
        samesite="lax"
    )

    return {"message": "Logout successful"}



@app.get("/check-auth")
def check_auth(
    user_id: str | None = Cookie(default=None),
    db: Session = Depends(init_db)
):
    if user_id is None:
        return {"logged_in": False}

    user = db.query(database_moduls.Db_user).filter(
        database_moduls.Db_user.id == int(user_id)
    ).first()

    if not user:
        return {"logged_in": False}

    return {
        "logged_in": True,
        "username": user.username
    }

@app.get("/my-tasks")
def get_my_tasks(
    user_id: str | None = Cookie(default=None),
    db: Session = Depends(init_db)
):
    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Please log in first"
        )

    try:
        current_user_id = int(user_id)
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid login session"
        )

    tasks = (
        db.query(database_moduls.Task)
        .join(
            database_moduls.ProjectMember,
            database_moduls.Task.project_id == database_moduls.ProjectMember.project_id
        )
        .filter(
            database_moduls.ProjectMember.user_id
            == current_user_id
        )
        .all()
    )

    return {"tasks": tasks}


@app.get("/projects")
def get_projects(user_id: str | None = Cookie(default=None), db: Session = Depends(init_db)):
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Login first"
        )
    projects = db.query(database_moduls.Db_project).filter(database_moduls.Db_project.user_id == int(user_id)).all()
    return {
        "project": projects
    }

@app.post("/projects")
def create_projects(project: Projects, user_id: str | None = Cookie(default=None), db: Session = Depends(init_db)):
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Login first"
        )

    project = database_moduls.Db_project(
        name = project.name,
        user_id = user_id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return {
        "projectname": project.name,
        "projectid": project.id
        }

@app.put("/projects")
def update_projects(project: Projects, project_id: int, user_id: str | None = Cookie(default=None), db: Session = Depends(init_db)):
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Login first"
        )
    db_project = db.query(database_moduls.Db_project).filter(database_moduls.Db_project.id == project_id).first()
    if db_project:
        db_project = database_moduls.Db_project(
            name = project.name
        )
        db.commit()
        return {
            "detail": "project updated successfully."
        }
    return {
        "detail": "user not found"
    }

@app.delete("/projects")
def update_projects(project_id: int, user_id: str | None = Cookie(default=None), db: Session = Depends(init_db)):
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Login first"
        )
    db_project = db.query(database_moduls.Db_project).filter(database_moduls.Db_project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()

    


    

