import json
import os
import numpy as np
import pandas as pd
import google.generativeai as genai

def rotas(self,post_data_dict):
    if self.path == '/conversa':

        return conversa(post_data_dict.get("mensagem"))
        # Envie a resposta de volta para o cliente
    elif self.path == '/analisa_documentos':
        return analisa_documentos()
    else:
        # Se o endpoint não for '/teste', retorne um código de status 404 (Not Found)
        print("teste")


def conversa(mensagem,chat,model,safety_settings,generation_config):

    df = pd.read_csv(os.path.join(os.path.dirname(__file__), "dados.csv"))
    # Correção de português
    prompt2 = f"Pergunta: {mensagem} | Corrija o português sem modificar a frase, não adicione informações"

    model_3 = genai.GenerativeModel("gemini-1.0-pro",
                                  safety_settings=safety_settings,
                                  generation_config=generation_config)
    
    response = model_3.generate_content(prompt2)
    prompt2 = response.text

    trecho = gerar_e_buscar_consulta(prompt2, df, model) # Busca qual arquivo é mais proximo do contexto da mensagem

    # Estrutura a mensagem para a IA responder da melhor forma possivel
    #prompt2 = f"Prompt: {prompt2}.\n \| Se o Prompt for uma pergunta a respeito do banco use o seguinte texto como base, sem adicionar informações que não estejam contidas no texto: {trecho}\n \| Nem todo prompt tem relação com o texto, caso ele não possua relação com o texto e se trate de uma cordialidade ou amigabilidade responda-o da melhor forma possivel ignorando o texto, no caso do Prompt não se encaixar com o texto mas ter relação com o banco responda: \"Desculpa, não entendi\" "

    prompt2 = f"Você deve responder a seguinte mensagem: (|" + prompt2 + "|)\n\n Você tem que responder apenas de uma das 3 formas a seguir, sendo que a primeira é a mais importante e deve ser seguida sempre que possivel, a segunda deve ser seguida apenas quando a primeira não for possivel e a terceira quando não houver nenhuma outra.\n 1. Sempre que a mesagem tiver qualquer relação com o seguinte texto, você deve usar ele como base para gerar uma resposta precisa, formal e cordial sem adicionar informações externas ao texto. Não faça outra opção se houver a minima relação entre a perguta e o texto. Limite-se a responder a pergunta. (|" + trecho + "|)\n 2. Se a mensagem não tem relação com texto e se tratar de alguma interação humana comum como: \"Bom dia\", \"Boa tarde\", \"Oi\" e outras interações você deve responder com cordialidade e formalidade.\n 3. Se nada for possivel, então você deve reponder \"Desculpa, não entendi\".\n"

    response = chat.send_message(prompt2)

    return response.text



def HistoryToJson(history):
    dados = {
        "resposta":"teste",
        "historico": []
    }
    for linha in history:
        dados['historico'].append({"parts":linha.parts[0].text,"role":linha.role})


    
def gerar_e_buscar_consulta(consulta, df, model):
    embedding_da_consulta = genai.embed_content(model=model,
                                 content=consulta,
                                 task_type="RETRIEVAL_QUERY")["embedding"]

    #produtos_escalares = np.dot(np.stack(df["Embeddings"]), embedding_da_consulta)

    produtos_escalares = []
    df['Embeddings'] = df['Embeddings'].apply(lambda x: np.array(eval(x)))
    for embeddings in df['Embeddings']:
        resultado = np.dot(embeddings, embedding_da_consulta)
        produtos_escalares.append(resultado)

    indice = np.argmax(produtos_escalares)
    return df.iloc[indice]["Conteudo"]


def analisa_documentos():
    # Diretório onde estão os arquivos .txt
    diretorio = os.path.join(os.path.dirname(__file__), 'documentos')

    # Lista para armazenar os dados
    dados = []

    # Iterar sobre os arquivos no diretório
    for arquivo in os.listdir(diretorio):
        if arquivo.endswith('.txt'):
            # Abrir o arquivo e ler o conteúdo
            with open(os.path.join(diretorio, arquivo), 'r', encoding='utf-8') as f:
                conteudo = f.read()
            # Adicionar os dados à lista
            dados.append({'Titulo': arquivo.replace('.txt', ''), 'Conteudo': conteudo})

    # Criar DataFrame pandas
    df = pd.DataFrame(dados)
    df["Embeddings"] = df.apply(lambda row: embed_fn(row["Titulo"], row["Conteudo"]), axis=1)
    df.to_csv(os.path.join(os.path.dirname(__file__), "dados.csv"), index=False)
    # Exibir o DataFrame
    print(df)
    return json.dumps({"mensagem": "Documentos Analizados com Sucesso"})


def embed_fn(title, text):
    model = "models/embedding-001"

    GOOGLE_API_KEY="AIzaSyD0ua7Nr2v9-oVgd4QPlyBM1cWyZ8lv4ao"
    genai.configure(api_key=GOOGLE_API_KEY)
    

    return genai.embed_content(model=model,
                                 content=text,
                                 title=title,
                                 task_type="RETRIEVAL_DOCUMENT")["embedding"]