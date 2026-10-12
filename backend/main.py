from fastapi import FastAPI, Depends, Cookie, Response
from fastapi import HTTPException
from database import engine, session
import database_moduls
from sqlalchemy.orm import Session
from moduls import User, loginUser, Projects, Tasks
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

    all_tasks = db.query(database_moduls.Task).all()

    memberships = (
        db.query(database_moduls.ProjectMember)
        .filter(
            database_moduls.ProjectMember.user_id
            == current_user_id
        )
        .all()
    )

    print("Logged-in user ID:", current_user_id)
    print("All tasks:", [
        (t.id, t.project_id) for t in all_tasks
    ])
    print("User memberships:", [
        (m.user_id, m.project_id) for m in memberships
    ])

    tasks = (
        db.query(database_moduls.Task)
        .join(
            database_moduls.ProjectMember,
            database_moduls.Task.project_id
            == database_moduls.ProjectMember.project_id
        )
        .filter(
            database_moduls.ProjectMember.user_id
            == current_user_id
        )
        .distinct()
        .all()
    )

    return {
        "tasks": [
            {
                "id": t.id,
                "project_id": t.project_id,
                "project_name": t.project_name,
                "title": t.name,
                "status": t.status,
                "due_date": str(t.due_date) if t.due_date else None
            }
            for t in tasks
        ]
    }

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
def create_projects(
    project: Projects,
    user_id: str | None = Cookie(default=None),
    db: Session = Depends(init_db)
):
    if not user_id:
        raise HTTPException(status_code=401, detail="Login first")

    new_project = database_moduls.Db_project(
        name=project.name,
        user_id=int(user_id)
    )

    db.add(new_project)
    db.flush()  # Generates the project ID before committing

    membership = database_moduls.ProjectMember(
        user_id=int(user_id),
        project_id=new_project.id
    )

    db.add(membership)
    db.commit()
    db.refresh(new_project)

    return {
        "projectname": new_project.name,
        "projectid": new_project.id
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

@app.post("/task")
def create_task(
    task: Tasks,
    user_id: str | None = Cookie(default=None),
    db: Session = Depends(init_db)
):
    if not user_id:
        raise HTTPException(status_code=401, detail="Login first")

    try:
        current_user_id = int(user_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid login session")

    membership = db.query(database_moduls.ProjectMember).filter(
        database_moduls.ProjectMember.user_id == current_user_id,
        database_moduls.ProjectMember.project_id == task.project_id
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this project"
        )

    new_task = database_moduls.Task(
        name=task.name,
        project_id=task.project_id,
        project_name=task.project_name,
        status=task.status,
        due_date=task.due_date
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "detail": "Task added successfully",
        "task_id": new_task.id
    }

@app.put("/task")
def update_task(task_id: int,name: str, due_date: str, status: str, db: Session = Depends(init_db)):
    db_task = db.query(database_moduls.Task).filter(database_moduls.Task.id == task_id).first()
    if db_task:
        db_task = database_moduls.Task(
            name = name,
            due_date = due_date,
            status = status
        )
        db.commit()
        return {
            "detail": "task updated successfully"
        }
    return {
            "detail": "task updation failed"
        }

@app.delete("/task")
def delete_task(task_id: int, db: Session = Depends(init_db)):
    db_task = db.query(database_moduls.Task).filter(database_moduls.Task.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        return {
            "detail": "task deleted successfully"
        }
    return {
            "detail": "task deletion failed"
        }