from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import urllib.parse

password = "jayant@@sharma"
safe_password = urllib.parse.quote_plus(password)

DATABASE_URL = f"mysql+pymysql://root:{safe_password}@localhost:3306/Planora"

engine= create_engine(DATABASE_URL)
session = sessionmaker(bind=engine)