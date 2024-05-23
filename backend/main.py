# backend/main.py
import os
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from dotenv import load_dotenv
from typing import List

load_dotenv()

app = FastAPI()

# Vectorize the salaries response CSV data
loader = CSVLoader(file_path="salaries.csv")
documents = loader.load()

embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(documents, embeddings)

# Function for similarity search
def retrieve_info(query: str) -> List[str]:
    similar_response = db.similarity_search(query, k=3)
    page_contents_array = [doc.page_content for doc in similar_response]
    return page_contents_array

# Setup LLMChain & prompts
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k-0613")

template = """
You are a world-class business development representative. 
I will share a prospect's message with you and you will give me the best answer that 
I should send to this prospect based on past best practices, 
and you will follow ALL of the rules below:

1/ Response should be very similar or even identical to the past best practices, 
in terms of length, tone of voice, logical arguments and other details

2/ If the best practice is irrelevant, then try to mimic the style of the best practice to the prospect's message

Below is a message I received from the prospect:
{message}

Here is a list of best practices of how we normally respond to a prospect in similar scenarios:
{best_practice}

Please write the best response that I should send to this prospect:
"""

prompt = PromptTemplate(
    input_variables=["message", "best_practice"],
    template=template
)

chain = LLMChain(llm=llm, prompt=prompt)

# Retrieval augmented generation
def generate_response(message: str) -> str:
    best_practice = retrieve_info(message)
    response = chain.run(message=message, best_practice=best_practice)
    return response

class QueryRequest(BaseModel):
    message: str

@app.post("/api/generate-response")
async def generate_response_api(query: QueryRequest):
    try:
        response = generate_response(query.message)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
