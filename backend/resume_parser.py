import re
from typing import List, Dict, Any

# --- Keyword Lists (Copy-pasted from our previous discussions) ---
SKILL_KEYWORDS = [
    "python", "java", "c++", "c#", "javascript", "typescript", "php", "ruby", "go", "swift",
    "kotlin", "scala", "rust", "r", "matlab", "bash", "shell scripting", "perl", "html", "css",
    "react", "angular", "vue.js", "jquery", "bootstrap", "tailwind css", "sass", "less",
    "webpack", "babel", "frontend", "ui/ux", "figma", "adobe xd", "sketch", "responsive design",
    "node.js", "express.js", "django", "flask", "ruby on rails", "spring boot", "asp.net",
    "laravel", "graphql", "rest api", "microservices", "backend", "api development",
    "android development", "ios development", "react native", "flutter", "xamarin", "swiftui",
    "kotlin multiplatform", "mobile apps",
    "sql", "mysql", "postgresql", "mongodb", "cassandra", "redis", "firebase", "sqlite",
    "oracle", "microsoft sql server", "nosql", "database design", "data warehousing",
    "aws", "amazon web services", "azure", "microsoft azure", "google cloud platform", "gcp",
    "docker", "kubernetes", "terraform", "ansible", "jenkins", "gitlab ci/cd", "ci/cd",
    "devops", "cloud computing", "serverless",
    "machine learning", "deep learning", "nlp", "natural language processing", "computer vision",
    "reinforcement learning", "tensorflow", "pytorch", "scikit-learn", "keras", "pandas",
    "numpy", "scipy", "matploblib", "seaborn", "data analysis", "data mining", "data visualization",
    "big data", "hadoop", "spark", "etl", "statistical modeling", "ai", "artificial intelligence",
    "prompt engineering", "generative ai", "llm", "large language models",
    "excel", "power bi", "tableau", "qlikview", "looker", "business intelligence", "data analyst",
    "dashboarding", "data storytelling",
    "agile", "scrum", "kanban", "jira", "asana", "trello", "project management", "product management",
    "stakeholder management", "risk management", "confluence",
    "git", "github", "gitlab", "bitbucket", "version control",
    "linux", "unix", "windows server", "networking", "tcp/ip", "cybersecurity", "information security",
    "penetration testing", "network security",
    "communication", "teamwork", "problem solving", "critical thinking", "adaptability",
    "creativity", "leadership", "time management", "collaboration", "interpersonal skills",
    "attention to detail", "presentation skills", "research",
    "autocad", "solidworks", "revit", "sap", "salesforce", "microsoft office", "google workspace",
    "jira", "servicenow", "tableau desktop", "adobe photoshop", "adobe illustrator", "figma",
    "microsoft project",
    "seo", "search engine optimization", "sem", "search engine marketing", "google analytics",
    "google ads", "social media marketing", "content marketing", "email marketing",
    "digital marketing", "copywriting", "graphic design", "ux writing",
    "financial modeling", "financial analysis", "accounting", "auditing", "bookkeeping", "quickbooks",
    "fintech", "investments", "risk analysis", "budgeting",
    "mechanical engineering", "electrical engineering", "civil engineering", "chemical engineering",
    "robotics", "automation", "mechatronics", "cad", "cam", "plc", "circuits",
    "algorithms", "data structures", "object-oriented programming", "oop", "functional programming",
    "design patterns", "software development lifecycle", "sdlc", "testing", "qa", "quality assurance",
    "technical writing", "documentation", "troubleshooting", "system design", "architecture",
    "user research", "customer experience", "cx", "supply chain", "logistics", "operations",
    "technical support", "help desk", "sales", "customer service",
    "market research", "business development", "entrepreneurship", "startup", "innovation",
    "regulatory compliance", "governance", "legal research", "policy analysis",
    "public relations", "journalism", "editing", "translation", "multilingual",
    "research methods", "statistical analysis", "experimental design", "biotechnology",
    "genomics", "bioinformatics", "pharmacology", "clinical research", "public health",
    "environmental science", "sustainability", "geospatial analysis", "gis",
    "urban planning", "architecture", "interior design", "industrial design",
    "fashion design", "textile design", "jewelry design", "game development", "unity", "unreal engine"
]

EDU_KEYWORDS = [
    "b.tech", "btech", "b.e.", "be", "bachelor of technology", "bachelor of engineering",
    "bachelor of science", "b.sc", "bsc", "bachelor of arts", "b.a.", "ba",
    "bachelor of business administration", "bba", "b.com", "bachelor of commerce",
    "b.ed", "bachelor of education", "b.arch", "bachelor of architecture",
    "bachelor of computer applications", "bca", "b.pharm", "bachelor of pharmacy",
    "bachelor",
    "m.tech", "mtech", "m.e.", "me", "master of technology", "master of engineering",
    "master of science", "m.sc", "msc", "master of arts", "m.a.", "ma",
    "master of business administration", "mba", "master of computer applications", "mca",
    "master of pharmacy", "m.pharm", "m.phil", "master of philosophy",
    "master",
    "phd", "ph.d.", "doctorate", "doctor of philosophy",
    "diploma", "associate degree", "certificate", "polytechnic", "iti",
    "post graduate diploma", "pgdm", "pgp",
    "mbbs", "bds", "md", "ms", "ll.b.", "llb", "ll.m.", "llm", "jd", "doctor of law",
    "graduate", "postgraduate", "undergraduate", "alumni", "pursuing", "student", "college",
    "university", "institute", "academy", "school", "faculty", "department", "degree",
    "program", "course", "curriculum", "major", "minor", "specialization", "hons", "honours"
]
# --- End of Keyword Lists ---



