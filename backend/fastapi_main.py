from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os
from typing import Dict, List
from pydantic import BaseModel

from src.parser.parser_preliminary_assessment import parser_doc as parser_preliminary_assessment
from src.parser.parse_credit_proposal import parser_doc as parser_credit_proposal
from src.image_integration.get_pic import get_house_picture
from src.document_generation.generate_full_word import generate_full_docx
from src.chatgpt_integration.generate_requirements_reason import generate_content

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows specified origins
    allow_credentials=True,  # Allows cookies and credentials
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


def get_file_info(path: str, filename: str) -> Dict[str, str]:
    """
    Get information about a file
    """
    file_path = os.path.join(path, filename)
    file_info = os.stat(file_path)

    # Get file extension
    file_ext = os.path.splitext(filename)[1]
    if file_ext == "":
        file_ext = "unknown"

    return {
        "filename": filename,
        "last_modified": datetime.fromtimestamp(file_info.st_mtime).strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
        "extension": file_ext,
    }


# get file lists
@app.get("/api/files")
async def get_files_tree() -> Dict[str, List[Dict[str, str]]]:
    dic_path = "./data"
    files_tree = {}
    for folder in os.listdir(dic_path):
        folder_path = os.path.join(dic_path, folder)
        if os.path.isdir(folder_path):
            files_tree[folder] = [
                get_file_info(folder_path, f) for f in os.listdir(folder_path)
            ]
    return files_tree


class GetPictureRequest(BaseModel):
    address: str


# get picture based on address
@app.post("/api/pictures")
async def get_picture(picture_request: GetPictureRequest):
    house_pictures = get_house_picture(picture_request.address, "data/house_pic")
    print(house_pictures)
    return {"result": {"fileNames": house_pictures}}


# download file
class DownloadRequest(BaseModel):
    full_path: str


@app.get("/api/download")
async def download_file(full_path):
    print("qqq", full_path)
    return FileResponse(full_path)


def write_file(file_info):
    directory = f"./uploads"

    if not os.path.exists(directory):
        os.makedirs(directory)

    date_time_now = datetime.now().strftime("%H%M%S%f")
    filename = f"{date_time_now}_{file_info.filename}"
    file_location = f"{directory}/{filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file_info.file.read())
    return file_location


@app.post("/api/generate-doc")
async def generate_documents(files: List[UploadFile], picture_path: str = Form(...)):
    print([i.filename for i in files])
    preliminary_assessment_path = write_file(files[0])
    credit_proposal_path = write_file(files[1])
    preliminary_assessment_result = parser_preliminary_assessment(
        preliminary_assessment_path
    )
    credit_proposal_result = parser_credit_proposal(credit_proposal_path)

    generated_result = generate_content(
        credit_proposal_result["requirements_objectives"],
        credit_proposal_result["reason"],
    )
    credit_proposal_result["needs"] = generated_result["needs"]
    credit_proposal_result["requirements"] = generated_result["requirements"]
    credit_proposal_result["objectives"] = generated_result["objectives"]
    credit_proposal_result["reason"] = generated_result["reason"]

    generate_full_docx(
        preliminary_assessment_result,
        credit_proposal_result,
        picture_path,
        "data/temp_word",
        "data/result_word",
    )
    return {"result": {"docPath": "data/result_word/final.docx"}}
