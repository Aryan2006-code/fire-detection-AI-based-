from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import api

app = FastAPI(title="AGNI-NET API", version="0.1.0")

# CORS setup
origins = [
    "http://localhost:5173", # Vite frontend
    "https://fire-detection-ai-based.onrender.com",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AGNI-NET Fire Detection System API is Online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
