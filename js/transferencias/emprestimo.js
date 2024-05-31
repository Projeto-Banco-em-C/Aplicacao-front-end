var usuId = localStorage.getItem('USU_ID');
var DadosComprovante = {
    valordoRecebido: "",
    nomeComp: "",
    cpfComp: "",
    agenciaComp: "",
    contaComp: "",
    emprestimoUserDisponivel: "",
    qtdparcelas: ""
};


$(".inputOrgPensonalizado").click(function (event) {
    event.preventDefault();
    if ($(".options").hasClass("visibility")) {
        $(".options").removeClass("visibility").addClass("hidden");
        $("#iconeArrow").text("keyboard_arrow_down");
    } else {
        $(".options").removeClass("hidden").addClass("visibility");
        $("#iconeArrow").text("keyboard_arrow_up");
    }
})

$(".options").on("click", ".itensOptions", function () {
    var texto = $(this).find("p").text();
    $("#valorAtual").text(texto);
});


async function PegarDadosUser(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".areaEmprestimo").addClass("skeletonLoading")
        const response = await fetch('http://localhost:9000/dados', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        if (isOk['mensagem'] == 'erro') {
            console.log('ERRO');
            window.location.href = "../erros.html";
        } else {
            console.log('Certo');
            $(".areaEmprestimo").removeClass("skeletonLoading")

            const nomeUserAtual = isOk.USU_NOME
            const cpfUserAtual = isOk.USU_CPF
            const agenciaUserAtual = isOk.USU_NUM_AGENCIA
            const contaUserAtual = isOk.USU_NUM_CONTA
            const emprDis = isOk.USU_LIM_EMPRESTIMO

            const emprDisFormatado = parseFloat(emprDis.replace(/\./g, '').replace(',', '.'));
            const formattedValue = emprDisFormatado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            $("#valorpEmprestimo").text(formattedValue)

            DadosComprovante.nomeComp = nomeUserAtual
            DadosComprovante.cpfComp = cpfUserAtual
            DadosComprovante.agenciaComp = agenciaUserAtual
            DadosComprovante.contaComp = contaUserAtual
            DadosComprovante.emprestimoUserDisponivel = emprDis

            var textoComp = $("#valorAtual").find("p").text();
            DadosComprovante.qtdparcelas = textoComp
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}
//PegarDadosUser(usuId)
function validaCamposEmprestimo() {
    let preenchido = true;

    if ($("#valorEmpr").val() == "") {
        preenchido = false;
        $("#valorEmpr").parent("div").css("border-color", 'red');
    }
    if ($("#valorEmpr").parent("div").css("border-color") === 'rgb(255, 0, 0)') {
        preenchido = false;
    }

    if ($("#valorAtual").text() == "") {
        preenchido = false;
        $(".inputOrgPensonalizado").css("border-color", 'red');
    }

    return preenchido
}

function validaCampoEmp(elemento) {
    let inputParent = $(elemento).parent('.inputOrg')
    inputParent.css("border-color", "#121212");
}

$("#btnEmprestimo").click(function () {
    const valordigitado = $("#valorEmpr").val()

    const valoruser = parseFloat(valordigitado.replace(/\./g, '').replace(',', '.'))
    const valoremprestimo = parseFloat(DadosComprovante.emprestimoUserDisponivel.replace(/\./g, '').replace(',', '.'))

    const camposOk = validaCamposEmprestimo();

    if (camposOk) {
        if (valoruser > valoremprestimo) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Valor não liberado",
                text: "O valor digitado não foi liberado escolha um valor melhor ou entre em contato!",
                showConfirmButton: false,
                timer: 2000
            });
        } else {
            DadosComprovante.valordoRecebido = valoruser
            $(".areaEmprestimo").css("display", 'none');
            $(".pedesenha").css("display", 'flex');
        }
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
    //const thisValorFormatodo = parseFloat(DadosComprovante.valordoRecebido.replace(/\./g, '').replace(',', '.'))

    confirmarSenhaServerPag(usuCPF, senhaCriptografada, DadosComprovante.valordoRecebido)
})

async function confirmarSenhaServerPag(cpf, senha, valor) {
    const camposOk = validaCamposSenha();
    if (camposOk) {
        const dataJSON = JSON.stringify({ "USU_CPF": cpf, "USU_SENHA_ACESSO": senha });
        try {
            const response = await fetch('http://localhost:9000/login', {
                method: 'POST',
                body: dataJSON,
            });

            const isOk = JSON.parse(await response.text());
            if (isOk['mensagem'] == 'ok') {
                realizarEmprestimo(usuId, valor)

            } else if (isOk['mensagem'] == 'senha incorreta') {
                $("#confirmSenha").parent("div").css("border-color", 'red');
                $("#msgErroSenha").css("display", "flex")
            }

        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
}

async function realizarEmprestimo(idUser, valordoRecebido) {
    const camposOk = validaCamposSenha();
    if (camposOk) {
        const dataJSON = JSON.stringify({ "USU_ID": idUser, "USU_SALDO": valordoRecebido });
        try {
            const response = await fetch('http://localhost:9000/', {
                method: 'POST',
                body: dataJSON,
            });

            const isOk = JSON.parse(await response.text());

            if (isOk['mensagem'] == 'ok') {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Emprestimo Realizado",
                    showConfirmButton: false,
                    timer: 1000
                });
                setTimeout(function () {
                    $(".pedesenha").css("display", 'none');
                    $(".comprovante").css("display", 'flex');
                    dadosdoComprovanteEmprestimo()
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

function dadosdoComprovanteEmprestimo() {
    $("#nomeComp").text(DadosComprovante.nomeComp)
    $("#cpfComp").text(DadosComprovante.cpfComp)
    $("#agenciaComp").text(DadosComprovante.agenciaComp)
    $("#contaComp").text(DadosComprovante.contaComp)
    $("#valorComp").text(DadosComprovante.valordoRecebido)
    $("#parcelasComp").text(DadosComprovante.qtdparcelas)


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



