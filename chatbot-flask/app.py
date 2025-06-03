from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

reglas_chatbot = {
    'saludos': {
        'palabras': ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos', 'qué onda', 'qué hay'],
        'respuesta': '¡Hola! ¿En qué puedo ayudarte hoy?'
    },
    'despedidas': {
        'palabras': ['adiós', 'chao', 'hasta luego', 'nos vemos', 'hasta pronto', 'bye', 'hasta la próxima'],
        'respuesta': '¡Hasta luego! Fue un placer ayudarte. Regresa cuando necesites algo más.'
    },
    'agradecimientos': {
        'palabras': ['gracias', 'te lo agradezco', 'muchas gracias', 'mil gracias', 'agradecido', 'agradecida'],
        'respuesta': '¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?'
    },
    'estado': {
        'palabras': ['cómo estás', 'qué tal', 'cómo te sientes', 'qué cuentas', 'cómo va todo'],
        'respuesta': '¡Estoy funcionando perfectamente! Listo para ayudarte. ¿Y tú cómo estás?'
    },
    'nombre': {
        'palabras': ['cómo te llamas', 'cuál es tu nombre', 'tienes nombre', 'quién eres'],
        'respuesta': 'Soy AsistenteBot, tu asistente virtual. ¿En qué puedo servirte?'
    },
    'creador': {
        'palabras': ['quién te creó', 'quién te programó', 'quién te hizo', 'de dónde vienes'],
        'respuesta': 'Fui desarrollado por un equipo de programadores usando Python y Flask. ¡Es un placer ayudarte!'
    },
    'hora': {
        'palabras': ['qué hora es', 'dime la hora', 'hora actual', 'qué horas son'],
        'respuesta': lambda: f'La hora actual es: {datetime.now().strftime("%H:%M")}'
    },
    'fecha': {
        'palabras': ['qué día es hoy', 'fecha actual', 'qué fecha es hoy', 'en qué fecha estamos'],
        'respuesta': lambda: f'Hoy es {datetime.now().strftime("%d/%m/%Y")}'
    },
    'ayuda': {
        'palabras': ['qué puedes hacer', 'para qué sirves', 'ayuda', 'funciones', 'qué ofreces'],
        'respuesta': 'Puedo ayudarte con: información general, hora y fecha, responder preguntas básicas, recomendaciones y más. ¿En qué necesitas ayuda?'
    },
    'clima': {
        'palabras': ['clima', 'tiempo', 'temperatura', 'hace calor', 'hace frío', 'está lloviendo'],
        'respuesta': 'Actualmente no tengo acceso a datos meteorológicos en tiempo real. ¿Te gustaría que te recomiende cómo verificar el clima?'
    },
    'recomendaciones': {
        'palabras': ['recomiéndame', 'sugerencia', 'qué me recomiendas', 'ideas', 'consejo'],
        'respuesta': 'Puedo recomendarte: libros, películas, música o lugares para visitar. ¿Qué tipo de recomendación buscas?'
    },
    'libros': {
        'palabras': ['libro', 'libros', 'leer', 'recomiéndame un libro', 'qué libro leer'],
        'respuesta': 'Algunos libros recomendados: "Cien años de soledad", "El principito", "1984", "El arte de la guerra". ¿Te interesa algún género en particular?'
    },
    'peliculas': {
        'palabras': ['pelicula', 'películas', 'ver una película', 'recomiéndame una película', 'cine'],
        'respuesta': 'Excelentes opciones: "El Padrino", "Interestelar", "Parásitos", "El viaje de Chihiro". ¿Prefieres algún género específico?'
    },
    'musica': {
        'palabras': ['música', 'canción', 'banda', 'artista', 'recomiéndame música'],
        'respuesta': 'Puedo sugerirte artistas como: The Beatles, Queen, Bad Bunny, Taylor Swift. ¿Qué género musical prefieres?'
    },
    'restaurantes': {
        'palabras': ['comer', 'restaurante', 'hambre', 'dónde comer', 'recomiéndame un lugar para comer'],
        'respuesta': 'Depende de tu ubicación. ¿Te gustaría comida italiana, mexicana, japonesa o de otro tipo?'
    },
    'chiste': {
        'palabras': ['cuéntame un chiste', 'dime algo gracioso', 'chiste', 'broma'],
        'respuesta': '¿Sabes por qué los programadores confunden Halloween con Navidad? Porque Oct 31 == Dec 25. 😄'
    },
    'programacion': {
        'palabras': ['python', 'flask', 'programar', 'código', 'desarrollo web', 'javascript'],
        'respuesta': 'Puedo hablar sobre programación. Este chatbot está construido con Python y Flask. ¿Tienes alguna pregunta específica sobre desarrollo?'
    },
    'default': {
        'respuesta': 'No estoy seguro de entender completamente. ¿Podrías reformular tu pregunta o preguntarme algo diferente?'
    }
}

def obtener_respuesta(mensaje):
    mensaje = mensaje.lower()
    
    for categoria, contenido in reglas_chatbot.items():
        if categoria == 'default':
            continue
            
        if 'palabras' in contenido:
            for palabra in contenido['palabras']:
                if palabra in mensaje:
                    if callable(contenido['respuesta']):
                        return contenido['respuesta']()
                    return contenido['respuesta']
    
    return reglas_chatbot['default']['respuesta']

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/enviar_mensaje', methods=['POST'])
def enviar_mensaje():
    datos = request.get_json()
    mensaje_usuario = datos['mensaje']
    respuesta_bot = obtener_respuesta(mensaje_usuario)
    
    return jsonify({
        'usuario': mensaje_usuario,
        'bot': respuesta_bot
    })

if __name__ == '__main__':
    app.run(debug=True)