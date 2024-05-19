//função verificar cpf ja esta cadastrado no sistema
async function ValidarCPFServer(cpf) {
    const dataJSON = JSON.stringify({ "USU_CPF": cpf });
    console.log(dataJSON)
    try {
        $(".loading").css("display", "flex");

        const response = await fetch('http://localhost:9000/validacaoCpf', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        console.log(isOk)

        if (isOk['mensagem'] == 'erro') {
            console.log('CPF válido:', cpf);
            $(".loading").css("display", "none")
            $('.forminfos').addClass("mostrarFormInfos")
            $('.infosContainer').css("justify-content", "normal")
            $('.formcpf').css("display", "none")

        } else {
            console.log('CPF já cadastrardo');
            $("#CampoCPF").css("border-color", 'red')
            $(".msgErro").css("display", "flex")
            $(".loading").css("display", "none")
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}

//Pagina cadatrar animação proximo
function validaCamposInfos() {
    let preenchido = true;
    $(".forminfos input").each(function () {
        if ($(this).val() == "" && !$(this).hasClass("opcional")) {
            preenchido = false;
            $(this).parent("div").css("border-color", 'red')
        }

        if ($(this).parent("div").css("border-color") === 'rgb(255, 0, 0)') {
            preenchido = false;
        }
    })
    return preenchido
}

function validaCamposCep() {
    let preenchido = true;
    $(".forminfosAddress input").each(function () {
        if ($(this).val() == "" && !$(this).hasClass("opcional")) {
            preenchido = false;
            $(this).parent("div").css("border-color", 'red')
        }

        if ($(this).parent("div").css("border-color") === 'rgb(255, 0, 0)') {
            preenchido = false;
        }
    })
    return preenchido
}

function validaCamposCPF() {
    let preenchido = true;
    $(".formcpf input").each(function () {
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

function validaCamposSenha() {
    let preenchido = true;
    $(".formsenha input").each(function () {
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

$('#btnNextInfos').click(function () {
    const camposOk = validaCamposCPF();

    if (camposOk) {
        $(".loading").css("display", "flex")

        const cpf = $('#CampoCPF').val();
        console.log(cpf)
        ValidarCPFServer(cpf)
        // $(".loading").css("display", "none")
        // $('.forminfos').css("display", "flex")
        // $('.formcpf').css("display", "none")
    }
});

$('#btnNextCep').click(function () {
    const camposOk = validaCamposInfos();

    if (camposOk) {
        $(".loading").css("display", "flex")

        setTimeout(function () {
            $(".loading").css("display", "none")
            $('.forminfos').css("display", "none")
            $('.forminfosCep').css("display", "block")
            $('.infosContainer').css("justify-content", "center")
        }, 2000)
    }
});

$('#btnNextSenha').click(function () {
    const camposOk = validaCamposCep();

    if (camposOk) {
        $(".loading").css("display", "flex")

        setTimeout(function () {
            $(".loading").css("display", "none")
            $('.forminfosCep').css("display", "none")
            $('.formsenha').css("display", "block")
            $('.infosContainer').css("justify-content", "center")
        }, 2000)
    }
});

//Realizando o cadastro do usuario
function CriptografarSenha(senha) {
    senhaCriptografada = CryptoJS.SHA256(senha).toString()
    return senhaCriptografada
}

function buscaDados() {
    const campos = {
        USU_EMAIL: "",
        USU_SENHA_ACESSO: "",
        USU_CPF: "",
        USU_NOME: "",
        USU_DATA_NASC: "",
        USU_TELEFONE: "",
        USU_CEP: "",
        USU_LOGRADOURO: "",
        USU_NUM_ENDERECO: "",
        USU_BAIRRO: "",
        USU_CIDADE: "",
        USU_UF: "",
        USU_COMPLEMENTO: ""
    }

    $(".formulario .obrig").each(function () {
        const inputName = $(this).attr("name");
        const inputValue = $(this).val();

        if (inputValue !== "") {
            campos[inputName] = inputValue
            if (inputName === "USU_SENHA_ACESSO") {
                const senhaCriptografada = CriptografarSenha(inputValue);
                campos[inputName] = senhaCriptografada;
            }
        }
    });

    return JSON.stringify(campos)
}

$("#btnNextCadastrar").click(async function (event) {
    event.preventDefault()
    const camposOk = validaCamposSenha();

    if (camposOk) {
        const dataJSON = buscaDados();
        console.log(dataJSON)
        try {
            $(".loading").css("display", "flex");

            const response = await fetch('http://localhost:9000/cadastro', {
                method: 'POST',
                body: dataJSON,

            });

            const isOk = JSON.parse(await response.text());
            console.log(isOk)

            if (isOk['mensagem'] == 'ok') {
                console.log('Cadastrado');
                //Mensagem de SUCESSO e botão para entrar.

            } else {
                console.log('Erro aou cadastrar');
            }

        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
})
