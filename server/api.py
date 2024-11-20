import os
import google.generativeai as genai
from flask import Flask, request, jsonify
os.environ["GEMINI_API_KEY"] = "Your Api key"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

app = Flask(__name__)

@app.route('/get_word_details', methods=['GET'])
def get_word_details():
    word = request.args.get('word')
    if not word:
        return jsonify({"error": "No word provided."})
    word_details = get_word_meaning_and_synonyms(word)
    
    return jsonify(word_details)

def get_word_meaning_and_synonyms(word):
    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content(f"Please define the word '{word}' and provide synonyms and make it really short.")
        text = response.text
        definition = extract_definition(text)
        synonyms = extract_synonyms(text)
        return {
            "word": word,
            "definition": text,
            "synonyms": synonyms
        }
    except Exception as e:
        print(f"Error during Gemini API request: {e}")
        return {
            "word": word,
            "definition": "No definition found.",
            "synonyms": ["No synonyms found."]
        }

def extract_definition(response_text):
    definition_prefix = "Definition:"
    start_idx = response_text.find(definition_prefix)
    if start_idx != -1:
        start_idx += len(definition_prefix)
        end_idx = response_text.find("\n", start_idx)
        print(response_text[start_idx:end_idx].strip())
        return response_text[start_idx:end_idx].strip()
    return "No definition found."

def extract_synonyms(response_text):
    synonyms_prefix = "Synonyms:"
    start_idx = response_text.find(synonyms_prefix)
    if start_idx != -1:
        start_idx += len(synonyms_prefix)
        synonyms_text = response_text[start_idx:].strip()
        return [synonym.strip() for synonym in synonyms_text.split(",")]
    return ["No synonyms found."]

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
