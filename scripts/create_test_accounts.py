import requests
import json

# Base URL
BASE_URL = "http://localhost:8000/api/v1"

# Get CSRF token first
def get_csrf_token():
    response = requests.get(f"{BASE_URL}/csrf-token")
    data = response.json()
    return data.get('csrf_token', '')

# Create user via register endpoint
def create_user(email, username, password, csrf_token):
    headers = {
        'Content-Type': 'application/json',
        'x-csrf-token': csrf_token
    }

    payload = {
        'email': email,
        'username': username,
        'password': password
    }

    response = requests.post(f"{BASE_URL}/auth/register", headers=headers, json=payload)
    return response

# Test accounts to create
accounts = [
    {
        'email': 'guest_test@aicmr.com',
        'username': 'guest_test',
        'password': 'Guest@123456',
        'role': 'Guest'
    },
    {
        'email': 'member_test@aicmr.com',
        'username': 'member_test',
        'password': 'Member@123456',
        'role': 'Member'
    },
    {
        'email': 'mod_test@aicmr.com',
        'username': 'mod_test',
        'password': 'Mod@123456',
        'role': 'Moderator'
    },
    {
        'email': 'admin_test@aicmr.com',
        'username': 'admin_test',
        'password': 'Admin@123456',
        'role': 'Admin'
    },
]

def main():
    print("Getting CSRF token...")
    csrf_token = get_csrf_token()
    print(f"CSRF Token: {csrf_token}")

    print("\nCreating test accounts...")

    for account in accounts:
        try:
            print(f"\n[*] Creating {account['role']}: {account['email']}")
            response = create_user(
                email=account['email'],
                username=account['username'],
                password=account['password'],
                csrf_token=csrf_token
            )

            if response.status_code == 200:
                data = response.json()
                print(f"[+] Success! User created: {data}")
            else:
                print(f"[!] Failed: {response.status_code} - {response.text}")

        except Exception as e:
            print(f"[!] Error: {e}")

    print("\nDone.")

if __name__ == "__main__":
    main()
