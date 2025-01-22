from openai import OpenAI

from settings import OpenAI_Key, OpenAI_Model


def chatbot_response(user_input, model="gpt-4"):
    try:
        # OpenAI API ChatCompletion
        client = OpenAI(api_key=OpenAI_Key)
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a financial expert specializing in strategies for personal and business finance. "
                        "Your role is to provide clear, actionable, and professional advice on financial management, "
                        "investments, cash flow, budgeting, and wealth-building strategies."
                    )
                },
                {
                    "role": "user",
                    "content": user_input
                }
            ],
            temperature=0.7,  # Controls creativity level
            max_tokens=300,  # Limit the length of the response
        )

        # Extract and return the assistant's response
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"An error occurred: {e}"


def run_chatbot():
    """
    Runs the chatbot in a loop until the user exits.
    """
    print("ChatGPT-based Chatbot")
    print("Type 'exit' to end the chat.")
    print("----------------------")

    while True:
        # Get user input
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("Goodbye!")
            break

        # Get and display the chatbot's response
        response = chatbot_response(user_input)
        print(f"Bot: {response}")


if __name__ == "__main__":
    run_chatbot()
