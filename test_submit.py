import urllib.request
import json

url = "http://localhost:8000/api/buddies/submit"
data = {
    "full_name": "Test Lecturer",
    "email": "test@example.com",
    "research_topic": "Test Topic",
    "research_field": "Sinh học",
    "research_subject": "Sinh học lý thuyết",
    "description": "Test description",
    "academic_title": "Giáo sư",
    "academic_degree": "Tiến sĩ",
    "workplace": "Khoa Sinh học"
}

req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        print(f"Content: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Content: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")