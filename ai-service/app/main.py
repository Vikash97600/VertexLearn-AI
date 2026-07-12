from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat

app = FastAPI(
    title="VertexLearn AI Tutor Service",
    description="FastAPI service coordinating LLMs via Groq API and RAG over vector document chunks",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/v1/ai", tags=["AI Tutor"])

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "vertexlearn-ai-service",
        "vector_store_extension": "pgvector_ready"
    }
