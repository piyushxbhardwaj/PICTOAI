import requests
import json
import time

base_url = "http://localhost:3000"

print("--- STARTING PIC TO AI API VERIFICATION ---")

# 1. Test Register
register_url = f"{base_url}/api/user/register"
unique_email = f"test_{int(time.time())}@example.com"
reg_payload = {
    "name": "Test User",
    "email": unique_email,
    "password": "testpassword123"
}

print(f"\n[1/4] Registering new user: {unique_email}...")
try:
    r = requests.post(register_url, json=reg_payload, timeout=10)
    print(f"Register status: {r.status_code}")
    reg_res = r.json()
    print("Register response:", reg_res)
    assert r.status_code == 201
    assert reg_res["success"] is True
    token = reg_res["token"]
except Exception as e:
    print(f"FAILED Register Test: {e}")
    exit(1)

# 2. Test Login
login_url = f"{base_url}/api/user/login"
login_payload = {
    "email": unique_email,
    "password": "testpassword123"
}
print(f"\n[2/4] Logging in...")
try:
    r = requests.post(login_url, json=login_payload, timeout=10)
    print(f"Login status: {r.status_code}")
    login_res = r.json()
    print("Login response:", login_res)
    assert r.status_code == 200
    assert login_res["success"] is True
except Exception as e:
    print(f"FAILED Login Test: {e}")
    exit(1)

# 3. Test Credits API
credits_url = f"{base_url}/api/user/credits"
headers = {
    "token": token
}
print(f"\n[3/4] Fetching user credits...")
try:
    r = requests.get(credits_url, headers=headers, timeout=10)
    print(f"Credits status: {r.status_code}")
    credits_res = r.json()
    print("Credits response:", credits_res)
    assert r.status_code == 200
    assert credits_res["success"] is True
    assert credits_res["credits"] == 50
except Exception as e:
    print(f"FAILED Credits Test: {e}")
    exit(1)

# 4. Test Image Generation
generate_url = f"{base_url}/api/image/generate-image"
gen_payload = {
    "prompt": f"Cyberpunk neon city street at night, unique key {time.time()}",
    "model": "HD",
    "style": "Cyberpunk",
    "aspect": "1:1"
}
print(f"\n[4/4] Sending image generation request...")
print("This may take a few seconds as it processes through pipeline / fallback API...")
try:
    r = requests.post(generate_url, json=gen_payload, headers=headers, timeout=60)
    print(f"Generate status: {r.status_code}")
    gen_res = r.json()
    print("Generate success field:", gen_res.get("success"))
    print("Generate message:", gen_res.get("message"))
    print("New credit balance:", gen_res.get("creditBalance"))
    
    assert r.status_code == 200
    assert gen_res["success"] is True
    assert "resultImage" in gen_res
    assert gen_res["creditBalance"] == 49
except Exception as e:
    print(f"FAILED Image Generation Test: {e}")
    exit(1)

print("\n--- ALL TESTS COMPLETED SUCCESSFULLY! ---")
