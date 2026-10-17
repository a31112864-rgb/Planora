from sqlalchemy import String, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from database import engine
from datetime import datetime, timezone

class Base(DeclarativeBase):
    pass

class Db_user(Base):
    __tablename__ = "User"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable = False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

class Db_project(Base):
    __tablename__ = "Projects"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("User.id"))
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)

class ProjectMember(Base):
    __tablename__ = "project_members"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("User.id"),nullable=False)

    project_id: Mapped[int] = mapped_column(ForeignKey("Projects.id"),nullable=False)

class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("Projects.id"))
    project_name: Mapped[str] = mapped_column(String(50))
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    due_date: Mapped[str] = mapped_column(String(40), nullable=False)

class Activity(Base):
    __tablename__ = "activities"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("Projects.id"))
    actor_id: Mapped[int] = mapped_column(Integer, ForeignKey("User.id"))
    description: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("User.id"), nullable=False
    )

    activity_id: Mapped[int] = mapped_column(
        ForeignKey("activities.id"), nullable=False
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


Base.metadata.create_all(engine)