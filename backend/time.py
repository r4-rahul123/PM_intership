from pymongo import MongoClient
import datetime
import pprint

# Step 1: Establish a connection to the MongoDB server
# Make sure your MongoDB server is running!
try:
    client = MongoClient("mongodb+srv://r4-rahul123:r4rahul123@cluster05.fawchhh.mongodb.net/?retryWrites=true&w=majority")
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    exit()

# Step 2 & 3: Reference the database and collection
db = client.resume_parser
resumes_collection = db.resumes
print(f"🔗 Accessing database: '{db.name}' and collection: '{resumes_collection.name}'\n")

# Step 4: Define a document that follows our schema
resume_data = {
    "file_metadata": {
        "original_filename": "Priya_Patel_Resume.pdf",
        "upload_timestamp": datetime.datetime.now(datetime.timezone.utc)
    },
    "personal_info": {
        "name": "Priya Patel",
        "email": "priya.patel@example.com",
        "phone": "+91-9876543210",
        "address": "Mumbai, India",
        "links": [
            "https://linkedin.com/in/priyapatel",
            "https://github.com/priyapateldev"
        ]
    },
    "summary": "Experienced web developer with a passion for creating responsive and intuitive user interfaces using modern JavaScript frameworks...",
    "skills": [
        { "category": "Programming Languages", "name": "JavaScript" },
        { "category": "Frameworks", "name": "React" },
        { "category": "Databases", "name": "MongoDB" }
    ],
    "work_experience": [
        {
            "title": "Software Developer Intern",
            "company": "Tech Solutions Inc.",
            "location": "Mumbai, India",
            "start_date": "June 2025",
            "end_date": "August 2025"
        }
    ],
    "education": [
        {
            "degree": "B.Tech in Computer Science",
            "institution": "Indian Institute of Technology",
            "location": "Bombay, India",
            "graduation_year": 2026
        }
    ],
    "affirmative_action": {
        "social_category": "General",
        "district_type": "Urban"
    }
}

# Step 5: Insert the document into the collection
try:
    result = resumes_collection.insert_one(resume_data)
    print("➕ Document inserted successfully!")
    print(f"Inserted document ID: {result.inserted_id}")

    # Optional: Step 6: Verify the insertion
    # Retrieve and print the document to confirm it's in the database
    inserted_document = resumes_collection.find_one({"_id": result.inserted_id})
    print("\n📄 Document found in the database:")
    pprint.pprint(inserted_document)

except Exception as e:
    print(f"❌ An error occurred during insertion: {e}")
finally:
    # Close the connection
    client.close()
    print("\n🔌 Connection to MongoDB closed.")