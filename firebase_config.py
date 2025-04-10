import os
import firebase_admin
from firebase_admin import credentials, storage
from config import FIREBASE_STORAGE_BUCKET, FIREBASE_CREDENTIALS_PATH

# Initialize Firebase only if it hasn't been initialized yet
if not firebase_admin._apps:
    # Check if credentials file exists
    if not os.path.exists(FIREBASE_CREDENTIALS_PATH):
        raise FileNotFoundError(
            f"Firebase credentials file not found at {FIREBASE_CREDENTIALS_PATH}. "
            "Please make sure the credentials file is present in the project root."
        )
    
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred, {
        'storageBucket': FIREBASE_STORAGE_BUCKET
    })

# Get the bucket reference
bucket = storage.bucket() 