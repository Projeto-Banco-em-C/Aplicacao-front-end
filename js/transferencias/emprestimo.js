var usuId = localStorage.getItem('USU_ID');
var DadosComprovante = {
    valordoRecebido: "",
    nomeComp: "",
    cpfComp: "",
    agenciaComp: "",
    contaComp: "",
    emprestimoUserDisponivel: "",
    qtdparcelas: "",
    qtdnumParcelas: ""
};

var taxasJuros = [0.0459, 0.0597, 0.0733, 0.0866, 0.0996, 0.1124, 0.1250, 0.1373, 0.1493, 0.1612, 0.1728];


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

    DadosComprovante.qtdparcelas = texto

    var numeroAntesDoX = texto.split(' x ')[0];
    DadosComprovante.qtdnumParcelas = numeroAntesDoX
});


async function PegarDadosUser(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".areaEmprestimo").addClass("skeletonLoading")
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
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}
PegarDadosUser(usuId)

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
    $(".alinhaOp").empty()
    juros()
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

//colocar parcelas e juros

function juros() {
    const valordigitado = $("#valorEmpr").val()

    if (valordigitado == "") {
        let options = `
            <div class="erroparcelas">
                <p>Insira o valor acima para visualizar as parcelas!</p>
            </div>
        `;
        $(".alinhaOp").append(options);
    } else {
        $(".alinhaOp").empty()

        console.log("valor" + valordigitado);
        let valorOriginal = parseFloat(valordigitado);

        for (let i = 2; i <= 12; i++) {
            let taxa = taxasJuros[i - 2];
            let valorParcela = valorOriginal * (1 + taxa) / i;
            let options = `
                <div class="itensOptions">
                    <p>${i} x <span>${valorParcela.toFixed(2)}</span> com juros de ${(taxa * 100).toFixed(2)}%</p>
                </div>
            `;
            $(".alinhaOp").append(options);
        }
    }
}

juros()

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
            const response = await fetch(ipServer + 'login', {
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
    const qtdp = DadosComprovante.qtdnumParcelas
    const jurosmensal = (taxasJuros[qtdp - 2] * valordoRecebido) / qtdp
    const jurosmensalArredondado = jurosmensal.toFixed(2);

    console.log(jurosmensalArredondado)

    //data atual
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    var year = today.getFullYear();

    var dataformatada = day + "/" + month + "/" + year

    const camposOk = validaCamposSenha();
    if (camposOk) {
        const dataJSON = JSON.stringify(
            {
                "USU_ID": idUser,
                "EMP_VALOR_TOTAL": valordoRecebido,
                "EMP_NUM_PARCELAS": qtdp,
                "EMP_JURUS_MENSAL": jurosmensalArredondado,
                "EMP_DATA_INICIO": dataformatada
            });
        try {
            const response = await fetch(ipServer + 'adicionar_emprestimo', {
                method: 'POST',
                body: dataJSON,
            });

            const isOk = JSON.parse(await response.text());

            if (isOk['mensagem'] == 'emprestimo cadastrado') {
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
            } else {
                window.location.href = "../erros.html";
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



// ver emprestimos 

async function VerContatos(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".elementosContatos").css("display", 'flex');
        $(".noContacts").css("display", 'none');
        $(".elementosContatos").addClass("skeletonLoading")

        const response = await fetch(ipServer + 'lista_emprestimo', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        if (isOk['mensagem'] == 'nao possui emprestimos') {
            $(".noContacts").css("display", 'flex');
            $(".elementosContatos").css("display", 'none');

        } else {
            $(".elementosContatos").empty();
            const contatos = Array.isArray(isOk) ? isOk : [isOk];

            contatos.forEach((contato) => {
                console.log('contato', JSON.stringify(contato))
                const valor = Number(contato.EMP_VALOR_TOTAL);
                const valorconvertido = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                const data = contato.EMP_DATA_INICIO;
                const parcelaAtual = contato.EMP_NUM_PARCELAS_PAGAS;
                const parcelasToal = contato.EMP_NUM_PARCELAS;

                let projeto = `
                    <div class="contatoCe sl">
                        <div class="elementosCce">
                            <div class="infosCce">
                                <h1>Empréstimo realizado</h1>
                                <p>Realizado em: <span>${data}</span></p>
                                <p>Parcelas: <span>${parcelaAtual}</span> de <span>${parcelasToal}</span></p>
                            </div>
                        </div>

                        <h1>${valorconvertido}</h1>
                    </div>
                `;
                $('.elementosContatos').append(projeto);
            })

            $(".elementosContatos").removeClass("skeletonLoading");
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
        $(".noContacts").css("display", 'flex');
        $(".elementosContatos").css("display", 'none');
    }
}

VerContatos(usuId)