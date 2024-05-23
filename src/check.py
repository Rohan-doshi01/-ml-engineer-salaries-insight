import requests

# Replace 'YOUR_API_KEY' with your actual OpenAI API key
api_key = 'YOUR_API_KEY'

# Set up the API endpoint URL
url = 'https://api.openai.com/v1/completions'

# Set up the request headers with the API key
headers = {
    'Authorization': f'Bearer sk-proj-0CuzOqFoVF60BsSXJQQRT3BlbkFJcm7p0zRyPCemSm1tmTTr',
    'Content-Type': 'application/json'
}

# Set up the request payload (data to be sent with the request)
data = {
    'model': 'text-davinci-002',
    'prompt': 'Once upon a time,',
    'max_tokens': 50
}

# Send the HTTP POST request to the OpenAI API endpoint
response = requests.post(url, headers=headers, json=data)

# Check if the request was successful (status code 200) and print the response
if response.status_code == 200:
    print('Request successful!')
    print('Response:', response.json())
else:
    print('Request failed with status code:', response.status_code)
    print('Error message:', response.text)
