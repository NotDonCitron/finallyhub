from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

SECRET_KEY = "bluebirdhub-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

# CORS für das Frontend erlauben
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Für Entwicklung, später gezielt setzen!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    username: str
    password: str

class Workspace(BaseModel):
    id: int
    name: str

class Document(BaseModel):
    id: int
    workspace_id: int
    title: str
    content: str

# Dummy-Daten
fake_users_db = {}
workspaces = [
    Workspace(id=1, name="Projekt Alpha"),
    Workspace(id=2, name="Projekt Beta"),
]
documents = []

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(username, password):
    user = fake_users_db.get(username)
    if not user or not verify_password(password, user["password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/register")
def register(user: User):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="User exists")
    fake_users_db[user.username] = {"password": get_password_hash(user.password)}
    return {"msg": "User created"}

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/workspaces", response_model=List[Workspace])
def get_workspaces():
    return workspaces

@app.post("/workspaces", response_model=Workspace)
def create_workspace(ws: Workspace):
    workspaces.append(ws)
    return ws

@app.get("/documents", response_model=List[Document])
def get_documents():
    return documents

@app.post("/documents", response_model=Document)
def create_document(doc: Document):
    documents.append(doc)
    return doc

@app.delete("/documents/{doc_id}")
def delete_document(doc_id: int):
    global documents
    documents = [d for d in documents if d.id != doc_id]
    return {"msg": "Deleted"}