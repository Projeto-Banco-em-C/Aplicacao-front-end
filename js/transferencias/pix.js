var valorDoPixFormatado = 0
var usuId = localStorage.getItem('USU_ID');
var idDestino
var IsContato = false

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
};

//areaPix
//selectpersonalizado
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
    var icon = $(this).data("icon");
    var value = $(this).data("value");
    var maskClass = $(this).data("mask");

    $("#iconeAtual").text(icon);
    $("#iconeAtualPix").text(icon);
    $("#valorAtual").text(value);

    $("#chaveRecebida").val('');
    $(".options").removeClass("visibility").addClass("hidden");

    $("#chaveRecebida").removeClass("mCpf mCnpj maskTelefone semValidacao");
    if (maskClass) {
        $("#chaveRecebida").addClass(maskClass);
    }

    mudarmascara("#chaveRecebida");
});

function mudarmascara(elemento) {
    $(elemento).unmask();

    if (!$(elemento).hasClass("semValidacao")) {
        if ($(elemento).hasClass("maskTelefone")) {
            $(elemento).mask('(00) 00000-0000');
            $(elemento).attr('autocomplete', 'on');
        }
        if ($(elemento).hasClass("mCpf")) {
            $(elemento).mask('000.000.000-00', { reverse: true });
            $(elemento).attr('autocomplete', 'on');
        }
        if ($(elemento).hasClass("mCnpj")) {
            $(elemento).mask('00.000.000/0000-00');
            $(elemento).attr('autocomplete', 'on');
        }
    }
}

//mandar chave pix
function validaValoresChavePix(elemento) {
    let preenchido = true;

    if ($("#chaveRecebida").val() == "") {
        preenchido = false;
        $("#chaveRecebida").parent("div").css("border-color", 'red');
    }

    $(elemento).parent("div").css("border-color", '#121212');

    return preenchido
}

$('#btnEnviaChavePix').click(function () {
    const camposOk = validaValoresChavePix();

    if (camposOk) {
        const chavPix = $('#chaveRecebida').val();
        ValidarCPFServer(chavPix)
    }
});

