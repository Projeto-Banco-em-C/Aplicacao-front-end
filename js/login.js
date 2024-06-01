function validaCamposLogin() {
    let preenchido = true;
    $(".FormLogin input").each(function () {
        if ($(this).val() == "" && !$(this).hasClass("opcional")) {
            preenchido = false;
            $(this).parent("div").css("border-color", 'red');
        }
        if ($(this).parent("div").css("border-color") === 'rgb(255, 0, 0)') {
            preenchido = false;
        }
    })
    return preenchido
}

function CriptografarSenha(senha) {
    senhaCriptografada = CryptoJS.SHA256(senha).toString()
    return senhaCriptografada
}

function buscaDadosLogin() {
    const camposLogin = {
        USU_CPF: "",
        USU_SENHA_ACESSO: "",
    }

    $(".FormLogin .obrig").each(function () {
        const inputName = $(this).attr("name");
        const inputValue = $(this).val();

        if (inputValue !== "") {
            camposLogin[inputName] = inputValue
            if (inputName === "USU_SENHA_ACESSO") {
                const senhaCriptografada = CriptografarSenha(inputValue);
                camposLogin[inputName] = senhaCriptografada;
            }
        }

    });
    return camposLogin;
}

$("#btnLogar").click(async function (event) {
    event.preventDefault()
    const camposOk = validaCamposLogin();

    if (camposOk) {
        const camposLogin = buscaDadosLogin();
        const dataJSON = JSON.stringify(camposLogin);
        console.log("Meu json" + dataJSON)
        try {
            $(".loading").css("display", "flex");

            const response = await fetch('http://localhost:9000/login', {
                method: 'POST',
                body: dataJSON,

            });
            const isOk = JSON.parse(await response.text());
            console.log("json server" + isOk)

            if (isOk['mensagem'] == 'ok') {
                console.log('Logado');

                localStorage.setItem('USU_ID', isOk.USU_ID);
                localStorage.setItem('USU_CPF', camposLogin.USU_CPF);

                setTimeout(function () {
                    window.location.href = "./home.html";
                }, 500)

            } else if (isOk['mensagem'] == 'senha incorreta') {
                console.log('senha ou email icorretos.');
                $(".msgErroS").css("display", "flex")
                $(".loading").css("display", "none");

            } else if (isOk['mensagem'] == 'senha bloqueada') {
                $(".msgErrobloqueada").css("display", "flex")
            }
            else {
                console.log('Usuario não cadastrado.');
                $(".msgErroE").css("display", "flex")
                $(".loading").css("display", "none");
            }

        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
})


function validaCPFLo(elemento) {
    let inputParent = $(elemento).parent('.inputOrg')
    inputParent.css("border-color", "#121212");
}

function validaSenhaLo(elemento) {
    let inputParent = $(elemento).parent('.inputOrg')
    inputParent.css("border-color", "#121212");
}