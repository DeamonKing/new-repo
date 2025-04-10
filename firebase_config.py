import firebase_admin
from firebase_admin import credentials, storage

# Initialize Firebase only if it hasn't been initialized yet
if not firebase_admin._apps:
    cred = credentials.Certificate("jecon-cocktail-machine-firebase-adminsdk-fbsvc-0fecbeb26b.json")
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'jecon-cocktail-machine.firebasestorage.app'
    })

# Get the bucket reference
bucket = storage.bucket() 