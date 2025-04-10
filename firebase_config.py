import os
import base64
import json
import firebase_admin
from firebase_admin import credentials, storage
from config import FIREBASE_STORAGE_BUCKET, FIREBASE_CREDENTIALS_PATH

def decode_credentials():
    """Decode the credentials from the encoded file and create the actual credentials file"""
    try:
        # Read the encoded credentials
        with open('firebase_credentials_encoded.txt', 'r') as f:
            encoded_content = f.read()
        
        # Remove the BEGIN/END CERTIFICATE lines if they exist
        encoded_content = '\n'.join([line for line in encoded_content.split('\n') 
                                   if not line.startswith('-----')])
        
        # Decode the content
        decoded_content = base64.b64decode(encoded_content)
        
        # Write to the credentials file
        with open(FIREBASE_CREDENTIALS_PATH, 'wb') as f:
            f.write(decoded_content)
            
        print("Successfully decoded credentials file")
    except Exception as e:
        print(f"Error decoding credentials: {e}")
        raise

# Initialize Firebase only if it hasn't been initialized yet
if not firebase_admin._apps:
    # First check if the original credentials file exists
    if not os.path.exists(FIREBASE_CREDENTIALS_PATH):
        # If not, try to decode from encoded file
        if os.path.exists('firebase_credentials_encoded.txt'):
            decode_credentials()
        else:
            # If neither exists, try to create from environment variables
            try:
                # Get credentials from environment variables
                private_key = os.environ.get("FIREBASE_PRIVATE_KEY")
                if private_key is None:
                    raise ValueError("FIREBASE_PRIVATE_KEY environment variable is not set")
                
                cred_json = {
                    "type": os.environ.get("FIREBASE_TYPE"),
                    "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
                    "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
                    "private_key": private_key.replace('\\n', '\n'),
                    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
                    "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
                    "auth_uri": os.environ.get("FIREBASE_AUTH_URI"),
                    "token_uri": os.environ.get("FIREBASE_TOKEN_URI"),
                    "auth_provider_x509_cert_url": os.environ.get("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
                    "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_X509_CERT_URL")
                }
                
                # Write to credentials file
                with open(FIREBASE_CREDENTIALS_PATH, 'w') as f:
                    json.dump(cred_json, f)
                    
                print("Successfully created credentials file from environment variables")
            except Exception as e:
                print("Could not create credentials from environment variables")
                raise FileNotFoundError(
                    f"Firebase credentials file not found at {FIREBASE_CREDENTIALS_PATH} and "
                    "could not be created from encoded file or environment variables. "
                    "Please make sure the credentials file is present in the project root."
                )
    
    # Now initialize Firebase with the credentials
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred, {
        'storageBucket': FIREBASE_STORAGE_BUCKET
    })

# Get the bucket reference
bucket = storage.bucket() 