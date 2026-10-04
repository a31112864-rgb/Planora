from fastapi import FastAPI, Depends
from database import engine
import database_moduls

app = FastAPI()

database_moduls.Base.metadata.create_all(engine)
