# 🧠 BlogAgentic – Multilingual Blog Generator

Generate SEO-friendly blogs in multiple languages (like **Hindi** & **French**) using **LangGraph**, **FastAPI**, and **Groq's LLMs (LLaMA 3)**. This project demonstrates a graph-based approach to AI workflows for content generation and translation.

---

## 🚀 Features

- 🌐 Accepts `topic` and optional `language` via API
- ✍️ Generates a creative blog title and detailed content
- 🌍 Translates blog to **Hindi** or **French** using conditional routing
- ⚙️ LangGraph integration for node-based LLM orchestration
- 📊 Compatible with **LangSmith** for tracing & debugging

---

## 🧱 Tech Stack

| Tool           | Purpose                                 |
|----------------|-----------------------------------------|
| **FastAPI**     | Web framework for API endpoints         |
| **LangGraph**   | Build dynamic LLM workflows as graphs   |
| **Groq**        | LLM provider (LLaMA 3.1 8B Instant)     |
| **LangChain**   | LLM abstraction & chaining              |
| **Uvicorn**     | ASGI server                             |
| **python-dotenv** | Load `.env` variables securely       |

---

## 📁 Project Structure

BlogAgentic/
│
├── app.py                     # FastAPI server entrypoint
├── requirements.txt           # Dependencies
├── .env                       # Environment variables
│
├── src/
│   ├── llms/
│   │   └── groqllm.py         # Groq LLM wrapper
│   ├── states/
│   │   └── blogstate.py       # Blog model & state schema
│   ├── nodes/
│   │   └── blog_node.py       # Nodes for generation & translation
│   └── graphs/
│       └── graph_builder.py   # Graph logic using LangGraph
│
└── langgraph.yaml             # LangGraph Studio configuration

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Aditya2600/BlogAgentic-Multilingual-Blog-Generator.git
cd BlogAgentic

2. Create a Virtual Environment using uv

uv venv
source .venv/bin/activate

3. Install Dependencies

uv pip install -r requirements.txt

4. Create .env File

GROQ_API_KEY=your_groq_api_key
LANGCHAIN_API_KEY=your_langsmith_api_key


⸻

🔄 Run the FastAPI Server

uvicorn app:app --reload

API will be available at:
	•	Swagger UI: http://127.0.0.1:8000/docs
	•	Endpoint: POST /blogs

⸻

📬 Sample Blog Generation (Postman)

Request JSON

{
  "topic": "Ethical AI",
  "language": "french"
}

Screenshots

Postman Request	LangGraph Graph View
	


⸻

🧠 How LangGraph Works

Two graph variants are dynamically built:

📌 If only topic is passed:

START ➝ title_creation ➝ content_generation ➝ END

🌍 If language is also passed:

START ➝ title_creation ➝ content_generation ➝ route_decision ➝ hindi_translation/french_translation ➝ END

LangGraph enables dynamic, node-based execution with flexible routing!

⸻

🧪 LangGraph Studio Integration

To visualize and monitor node-level flow:

langgraph dev

Then open LangGraph Studio

Ensure your langgraph.yaml is configured as:

dependencies: ["."]
graphs:
  blog_generator_agent: ./src/graphs/graph_builder.py:graph
env: ./.env


⸻

📦 Freeze Dependencies

uv pip freeze > requirements.txt


⸻

👤 Author

Aditya Meshram
B.Tech IT | NIT Raipur
💼 Project: AI x LangChain Workflow Automation

⸻

📄 License

MIT License – Free to use for personal and commercial projects.

⸻

