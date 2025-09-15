from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from io import BytesIO
from datetime import timedelta
from bson.objectid import ObjectId
from pypdf import PdfReader
from pymongo.database import Database
from . import auth
from pymongo import ReturnDocument
from .database import get_mongo_db, close_mongo_connection
from .resume_parser import extract_skills_and_education
from .models import CandidateProfile, Token, LoginResponse


app = FastAPI()

# --- App Lifecycle Events ---
@app.on_event("shutdown")
def shutdown_db_client():
    close_mongo_connection()

# --- Middleware ---
# Allows your frontend (e.g., from localhost:5173) to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper Functions ---
def extract_text_from_pdf(file: BytesIO) -> str:
    """Extracts text content from a PDF file."""
    text = ""
    try:
        pdf_reader = PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""
    return text.strip()

# --- Authentication Endpoints ---

@app.post("/token", response_model=LoginResponse)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Database = Depends(get_mongo_db)
):
    """
    Takes a username (email) and password, verifies them, and returns a JWT token
    along with the user's full candidate profile.
    """
    user_in_db = db["users"].find_one({"username": form_data.username})
    if not user_in_db or not auth.verify_password(form_data.password, user_in_db["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    candidate_profile = db["candidates"].find_one({"email": form_data.username})
    if not candidate_profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found for this user.")

    candidate_profile["_id"] = str(candidate_profile["_id"])

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user_in_db["username"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": candidate_profile
    }

@app.post("/users/register")
async def register_user(username: str, password: str, db: Database = Depends(get_mongo_db)):
    """Registers a new user in the database."""
    if db["users"].find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(password)
    db["users"].insert_one({"username": username, "hashed_password": hashed_password})
    
    return {"status": f"User '{username}' registered successfully"}

# --- Candidate Endpoints ---

@app.post("/candidates/{candidate_email}/parse-resume", response_model=CandidateProfile)
async def parse_resume_and_update_skills(
    candidate_email: str,
    file: UploadFile = File(...),
    db: Database = Depends(get_mongo_db)
):
    """Uploads a resume, extracts skills, and ADDS them to an EXISTING candidate's profile."""
    try:
        pdf_text = extract_text_from_pdf(file.file)
        if not pdf_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        extracted_data = extract_skills_and_education(pdf_text)
        found_skills = extracted_data.get('skills', [])

        if not found_skills:
            raise HTTPException(status_code=400, detail="No relevant skills found in the resume.")

        updated_candidate = db["candidates"].find_one_and_update(
            {"email": candidate_email},
            {"$addToSet": {"skills": {"$each": found_skills}}},
            return_document=ReturnDocument.AFTER
        )

        if not updated_candidate:
            raise HTTPException(status_code=404, detail=f"Candidate with email {candidate_email} not found.")

        updated_candidate["_id"] = str(updated_candidate["_id"])
        return updated_candidate

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update skills: {str(e)}")

@app.get("/candidates/", response_model=List[CandidateProfile])
async def get_all_candidates(db: Database = Depends(get_mongo_db)):
    """Retrieves all candidate profiles from the database."""
    all_candidates = []
    for candidate in db["candidates"].find({}):
        candidate["_id"] = str(candidate["_id"])
        all_candidates.append(candidate)
    return all_candidates

@app.get("/candidates/{candidate_id}", response_model=CandidateProfile)
async def get_candidate_by_id(candidate_id: str, db: Database = Depends(get_mongo_db)):
    """Retrieves a single candidate profile from the database by their ID."""
    try:
        obj_id = ObjectId(candidate_id)
        candidate = db["candidates"].find_one({"_id": obj_id})
        if candidate:
            candidate["_id"] = str(candidate["_id"])
            return candidate
        raise HTTPException(status_code=404, detail=f"Candidate with ID {candidate_id} not found")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format.")

@app.put("/candidates/{candidate_id}", response_model=CandidateProfile)
async def update_candidate(
    candidate_id: str,
    profile_data: CandidateProfile,
    db: Database = Depends(get_mongo_db)
):
    """Updates a candidate's profile information."""
    try:
        obj_id = ObjectId(candidate_id)
        update_dict = profile_data.model_dump(by_alias=True, exclude={'id'})

        result = db["candidates"].update_one(
            {"_id": obj_id},
            {"$set": update_dict}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Candidate not found")

        updated_profile = db["candidates"].find_one({"_id": obj_id})
        updated_profile["_id"] = str(updated_profile["_id"])
        return updated_profile

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))