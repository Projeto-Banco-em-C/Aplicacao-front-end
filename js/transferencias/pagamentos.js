var usuId = localStorage.getItem('USU_ID');

var DadosComprovante = {
    valordoRecebido: "",
    nomeCompDest: "",
    cpfCompDest: "",
    nomeComp: "",
    cpfComp: "",
    agenciaComp: "",
    contaComp: "",
    IDUserChave: "",
    IDDestino: "",
    agenciaCompDest: "",
    contaCompDest: "",
    dataValida: "",
    saldoUser: ""
};

function validaCamposAreaPeg() {
    let preenchido = true;

    if ($("#codBarras").val() == "") {
        preenchido = false;
        $("#codBarras").parent("div").css("border-color", 'red');
    }
    if ($("#codBarras").parent("div").css("border-color") === 'rgb(255, 0, 0)') {
        preenchido = false;
    }

    return preenchido
}

function validaCampoPag(elemento) {
    let inputParent = $(elemento).parent('.inputOrg')
    inputParent.css("border-color", "#121212");
    $(".msgErroPag").css("display", "none")
    $(".msgErroPagDigito").css("display", "none")
}


$('#btnPagCodigodeBarras').click(function () {
    const camposOk = validaCamposAreaPeg();

    if (camposOk) {
        const codigodeBarras = $('#codBarras').val();
        const digitoOK = ValidarDigito(codigodeBarras)
        if (digitoOK) {
            PegarDadosCodigodeBarra(codigodeBarras)
        } else {
            $("#codBarras").parent("div").css("border-color", 'red');
            $(".msgErroPagDigito").css("display", "flex")
        }
    }
});

function ValidarDigito(code) {
    // var campos = quebrarCodigoBarras(code)
    var campos = (code.replace(/\./g, '')).split(' ');
    var j = 0
    for (let i = 0; i < 3; i++) {
        var campoAtual = campos[i].split('').map(char => parseInt(char))
        var soma = 0
        for (let k = 0; k < campoAtual.length - 1; k++) {
            const valor = ((j % 2) ? 1 : 2) * campoAtual[k]
            soma += Math.floor(valor / 10) + valor % 10
            j++
        }
        if (10 - (soma % 10) != campoAtual[campoAtual.length - 1]) return false
    }
    return true
}

/// funções pegar dados do codigo de barras
function PegarDadosCodigodeBarra(codigobarras) {
    var campos = quebrarCodigoBarras(codigobarras)
    var informacoes = extrairInformacoes(campos)
    var dataVencimento = converterFatorParaData(informacoes.fatorVencimento)
    var valorFormatado = formatarValor(informacoes.valor)

    console.log("Agência: " + informacoes.agencia)
    console.log("Conta: " + informacoes.conta)
    console.log("Data de Vencimento: " + dataVencimento)
    console.log("Valor: " + valorFormatado)

    ValidarContaPag(informacoes.agencia, informacoes.conta, valorFormatado, dataVencimento)
}

function quebrarCodigoBarras(codigo) {
    var campos = codigo.split(' ');
    return {
        campo1: campos[0],
        campo2: campos[1],
        campo3: campos[2],
        campo4: campos[3],
        campo5: campos[4]
    };
}

// Função para extrair as informações dos campos
function extrairInformacoes(campos) {
    var agencia = campos.campo1.split('.')[1].substring(0, 4); //CCCC no campo1
    var conta = campos.campo2.split('.')[1].substring(0, 5); //DDDDD no campo2
    var fatorVencimento = campos.campo5.substring(0, 4); // UUUU no campo5
    var valor = campos.campo5.substring(4); // VVVVVVVVVV no campo5
    return {
        agencia: agencia,
        conta: conta,
        fatorVencimento: fatorVencimento,
        valor: valor
    };
}

// Função para converter o fator de vencimento para uma data
function converterFatorParaData(fator) {
    var dataBase = new Date(1997, 9, 7); // Data base: 07/10/1997
    dataBase.setDate(dataBase.getDate() + parseInt(fator));
    return dataBase.toLocaleDateString('pt-BR');
}

// Função para formatar o valor
function formatarValor(valor) {
    var valorFormatado = (parseInt(valor) / 100).toFixed(2);
    return valorFormatado.replace(".", ",");
}
/// fim das funções pegar dados

//valida se aconta existe 
async function ValidarContaPag(agencia, conta, valor, validade) {
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
            $(".msgErroPag").css("display", "flex")
            $("#codBarras").parent("div").css("border-color", 'red');
        } else {
            console.log('Certo');
            $(".areaPagamentos, .loading").hide();
            $(".confirmaInfos").css("display", "flex");

            const { USU_NOME: nomeUserChave, USU_ID: IDUserChave, USU_CPF: CpfserChave } = isOk;
            const agenciaUser = agencia;
            const contaUser = conta;
            const valordoRecebido = valor;
            const dataValida = validade;

            preencheDadosUserPag(nomeUserChave, agenciaUser, contaUser, valordoRecebido, dataValida);

            Object.assign(DadosComprovante, {
                nomeCompDest: nomeUserChave,
                agenciaCompDest: agenciaUser,
                contaCompDest: contaUser,
                cpfCompDest: CpfserChave,
                IDUserChave,
                valordoRecebido,
                dataValida
            });
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
        //window.location.href = "../erros.html";
    }

}

function preencheDadosUserPag(nome, gencia, conta, valor, dataValida) {
    //tela confirma infos
    var iniciaisICf = obterIniciais(nome);
    $("#fotoPerfilICf").text(iniciaisICf)

    $("#nomeUserCheveICf").text(nome)
    $("#agenciaInfos").text(gencia)
    $("#contaInfos").text(conta)
    $("#dataValidInfos").text(dataValida)

    const emprDisFormatado = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    const formattedValue = emprDisFormatado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


    $("#valorDaConta").text(formattedValue)
}

