import base64

# Read the original credentials file
with open('jecon-cocktail-machine-firebase-adminsdk-fbsvc-45a8e9fa22.json', 'rb') as f:
    content = f.read()

# Encode to base64
encoded = base64.b64encode(content)

# Write to the encoded file
with open('firebase_credentials_encoded.txt', 'wb') as f:
    f.write(encoded)

print("Credentials file encoded successfully!") 