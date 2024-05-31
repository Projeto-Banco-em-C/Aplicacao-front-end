var idthread
var idrun
var message_id

var chaveAuthorization = "APIKEY"

//iniciaIA()

async function iniciaIA() {
    const url = "https://api.openai.com/v1/threads";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2",
                "Authorization": chaveAuthorization,
                "Cookie": "__cf_bm=x4OJ0044mYgQl0seb1imv0V2utQqLWkrpXeXaT4va9o-1717088164-1.0.1.1-Fh8_79XlqYgGvmDBY13FbIJSPt4iRgM_PJNp5_TTst11Gqsky0NqHB1TT.N6NRBnwxpCfEwnzayAjWxwCMJpeA; _cfuvid=AjLvjVPj6.FVQkIWIByYJHzzI1emjxLueN_cVzKNeYo-1717085831005-0.0.1.1-604800000"
            },
            timeout: 0
        });

        const isOk = await response.json();
        idthread = isOk.id

        console.log("IA Iniciada")

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}


$('.btnMandaIA').click(function () {
    const mensagemUser = $("#msgIAinput").val()
    console.log(mensagemUser)

    //sendMessage(mensagemUser)

    let projeto = `
        <div class="msgUer">
            <div class="cardMsgIa">
                <div class="txtCms">
                    <div class="cardMsgUser">
                        <h1 class="emsgUser">${mensagemUser}</h1>
                    </div>
                </div>
            </div>
        </div>
    `
    $(".infosmsg").append(projeto);
});


async function sendMessage(msg) {
    const url = `https://api.openai.com/v1/threads/${idthread}/messages`;
    const dataJSON = {
        "role": "user",
        "content": msg
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2",
                "Authorization": chaveAuthorization,
                "Cookie": "__cf_bm=x4OJ0044mYgQl0seb1imv0V2utQqLWkrpXeXaT4va9o-1717088164-1.0.1.1-Fh8_79XlqYgGvmDBY13FbIJSPt4iRgM_PJNp5_TTst11Gqsky0NqHB1TT.N6NRBnwxpCfEwnzayAjWxwCMJpeA; _cfuvid=AjLvjVPj6.FVQkIWIByYJHzzI1emjxLueN_cVzKNeYo-1717085831005-0.0.1.1-604800000"
            },
            body: JSON.stringify(dataJSON)
        });

        CreateRun()

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}

async function CreateRun() {
    const url = `https://api.openai.com/v1/threads/${idthread}/runs`;
    const dataJSON = {
        "assistant_id": "asst_v3VcH1nQFWhPZ7zkov9OzpOZ"
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2",
                "Authorization": chaveAuthorization,
                "Cookie": "__cf_bm=x4OJ0044mYgQl0seb1imv0V2utQqLWkrpXeXaT4va9o-1717088164-1.0.1.1-Fh8_79XlqYgGvmDBY13FbIJSPt4iRgM_PJNp5_TTst11Gqsky0NqHB1TT.N6NRBnwxpCfEwnzayAjWxwCMJpeA; _cfuvid=AjLvjVPj6.FVQkIWIByYJHzzI1emjxLueN_cVzKNeYo-1717085831005-0.0.1.1-604800000"
            },
            body: JSON.stringify(dataJSON)
        });

        const isOk = await response.json();
        idrun = isOk.id

        RunRetrive()

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}

async function RunRetrive() {
    var completo = false
    const url = `https://api.openai.com/v1/threads/${idthread}/runs/${idrun}`;
    while (completo == false) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "OpenAI-Beta": "assistants=v2",
                    "Authorization": chaveAuthorization,
                    "Cookie": "__cf_bm=x4OJ0044mYgQl0seb1imv0V2utQqLWkrpXeXaT4va9o-1717088164-1.0.1.1-Fh8_79XlqYgGvmDBY13FbIJSPt4iRgM_PJNp5_TTst11Gqsky0NqHB1TT.N6NRBnwxpCfEwnzayAjWxwCMJpeA; _cfuvid=AjLvjVPj6.FVQkIWIByYJHzzI1emjxLueN_cVzKNeYo-1717085831005-0.0.1.1-604800000"
                }
            });

            const isOk = await response.json();

            if (isOk.status == 'completed') {
                completo = true
                console.log("achou")
            } else {
                setTimeout(function () {
                    console.log("procurando")
                }, 100)
            }

            console.log("fora")

        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }

    RunSteps()

}

async function RunSteps() {
    const url = `https://api.openai.com/v1/threads/${idthread}/runs/${idrun}/steps`;
    try {
        console.log("aqui runSteps")
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2",
                "Authorization": chaveAuthorization,
                "Cookie": "__cf_bm=x4OJ0044mYgQl0seb1imv0V2utQqLWkrpXeXaT4va9o-1717088164-1.0.1.1-Fh8_79XlqYgGvmDBY13FbIJSPt4iRgM_PJNp5_TTst11Gqsky0NqHB1TT.N6NRBnwxpCfEwnzayAjWxwCMJpeA; _cfuvid=AjLvjVPj6.FVQkIWIByYJHzzI1emjxLueN_cVzKNeYo-1717085831005-0.0.1.1-604800000"
            }
        });

        const isOk = await response.json();

        message_id = isOk.data[0].step_details.message_creation.message_id;

        console.log("aqui runSteps fim")
        MessageReply()


    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}

function removerFormatacaoMarkdown(textoMarkdown) {
    textoMarkdown = textoMarkdown.replace(/^#+\s+/gm, ''); // Remove títulos Markdown (## Título)
    textoMarkdown = textoMarkdown.replace(/(\*{1,2}|_{1,2})(.*?)\1/g, '$2'); // Remove ênfases Markdown (**texto** ou *texto*)
    textoMarkdown = textoMarkdown.replace(/^([\*\-\+]|(?:\d+\.))\s+/gm, ''); // Remove listas Markdown (* item ou 1. item)
    textoMarkdown = textoMarkdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'); // Remove links Markdown ([texto](URL))
    return textoMarkdown;
}

async function MessageReply() {
    const url = `https://api.openai.com/v1/threads/${idthread}/messages/${message_id}`;
    try {
        console.log("aqui MessageReply")
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2",
                "Authorization": chaveAuthorization,
                "Cookie": "__cf_bm=x4OJ0044mYgQl0seb1imv0V2utQqLWkrpXeXaT4va9o-1717088164-1.0.1.1-Fh8_79XlqYgGvmDBY13FbIJSPt4iRgM_PJNp5_TTst11Gqsky0NqHB1TT.N6NRBnwxpCfEwnzayAjWxwCMJpeA; _cfuvid=AjLvjVPj6.FVQkIWIByYJHzzI1emjxLueN_cVzKNeYo-1717085831005-0.0.1.1-604800000"
            }
        });

        const isOk = await response.json();

        const MessageIA = isOk.content[0].text.value

        const MessageIAFormata = MessageIA.replace(/\n/g, "<br>");

        const MsgFormatada = removerFormatacaoMarkdown(MessageIAFormata)

        console.log("mansgem" + MessageIA)
        console.log("mansgem formatada antiga" + MessageIAFormata)
        console.log("mansgem formatada" + MsgFormatada)


        let projeto = `
            <div class="msgIA">
                <div class="cardMsgIa">
                    <div class="menuUserIconIA">
                        <h1 id="fotoPerfilMenu">IA</h1>
                    </div>
                    <div class="cardMsg ias">
                        <h1>${MsgFormatada}</h1>
                    </div>
                </div>  
            </div>  
        `
        $(".infosmsg").append(projeto);

        console.log("aqui MessageReply fim")

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}