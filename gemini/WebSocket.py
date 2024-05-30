import os
import asyncio
import websockets
import pandas as pd
import google.generativeai as genai
import funcoes as fn

# Variável para armazenar o estado do chat
chat_state = {}


async def handle_chat(websocket, path):
    GOOGLE_API_KEY="AIzaSyD0ua7Nr2v9-oVgd4QPlyBM1cWyZ8lv4ao"
    genai.configure(api_key=GOOGLE_API_KEY)

    generation_config = {
        "temperature": 1,
        "candidate_count": 1
    }
    model = "models/embedding-001"

    safety_settings = {
        "HARASSMENT": "BLOCK_NONE",
        "HATE": "BLOCK_NONE",
        "SEXUAL": "BLOCK_NONE",
        "DANGEROUS": "BLOCK_NONE"
    }

    model_2 = genai.GenerativeModel("gemini-1.0-pro",
                                safety_settings=safety_settings,
                                generation_config=generation_config)
    
    chat = model_2.start_chat(history=[])

    while True:
        try:
            # Receber mensagem do cliente
            mensagem = await websocket.recv()

            resposta = fn.conversa(mensagem=mensagem,
                                   chat=chat,
                                   model=model,
                                   safety_settings=safety_settings,
                                   generation_config=generation_config)

            # Enviar resposta para o cliente
            await websocket.send(resposta)
            
            
        except websockets.exceptions.ConnectionClosedError:
            # Lidar com o fechamento da conexão pelo cliente
            del chat_state[websocket]
            break

start_server = websockets.serve(handle_chat, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
