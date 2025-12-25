import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from src.graphs.graph_builder import GraphBuilder
from src.llms.groqllm import GroqLLM

import os
from dotenv import load_dotenv
load_dotenv()

app=FastAPI()

print(os.getenv("LANGCHAIN_API_KEY"))

os.environ["LANGSMITH_API_KEY"]=os.getenv("LANGCHAIN_API_KEY")

BASE_DIR = Path(__file__).resolve().parent
ASSETS_DIR = BASE_DIR / "assets"
STATIC_DIR = BASE_DIR / "static"
app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
async def index():
    return FileResponse(STATIC_DIR / "index.html")

## API's

@app.post("/blogs")
async def create_blogs(request:Request):
    
    data=await request.json()
    topic= data.get("topic","")
    language = data.get("language", '')
    print(language)

    ## get the llm object

    groqllm=GroqLLM()
    llm=groqllm.get_llm()

    ## get the graph
    graph_builder=GraphBuilder(llm)
    if topic and language:
        graph=graph_builder.setup_graph(usecase="language")
        state=graph.invoke({"topic":topic,"current_language":language.lower()})

    elif topic:
        graph=graph_builder.setup_graph(usecase="topic")
        state=graph.invoke({"topic":topic})
    

    return {"data":state}

if __name__=="__main__":
    uvicorn.run("app:app",host="0.0.0.0",port=8000,reload=True)
