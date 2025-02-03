from openai import OpenAI
from pydantic import BaseModel

from settings import OpenAI_Key, OpenAI_Model


class Content(BaseModel):
    needs: str
    requirements: str
    objectives: str
    reason: str


def generate_content(names, requirements_content, reason_content, model=OpenAI_Model):
    try:
        names_combined = " and ".join(names)
        client = OpenAI(api_key=OpenAI_Key)
        # Use the chat completion endpoint
        response = client.beta.chat.completions.parse(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a finance expert helping advisors with financial recommendations."
                },
                {
                    "role": "user",
                    "content": f"""You are a finance expert who turns complex requirements into detailed 
                                recommendations for advisors.
                                
                                These are advisors' clients
                                {names_combined}
                                
                                Please create a thorough financial report. Use the following inputs:  
                                - REQUIREMENTS: {requirements_content}  
                                - REASON FOR LENDER CHOICE: {reason_content}  
                                
                                The most important thing is that you shouldn't create your own statements, you have to 
                                just specify the contents.
                                
                                Break the response down into these sections:  
                                
                                1. **Needs**: Explain what the clients want, including specific goals and 
                                motivations. 2. **Requirements**: Provide a detailed explanation of all factors 
                                affecting their situation (financial, employment, etc.). 3. **Objectives**: Summarize 
                                detailed financial, professional, and personal objectives. 4. **Reason**: Justify the 
                                choice thoroughly based on all data. Reason has to be more detailed. Reason has to be
                                more than three or four paragraphs.
                                
                                Ensure **each section contains in-depth analysis, details, and professional 
                                reasoning**. Please avoid summarization and prioritize long-form content with clear, 
                                bullet-point explanations.
                               
                                Here is sample for you. NEEDS: • Adrian and Amy wish to cash out $80K for 
                                nonstructural home improvements by adding another loan split.

                                OBJECTIVES: • Undertake these home improvements while retaining their existing fixed 
                                interest rate of 2.24% with NAB, which runs until July 2025.
                                
                                REQUIREMENTS: • Execute a loan variation with NAB to secure the additional $80K. • 
                                Ensure the new loan split has the same term as their existing mortgage. • Navigate 
                                Amy’s recent job change to a part-time seasonal Trainer position from 6 June 2023. • 
                                Account for Adrian’s new employment, with their consistent industry experience as a 
                                supporting factor. • The repayment structure for the additional loan should be 
                                Principal and Interest (P&I).
                                
                                REQUIREMENTS AND OBJECTIVES: Adrian and Amy, you aim to secure an additional $80K 
                                through a loan variation, creating a new loan split, and preserving your existing 
                                mortgage’s rate with NAB. Your recent employment transitions will be considered, 
                                but your ongoing industry involvement is noteworthy. The additional funds are meant 
                                for nonstructural home improvements, with a Principal and Interest repayment 
                                structure that matches your existing loan's terms.
                                
                                REASON FOR THE FINAL CHOICE OF LENDER: Upon analyzing your needs, objectives, 
                                and employment transitions, we recommend continuing with the loan variation through 
                                NAB for these reasons:
                                • NAB can facilitate a loan variation, allowing you to access the required $80K while 
                                maintaining your existing rate. • Given your enduring presence in your respective 
                                industries and Amy's new role without a probationary period, there are positive 
                                indicators for NAB's consideration. • The loan variation proposed will align the new 
                                loan's term with your current mortgage's duration and will be structured as a 
                                Principal and Interest repayment.

                               """
                }
            ],
            response_format=Content,
            temperature=0.7,  # Adjust creativity level
            max_tokens=2000,  # Adjust token limit
        )

        # Extract the assistant's reply
        summary_content = {"needs": response.choices[0].message.parsed.needs,
                           "requirements": response.choices[0].message.parsed.requirements,
                           "objectives": response.choices[0].message.parsed.objectives,
                           "reason": response.choices[0].message.parsed.reason}
        return summary_content
    except Exception as e:
        return f"An error occurred: {e}"


if __name__ == "__main__":
    names = ["Daniel", "Kaitlyn"]
    # Sample content to summarize
    requirements = """Daniel and Kaitlyn, as first-time homebuyers, you are seeking finance to purchase your first 
    home. You require a bank that will consider the family tax benefits that Kaitlyn is receiving from Centrelink to 
    maximize your borrowing capacity. You also require a bank that will accept Daniel’s low credit score since his 
    Buy Now, Pay Later accounts have been closed."""

    reason = """After carefully comparing various banks based on your specific needs, objectives, and requirements, 
    we recommend MyState for the following reasons: MyState Choice is offering a competitive interest rate for your 
    home purchase. We have confirmed that Kaitlyn's family tax benefit is acceptable and can be used to maximize your 
    borrowing capacity. Daniel's credit score and the gift from Daniel's mom have also been confirmed as acceptable 
    by MyState. MyState has a prompt turnaround time of 2-3 business days, with an average time from submission to 
    approval of 8 business days. The proposed loan product includes access to an offset account and offers the 
    flexibility to make extra repayments, which you can redraw at your convenience. This recommendation aligns well 
    with your objectives and is considered not unsuitable for your needs. However, please note that MyState will 
    require a comprehensive assessment of your application before approval."""

    # Call the summarize function
    content = generate_content(names, requirements, reason)
    print(content)
