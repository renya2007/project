from fastapi import FastAPI
import uvicorn
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def read_root():
    return FileResponse("index1.html")

@app.get("/index2.html")
def about():
    return FileResponse("index2.html")

@app.get("/cab.html")
def about():
    return FileResponse("cab.html")

if __name__ == "__main__":
    uvicorn.run('main:app', host='127.0.0.1', port=8000, reload=True)
