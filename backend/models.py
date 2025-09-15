# backend/models.py

from pydantic import BaseModel, Field
from typing import List, Optional

# --- Shared Models ---
class EducationItem(BaseModel):
    degree: str
    institution: str
    year: str

class ExperienceItem(BaseModel):
    role: str
    company: str
    duration: str
    description: Optional[str] = None

# --- Candidate Profile Model ---
class CandidateProfile(BaseModel):
    # The 'id' field is now optional and will be populated after DB insertion.
    # We use an alias to map this field to MongoDB's '_id'.
    id: Optional[str] = Field(alias='_id', default=None)
    name: str
    email: str
    jobTitle: str
    location: str
    profilePicture: str
    bio: str
    skills: List[str]
    education: List[EducationItem]
    experience: List[ExperienceItem]

    class Config:
        # This allows Pydantic to work with object attributes and aliases
        populate_by_name = True
        
class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: CandidateProfile