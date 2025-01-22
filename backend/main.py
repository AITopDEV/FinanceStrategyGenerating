from src.parser.parser_preliminary_assessment import (
    parser_doc as parser_preliminary_assessment,
)
from src.parser.parse_credit_proposal import parser_doc as parser_credit_proposal
from src.image_integration.get_pic import get_house_picture
from src.document_generation.generate_full_word import generate_full_docx
from src.chatgpt_integration.generate_requirements_reason import generate_content

if __name__ == "__main__":
    preliminary_assessment_path = (
        "references/Delaney & Ralley - Preliminary Assessment.docx"
    )
    credit_proposal_path = "references/Delaney & Ralley - Credit Proposal.docx"
    house_address = "5 Marks St., Bendigo VIC 3550"

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

    house_picture = get_house_picture(house_address, "data/house_pic")

    generate_full_docx(
        preliminary_assessment_result,
        credit_proposal_result,
        house_picture[0],
        "data/temp_word",
        "data/result_word",
    )
