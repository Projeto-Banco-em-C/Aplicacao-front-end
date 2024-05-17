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

    return JSON.stringify(camposLogin)
}

$("#btnLogar").click(async function (event) {
    event.preventDefault()
    const camposOk = validaCamposLogin();

    if (camposOk) {
        const dataJSON = buscaDadosLogin();
        console.log(dataJSON)
        try {
            $(".loading").css("display", "flex");

            const response = await fetch('http://localhost:9000/login', {
                method: 'POST',
                body: dataJSON,

            });
            const isOk = JSON.parse(await response.text());
            console.log(isOk)

            if (isOk['mensagem'] == 'ok') {
                console.log('Logado');
                //Mensagem de SUCESSO e botão para entrar.

            } else if (isOk['mensagem'] == 'senha incorreta') {
                console.log('senha ou email icorretos.');

            } else {
                console.log('Usuario não cadastrado.');
            }

        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
})