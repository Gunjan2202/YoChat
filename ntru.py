# -*- coding: utf-8 -*-
"""Fernet.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1eK37qtuHZD7u_36saTVD93V6qMfBC9nk
"""



import cryptography


#############public key generation#########################
from cryptography.fernet import Fernet as ntru
key = ntru.generate_key() 

# print("Public key ") 
# print(key)




########################private key generation#########################
import base64
import os
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


password_provided = "privatekey" # This is input in the form of a string
password = password_provided.encode() # Convert to type bytes
salt = os.urandom(16) # CHANGE THIS - recommend using a key from os.urandom(16), must be of type bytes
kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,
    iterations=100000,
    backend=default_backend()
)
key = base64.urlsafe_b64encode(kdf.derive(password)) # Can only use kdf once
# print("Private key ") 
# print(key)



###################encoding messages##################
import sys
from cryptography.fernet import Fernet as ntru
message = sys.argv[1].encode()

f = ntru(key)
encrypted = f.encrypt(message)
print("Encrypted_msg :",end=" ")
print(encrypted)



###################decoding#########################
from cryptography.fernet import Fernet as ntru

decrypted = f.decrypt(encrypted)
print("Normal_msg :",end=" ")
print(sys.argv[1])