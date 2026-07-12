from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
import requests

router = APIRouter()

# Pydantic schemas matching DDL and REST requirements
class SessionCreate(BaseModel):
    course_id: str
    user_id: str
    mode: Optional[str] = "intermediate"

class SessionResponse(BaseModel):
    session_id: str
    course_id: str
    mode: str

class MessageRequest(BaseModel):
    message: str

class SourceCitation(BaseModel):
    lecture_id: str
    lecture_title: str
    timestamp_seconds: int

class MessageResponse(BaseModel):
    reply: str
    sources: List[SourceCitation]
    mode: str


@router.post("/chat/sessions", response_model=SessionResponse)
def create_chat_session(payload: SessionCreate):
    # Stub: Create session entry in database
    return SessionResponse(
        session_id="mock-session-uuid-10293",
        course_id=payload.course_id,
        mode=payload.mode
    )


@router.post("/chat/sessions/{session_id}/messages", response_model=MessageResponse)
def send_chat_message(session_id: str, payload: MessageRequest):
    groq_api_key = os.environ.get("GROQ_API_KEY", "")
    
    # RAG Simulation Logic
    # 1. Generate text embedding from message (e.g. O(n) pivots)
    # 2. Match similarity against pgvector database document_chunks
    # 3. Retrieve chunks and construct LLM prompt
    
    user_prompt = payload.message.lower()
    
    # Mocking different grounded replies based on query
    if "quicksort" in user_prompt or "pivot" in user_prompt:
        reply = (
            "Quicksort has an O(n^2) worst-case time complexity. This degradation typically occurs "
            "when the partitioning pivot divides the array highly unequally (e.g., choosing the first "
            "or last element as a pivot on an already sorted or reverse-sorted array)."
        )
        sources = [
            SourceCitation(
                lecture_id="mock-lecture-uuid-2",
                lecture_title="Sorting Algorithms - Part 2",
                timestamp_seconds=842
            )
        ]
    elif "bst" in user_prompt or "binary search tree" in user_prompt:
        reply = (
            "In a Binary Search Tree (BST), an In-order traversal visits nodes in the sequence "
            "Left, Root, Right. Because of the BST ordering property (left child < root < right child), "
            "this traversal visits keys in ascending sorted order."
        )
        sources = [
            SourceCitation(
                lecture_id="mock-lecture-uuid-1",
                lecture_title="Non-Linear Structures: BST",
                timestamp_seconds=124
            )
        ]
    else:
        reply = (
            "Based on the course syllabus, the topics covered focus on Linear Lists, Stacks, "
            "Queues, and Non-linear structures such as Trees and Graphs. Please ask a question "
            "grounded in these materials."
        )
        sources = [
            SourceCitation(
                lecture_id="mock-lecture-uuid-all",
                lecture_title="Course Syllabus",
                timestamp_seconds=0
            )
        ]

    # Real Groq API client integration logic would look like this:
    # if groq_api_key:
    #     headers = {"Authorization": f"Bearer {groq_api_key}"}
    #     llm_payload = {
    #         "model": "llama3-8b-8192",
    #         "messages": [{"role": "user", "content": payload.message}]
    #     }
    #     r = requests.post("https://api.groq.com/openai/v1/chat/completions", json=llm_payload, headers=headers)
    #     if r.ok:
    #         reply = r.json()["choices"][0]["message"]["content"]

    return MessageResponse(
        reply=reply,
        sources=sources,
        mode="intermediate"
    )