async function ValidarCPFServer(chavPix) {
    const dataJSON = JSON.stringify({ "CHA_CODIGO": chavPix });
    try {
        const response = await fetch('http://localhost:9000/consulta_info_pix', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        if (isOk['mensagem'] == 'chave nao existente') {
            console.log('ERRO');

        } else {
            console.log('Certo');
            $(".areaPix").css("display", "none")
            $(".areaValor").css("display", "flex")
            const nomeUserChave = isOk.USU_NOME
            const IDUserChave = isOk.USU_ID
            const CpfserChave = isOk.USU_CPF
            const ChavePixUserChave = chavPix

            preencheDadosUserPix(nomeUserChave, ChavePixUserChave, IDUserChave)

            DadosComprovante.nomeCompDest = nomeUserChave
            DadosComprovante.chavePixCompDest = ChavePixUserChave
            DadosComprovante.cpfCompDest = CpfserChave
            DadosComprovante.IDUserChave = IDUserChave
        }
    } catch (error) {
        console.error('Erro Servidor:', error.message);
        window.location.href = "../erros.html";
    }

}

//contatos

async function VerContatos(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".elementosContatos").css("display", 'flex');
        $(".noContacts").css("display", 'none');
        $(".elementosContatos").addClass("skeletonLoading")

        const response = await fetch('http://localhost:9000/list_historico_pix', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        if (isOk['mensagem'] == 'erro') {
            $(".noContacts").css("display", 'flex');
            $(".elementosContatos").css("display", 'none');

        } else {
            $(".elementosContatos").empty();
            const contatos = Array.isArray(isOk) ? isOk : [isOk];

            contatos.forEach((contato) => {
                console.log('contato', JSON.stringify(contato))
                const nome = contato.CON_NOME;
                const chavePix = contato.CON_CHAVE;
                var iniciais = obterIniciais(nome);

                let projeto = `
                    <div class="contatoCe sl">
                        <div class="elementosCce">
                            <div class="contatoIcon">
                                <h1 id="fotoPerfil">${iniciais}</h1>
                            </div>
                            <div class="infosCce">
                                <h1>${nome}</h1>
                                <p>Chave PIX: <span>${chavePix}</span></p>
                            </div>
                        </div>
                        <button 
                            class="btnContato" 
                            onclick="mostraContato('${chavePix}')"
                            id="btnContato"
                        >
                            <span class="material-symbols-outlined">
                                arrow_forward_ios
                            </span>
                        </button>
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

function mostraContato(chavePix) {
    console.log(chavePix)
    ValidarCPFServer(chavePix)
    $(".containerchack").css("display", "none")

}

//filtro contatos pelo nome

$(document).ready(function () {
    $('#nomefiltro').on('input', function () {
        var filtroNome = $(this).val().toLowerCase();
        var ContatosVisiveis = false;

        $('.contatoCe').each(function () {
            var contatoName = $(this).find('.infosCce h1').text().toLowerCase();
            if (contatoName.includes(filtroNome)) {
                $(this).show();
                $(".barra").show();
                ContatosVisiveis = true;
            } else {
                $(this).hide();
                $(".barra").hide();
            }
        });

        if (ContatosVisiveis) {
            $('.noContacts').hide();
        } else {
            $('.noContacts').show();
        }
    });
});

VerContatos(usuId)

//areaValor
$(document).ready(function () {
    $('#valorRecebido').on('input', function () {
        var valor = $(this).val().replace(/\D/g, ''); // Remove valores não numericos characters
        if (valor.length > 2) {
            var parteInteira = valor.slice(0, -2);
            var centavos = valor.slice(-2);
        } else {
            var parteInteira = 0;
            var centavos = ('00' + valor).slice(-2);
        }

        $('#valorD').text(parseFloat(parteInteira).toLocaleString('pt-BR'));
        $('#valorC').text(centavos);

        var valorNumerico = parseFloat(valor) / 100
        valorDoPixFormatado = valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        DadosComprovante.valordoPixRecebido = valorDoPixFormatado
    });
});

//mostra dados da destinatario do pix
function preencheDadosUserPix(nome, chavePix, IDUserChave) {
    $("#nomeUserCheve").text(nome)
    $("#PixUserCheve").text(chavePix)

    var iniciais = obterIniciais(nome);
    $("#fotoPerfilArV").text(iniciais)

    //tela confirma infos
    $("#nomeUserCheveICf").text(nome)
    $("#PixUserCheveICf").text(chavePix)

    var iniciaisICf = obterIniciais(nome);
    $("#fotoPerfilICf").text(iniciaisICf)

    idDestino = IDUserChave
}

async function PegarSaldo(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".areaValor").addClass("skeletonLoading")
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
            $('#meuSaldo').text(parseFloat(isOk.USU_SALDO.trim()).toLocaleString('pt-BR'));
            $(".areaValor").removeClass("skeletonLoading")

            DadosComprovante.nomeComp = isOk.USU_NOME
            DadosComprovante.cpfComp = isOk.USU_CPF
            DadosComprovante.agenciaComp = isOk.USU_NUM_AGENCIA
            DadosComprovante.contaComp = isOk.USU_NUM_CONTA
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}
PegarSaldo(usuId)

function ValidaValor(elemento) {
    let preenchido = true;
    $(".formularios input").each(function () {
        if ($(this).val() == "") {
            preenchido = false;
            $(this).parent("div").css("border-color", 'red');
        }
        if ($(this).parent("div").css("border-color") === 'rgb(255, 0, 0)') {
            preenchido = false;
        }
    })

    $(elemento).parent("div").css("border-color", '#121212');
    $(".msgErroE").css("display", 'none');
    $(".msgErroL").css("display", 'none');
    $(".msgErroH").css("display", 'none');

    return preenchido
}

$("#btnConfirmarPix").click(function (event) {
    event.preventDefault();
    const camposOk = ValidaValor();

    if (camposOk) {
        const saldoUserFloat = parseFloat($("#meuSaldo").text().replace(/\./g, '').replace(',', '.'));
        const valorPixFloat = parseFloat($("#valorRecebido").val().replace(/\./g, '').replace(',', '.'));

        if (saldoUserFloat < valorPixFloat) {
            $("#valorRecebido").parent("div").css("border-color", 'red');
            $(".msgErroE").css("display", 'flex');
        } else if (saldoUserFloat == 0) {
            $("#valorRecebido").parent("div").css("border-color", 'red');
            $(".msgErroL").css("display", 'flex');
        }
        else {
            $(".areaValor").css("display", 'none');
            $(".confirmaInfos").css("display", 'flex');
            $("#valorDoPix").text(valorDoPixFormatado)
        }

        //verifica horar permitida
        var now = new Date();
        var hours = now.getHours();

        if (hours >= 20 || hours < 6) {
            $("#valorRecebido").parent("div").css("border-color", 'red');
            $(".msgErroH").css("display", 'flex');
        }
    }
})

//confirmaInfos
$("#btnPedirSenha").click(function (event) {
    event.preventDefault();
    $(".confirmaInfos").css("display", 'none');
    $(".pedesenha").css("display", 'flex');

    if ($('#Uppercase').is(':checked')) {
        console.log("clicado")
        cadastrarNovoContato(usuId, DadosComprovante.chavePixCompDest, DadosComprovante.nomeCompDest)
    }
})
async function cadastrarNovoContato(IdCNC, chavepixCNC, nomeCNC) {
    const dataJSON = JSON.stringify({ "USU_ID": IdCNC, "CON_CHAVE": chavepixCNC, "CON_NOME": nomeCNC });
    try {
        const response = await fetch('http://localhost:9000/adicionar_contato_pix', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());
        if (isOk['mensagem'] == 'contato cadastrado') {
            console.log("cadastrado contato")
        }
    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}

// pedesenha
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

$("#btnConfirmaTraferencia").click(function () {
    var usuCPF = localStorage.getItem('USU_CPF');
    var senhaUserS = $("#confirmSenha").val()

    const senhaCriptografada = CriptografarSenha(senhaUserS);
    confirmarSenhaServer(usuCPF, senhaCriptografada)

    console.log(usuId, idDestino, parseFloat(valorDoPixFormatado.replace(/\./g, '').replace(',', '.')))
})

async function confirmarSenhaServer(chavePix, senha) {
    const camposOk = validaCamposSenha();
    if (camposOk) {
        const dataJSON = JSON.stringify({ "USU_CPF": chavePix, "USU_SENHA_ACESSO": senha });
        try {
            const response = await fetch('http://localhost:9000/login', {
                method: 'POST',
                body: dataJSON,
            });

            const isOk = JSON.parse(await response.text());
            if (isOk['mensagem'] == 'ok') {
                realizarTransferencias(usuId, idDestino, parseFloat(valorDoPixFormatado.replace(/\./g, '').replace(',', '.')))
            } else if (isOk['mensagem'] == 'senha incorreta') {
                $("#confirmSenha").parent("div").css("border-color", 'red');
                $("#msgErroSenha").css("display", "flex")
            }

        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
}

async function realizarTransferencias(idUser, idDestino, valordoPixRecebido) {
    const camposOk = validaCamposSenha();
    if (camposOk) {
        const dataJSON = JSON.stringify(
            { "USU_ID": idUser, "USU_ID_DESTINO": idDestino, "USU_SALDO": valordoPixRecebido }
        );
        try {
            const response = await fetch('http://localhost:9000/transferir_pix', {
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
                    dadosdoComprovante()
                }, 1100)
            } else {
                window.location.href = "../erros.html";
            }
        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }

}

function dadosdoComprovante() {
    $("#valorComp").text(DadosComprovante.valordoPixRecebido)
    $("#nomeCompDest").text(DadosComprovante.nomeCompDest)
    $("#cpfCompDest").text(DadosComprovante.cpfCompDest)
    $("#chavePixCompDest").text(DadosComprovante.chavePixCompDest)
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