//pegar dados user
async function PegarDadosUser(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".areaValor").addClass("skeletonLoading")
        const response = await fetch(ipServer + 'dados', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        if (isOk['mensagem'] == 'erro') {
            console.log('ERRO');
            window.location.href = "../erros.html";
        } else {
            console.log('Certo');
            const nomeUserAtual = isOk.USU_NOME
            const cpfUserAtual = isOk.USU_CPF
            const agenciaUserAtual = isOk.USU_NUM_AGENCIA
            const contaUserAtual = isOk.USU_NUM_CONTA
            const saldoUserAtual = isOk.USU_SALDO

            $('#userNameMenu').text(isOk.USU_NOME)
            const iniciais = obterIniciais(isOk.USU_NOME)
            $('#fotoPerfilMenu').text(iniciais)

            DadosComprovante.nomeComp = nomeUserAtual
            DadosComprovante.cpfComp = cpfUserAtual
            DadosComprovante.agenciaComp = agenciaUserAtual
            DadosComprovante.contaComp = contaUserAtual
            DadosComprovante.saldoUser = saldoUserAtual
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}
PegarDadosUser(usuId)


//confima infos
$("#btnPedirSenha").click(function () {
    const saldouser = DadosComprovante.saldoUser
    const valordoboleto = parseFloat(DadosComprovante.valordoRecebido.replace(/\./g, '').replace(',', '.'))

    console.log(saldouser, valordoboleto)

    if (saldouser < valordoboleto) {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Saldo insuficiente",
            text: "Seu saldo não é suficiente para realizar o pagamento!",
            showConfirmButton: false,
            timer: 2000
        });
    } else {
        $(".confirmaInfos").css("display", 'none');
        $(".pedesenha").css("display", 'flex');
    }

})

//tela senha
function validaCamposSenha(elemento) {
    let preenchido = true;

    if ($("#confirmSenha").val() == "") {
        preenchido = false;
        $("#confirmSenha").parent("div").css("border-color", 'red');
    }

    $(elemento).parent("div").css("border-color", '#121212');

    return preenchido
}

function CriptografarSenha(senha) {
    senhaCriptografada = CryptoJS.SHA256(senha).toString()
    return senhaCriptografada
}

$("#btnConfirmaPagamento").click(function () {
    var usuCPF = localStorage.getItem('USU_CPF');
    var senhaUserS = $("#confirmSenha").val()

    const senhaCriptografada = CriptografarSenha(senhaUserS);
    const thisValorFormatodo = parseFloat(DadosComprovante.valordoRecebido.replace(/\./g, '').replace(',', '.'))

    confirmarSenhaServerPag(usuCPF, DadosComprovante.IDUserChave, senhaCriptografada, thisValorFormatodo)

    console.log(usuId, DadosComprovante.IDUserChave, thisValorFormatodo)
})

async function confirmarSenhaServerPag(chavePix, idDestino, senha, thisValorFormatodo) {
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
                realizarPagamento(usuId, idDestino, thisValorFormatodo)
            } else if (isOk['mensagem'] == 'senha incorreta') {
                $("#confirmSenha").parent("div").css("border-color", 'red');
                $("#msgErroSenha").css("display", "flex")
            }

        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
}

async function realizarPagamento(idUser, idDestino, valordoRecebido) {
    const camposOk = validaCamposSenha();
    if (camposOk) {
        const dataJSON = JSON.stringify(
            { "USU_ID": idUser, "USU_ID_DESTINO": idDestino, "USU_SALDO": valordoRecebido, "TRAN_TIPO": "PAGAMENTO" }
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
                    title: "Pagamento realizado",
                    showConfirmButton: false,
                    timer: 1000
                });
                setTimeout(function () {
                    $(".pedesenha").css("display", 'none');
                    $(".comprovante").css("display", 'flex');
                    dadosdoComprovantePagamento()
                }, 1100)
            } else if (isOk['mensagem'] == 'erro id repitido') {
                window.location.href = "../erros.html";
            } else {
                // window.location.href = "../erros.html";
                console.log("loucura")
            }
        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
}

function dadosdoComprovantePagamento() {

    $("#valorComp").text(DadosComprovante.valordoRecebido)
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


    $("#datavalidade").text(DadosComprovante.dataValida)
}

//comprovante

$(document).ready(function () {
    $('#printButton').on('click', function () {
        printDiv('printableArea');
    });

    function printDiv(divId) {
        var divToPrint = $('#' + divId).html();
        var newWin = window.open('', 'Print-Window');

        newWin.document.open();
        newWin.document.write('<html><head><title>Imprimir</title>');

        // Copia os estilos da página principal
        $('link[rel="stylesheet"]').each(function () {
            newWin.document.write('<link rel="stylesheet" href="' + $(this).attr('href') + '">');
        });

        // Inclui estilos específicos de impressão
        newWin.document.write('<style>@media print { body { -webkit-print-color-adjust: exact; } #alinhabtn { display: none; } }</style>');

        newWin.document.write('</head><body onload="window.print()">');
        newWin.document.write(divToPrint);
        newWin.document.write('</body></html>');
        newWin.document.close();

        setTimeout(function () {
            newWin.close();
        }, 100);
    }

})

$(document).ready(function () {
    $('#codBarras').mask('00000.00000 00000.000000 00000.000000 0 00000000000000');
    $('#codBarras').attr('autocomplete', 'on');
});