import uvicorn
from fastapi import FastAPI

app = FastAPI ()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/logs")
def read_logs():
    return {"logs": "logs"}

@app.post("/predict")
def predict():
    return {"predict": "predict"}


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