def extract_name(text: str) -> str:
    """
    Attempts to extract a name from the text. This is a very basic approach.
    More robust solutions use NER or resume-specific parsers.
    """
    # Look for capitalized words at the beginning of the document or after common headings
    # This is highly heuristic and can easily fail.
    # A more reliable method would involve a list of common names or NER.
    name_patterns = [
        r"^(?:name|full name)?\s*:\s*([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})", # "Name: John Doe"
        r"^([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})\n", # Common for name at very top
        r"^([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})\s+(?:CV|Resume|Curriculum Vitae)", # "John Doe Resume"
        r"([A-Z][a-z]+(?: [A-Z][a-z]+){1,3})\s+(?:[A-Z][a-z]{1,2}\.)?(?:[A-Z][a-z]+(?:-[A-Z][a-z]+)?)\s+(?:\w+\s){0,2}(?:\w+@)" # John Doe email.com
    ]
    for pattern in name_patterns:
        match = re.search(pattern, text, re.MULTILINE)
        if match:
            return match.group(1).strip()
    return "Extracted Candidate" # Default if not found

def extract_email(text: str) -> str:
    """
    Extracts an email address from the text.
    """
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    return match.group(0) if match else "extracted@example.com"

def extract_phone_number(text: str) -> str:
    """
    Extracts a phone number from the text. (Optional, add to profile if needed)
    This is complex due to international formats.
    """
    phone_pattern = r'(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}' # Basic pattern for common formats
    match = re.search(phone_pattern, text)
    return match.group(0) if match else "N/A"

def extract_location(text: str) -> str:
    """
    Attempts to extract a location (city, state, country). Highly heuristic.
    """
    # Look for common city/state/country patterns near contact info or in an address block
    # This is very difficult without a gazetteer or more advanced NER.
    location_keywords = ['bengaluru', 'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'kolkata',
                         'pune', 'gurgaon', 'noida', 'ahmedabad', 'jaipur', 'lucknow', 'kochi',
                         'india', 'usa', 'canada', 'uk',
                         'remote', 'hybrid'] # Common keywords
    
    for keyword in location_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text.lower()):
            return keyword.title() # Return the first found keyword, capitalized

    return "Unspecified"


def extract_job_title(text: str) -> str:
    """
    # Attempts to extract a potential job title.
    # Often found at the top of a resume, or implied by skills/experience.
    # Very basic and prone to error without more context.
    # """
    # # Look for a title-like string after the name, before main sections
    # # Or in a "Summary" / "Objective" section.
    # title_patterns = [
    #     r"objective\s*:\s*([A-Za-z\s,-]+)",
    #     r"summary\s*:\s*([A-Za-z\s,-]+?)(?:\s*(?:skills|experience|education))",
    #     r"(?:seeking|looking for)\s+a\s+([A-Za-z\s,-]+?)\s+(?:role|position|opportunity)"
    # ]
    # for pattern in title_patterns:
    #     match = re.search(pattern, text.lower(), re.DOTALL)
    #     if match:
    #         return match.group(1).strip().title() # Return title-cased
    
    # # Fallback to skills if a clear title isn't found
    # skills = extract_skills_and_education(text)['skills']
    # if "Python" in skills or "Java" in skills:
    #     return "Software Developer/Engineer"
    # if "Data Analysis" in skills or "Machine Learning" in skills:
    #     return "Data Scientist/Analyst"
    # if "React" in skills or "Angular" in skills:
    #     return "Frontend Developer"

    return "Unspecified"


# --- Main Extraction Function ---

def extract_skills_and_education(text: str) -> Dict[str, Any]: # Changed return type to Any for broader fields
    """
    Extracts various details from a given text.
    """
    text_lower = text.lower()
    found_skills = set()
    found_education = []
    found_experience = []

    # Extract Skills
    for skill_keyword in SKILL_KEYWORDS:
        if re.search(r'\b' + re.escape(skill_keyword) + r'\b', text_lower):
            found_skills.add(skill_keyword)

    # Extract Education
    for edu_keyword in EDU_KEYWORDS:
        if re.search(r'\b' + re.escape(edu_keyword) + r'\b', text_lower):
            edu_item = {'degree': edu_keyword.title(), 'institution': 'Extracted Inst.', 'year': 'Unknown'}
            if edu_item not in found_education:
                found_education.append(edu_item)

    # Placeholder for Experience Extraction (very basic)
    if re.search(r'\b(intern|internship|trainee)\b', text_lower):
        found_experience.append({
            'role': 'Generic Intern Role',
            'company': 'Extracted Company',
            'duration': 'Extracted Duration',
            'description': 'Identified from experience section.'
        })

    # NEW: Call the helper functions
    name = extract_name(text)
    email = extract_email(text)
    location = extract_location(text)
    job_title = extract_job_title(text)


    return {
        "name": name,
        "email": email,
        "location": location,
        "jobTitle": job_title, # Changed key to match Pydantic model
        "skills": list(found_skills),
        "education": found_education,
        "experience": found_experience
    }