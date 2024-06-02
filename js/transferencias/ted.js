var usuId = localStorage.getItem('USU_ID');

var DadosComprovante = {
    valordoPixRecebido: "",
    nomeCompDest: "",
    cpfCompDest: "",
    chavePixCompDest: "",
    nomeComp: "",
    cpfComp: "",
    agenciaComp: "",
    contaComp: "",
    IDUserChave: "",
    agenciaCompDest: "",
    contaCompDest: ""
};

//mandar conta Ted
function validaValoresTed(elemento) {
    let preenchido = true;
    $(".FormPix input").each(function () {
        if ($(this).val() == "") {
            preenchido = false;
            $(this).parent("div").css("border-color", 'red');
        }
        if ($(this).parent("div").css("border-color") === 'rgb(255, 0, 0)') {
            preenchido = false;
        }
    })
    return preenchido
}

function validaAgencia(elemento) {
    let inputParent = $(elemento).parent('.inputOrg')
    inputParent.css("border-color", "#121212");
    $(".msgErroETed").css("display", "none")
}

function validaConta(elemento) {
    let inputParent = $(elemento).parent('.inputOrg')
    inputParent.css("border-color", "#121212");
    $(".msgErroETed").css("display", "none")
}

$('#btnEnviaTed').click(function () {
    const camposOk = validaValoresTed();

    if (camposOk) {
        const agencia = $('#numAgenciaId').val();
        const conta = $('#numContaId').val();

        console.log(agencia, conta)
        ValidarContaTed(agencia, conta)
    }
});

async function ValidarContaTed(agencia, conta) {
    const dataJSON = JSON.stringify({ "USU_NUM_CONTA": conta, "USU_NUM_AGENCIA": agencia });
    $(".loading").css("display", "flex")
    try {
        const response = await fetch(ipServer + 'consulta_info_conta', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        if (isOk['mensagem'] == 'conta inexistente') {
            console.log('ERRO');
            $(".loading").css("display", "none")
            $(".msgErroETed").css("display", "flex")
        } else {
            console.log('Certo');
            $(".areaTed").css("display", "none")
            $(".areaValor").css("display", "flex")
            $(".loading").css("display", "none")

            const nomeUserChave = isOk.USU_NOME
            const IDUserChave = isOk.USU_ID
            const CpfserChave = isOk.USU_CPF
            const agenciaUser = agencia
            const contaUser = conta

            preencheDadosUserTed(nomeUserChave, agenciaUser, contaUser, IDUserChave)

            DadosComprovante.nomeCompDest = nomeUserChave
            DadosComprovante.agenciaCompDest = agenciaUser
            DadosComprovante.contaCompDest = contaUser
            DadosComprovante.cpfCompDest = CpfserChave
            DadosComprovante.IDUserChave = IDUserChave

            console.log("esse_" + DadosComprovante.agenciaCompDest, DadosComprovante.contaCompDest)
        }
    } catch (error) {
        console.error('Erro Servidor:', error.message);
        //window.location.href = "../erros.html";
    }

}

function preencheDadosUserTed(nome, gencia, conta, IDUserChave) {

    $("#nomeUserCheve").text(nome)
    $("#agenciaInfos").text(gencia)
    $("#contaInfos").text(conta)
    //tela confirma infos
    var iniciaisICf = obterIniciais(nome);
    $("#fotoPerfilICf").text(iniciaisICf)

    $("#nomeUserCheveICf").text(nome)
    idDestino = IDUserChave
}

function CriptografarSenha(senha) {
    senhaCriptografada = CryptoJS.SHA256(senha).toString()
    return senhaCriptografada
}

$("#btnConfirmaTraferenciaTed").click(function () {
    var usuCPF = localStorage.getItem('USU_CPF');
    var senhaUserS = $("#confirmSenha").val()

    const senhaCriptografada = CriptografarSenha(senhaUserS);
    confirmarSenhaServerTED(usuCPF, senhaCriptografada)

    console.log(usuId, idDestino, parseFloat(valorDoPixFormatado.replace(/\./g, '').replace(',', '.')))
})

async function confirmarSenhaServerTED(chavePix, senha) {
    const camposOk = validaCamposSenha();
    if (camposOk) {
        const dataJSON = JSON.stringify({ "USU_CPF": chavePix, "USU_SENHA_ACESSO": senha });
        try {
            const response = await fetch(ipServer + 'login', {
                method: 'POST',
                body: dataJSON,
            });

            const isOk = JSON.parse(await response.text());
            if (isOk['mensagem'] == 'ok') {
                realizarTransferenciasTED(usuId, idDestino, parseFloat(valorDoPixFormatado.replace(/\./g, '').replace(',', '.')))
            } else if (isOk['mensagem'] == 'senha incorreta') {
                $("#confirmSenha").parent("div").css("border-color", 'red');
                $("#msgErroSenha").css("display", "flex")
            }

        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
}

async function realizarTransferenciasTED(idUser, idDestino, valordoPixRecebido) {
    const camposOk = validaCamposSenha();
    if (camposOk) {
        const dataJSON = JSON.stringify(
            { "USU_ID": idUser, "USU_ID_DESTINO": idDestino, "USU_SALDO": valordoPixRecebido, "TRAN_TIPO": "TED" }
        );
        try {
            const response = await fetch(ipServer + 'transferir', {
                method: 'POST',
                body: dataJSON,
            });

            const isOk = JSON.parse(await response.text());

            if (isOk['mensagem'] == 'ok') {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Transferência realizada",
                    showConfirmButton: false,
                    timer: 1000
                });
                setTimeout(function () {
                    $(".pedesenha").css("display", 'none');
                    $(".comprovante").css("display", 'flex');
                    dadosdoComprovanteTED()
                }, 1100)
            } else {
                window.location.href = "../erros.html";
            }
        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }

}

function dadosdoComprovanteTED() {
    console.log("aqui utimo" + DadosComprovante.agenciaCompDest, DadosComprovante.contaCompDest)

    $("#valorComp").text(DadosComprovante.valordoPixRecebido)
    $("#nomeCompDest").text(DadosComprovante.nomeCompDest)
    $("#cpfCompDest").text(DadosComprovante.cpfCompDest)
    $("#agenciaCompDest").text(DadosComprovante.agenciaCompDest)
    $("#contaCompDes").text(DadosComprovante.contaCompDest)
    $("#nomeComp").text(DadosComprovante.nomeComp)
    $("#cpfComp").text(DadosComprovante.cpfComp)
    $("#agenciaComp").text(DadosComprovante.agenciaComp)
    $("#contaComp").text(DadosComprovante.contaComp)


    var now = new Date();
    var dia = String(now.getDate()).padStart(2, '0');
    var mes = String(now.getMonth() + 1).padStart(2, '0'); // Os meses são base 0
    var ano = now.getFullYear();

    var dataFormatada = dia + '/' + mes + '/' + ano;

    var horas = String(now.getHours()).padStart(2, '0');
    var minutos = String(now.getMinutes()).padStart(2, '0');

    var horasFormatadas = horas + ':' + minutos;

    $("#horasComp").text(horasFormatadas);
    $("#dataComp").text(dataFormatada);
}
