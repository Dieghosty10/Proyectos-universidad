import os
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Carga las variables de entorno del archivo .env
load_dotenv()

# Configura la clave de la API de Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("No se encontró la GEMINI_API_KEY en el archivo .env")

genai.configure(api_key=api_key)

# Configuración del modelo (esto está bien como lo tenías)
generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-latest",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

# --- INICIO DE LA CORRECCIÓN ---
# Movemos la creación de la conversación aquí. Se crea UNA SOLA VEZ.
convo = model.start_chat(history=[])
# --- FIN DE LA CORRECCIÓN ---

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/send_message", methods=["POST"])
def send_message():
    try:
        user_message = request.json["message"]
        
        # Ahora solo usamos la conversación que ya existe
        convo.send_message(user_message)
        
        # Devolvemos la última respuesta del bot
        return jsonify({"response": convo.last.text})
    except Exception as e:
        # Esto es importante para ver los errores en el frontend
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)