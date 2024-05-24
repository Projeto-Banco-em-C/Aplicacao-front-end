var valorDoPixFormatado = 0


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


//contatos



//dados na tela

// for (let j = 1; j < 13; j++) {
//     let projeto = `
//         ${titulos[j - 1]}

//     `
//     $('.cards').append(projeto);
// }

//armazenar esses dados numa variavel global e usar nas outras telas do pix

//Tela valor

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
    });
});


async function PegarSaldo(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".areaValor").addClass("skeletonLoading")
        const response = await fetch('http://localhost:9000/dados', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        console.log(isOk)

        if (isOk['mensagem'] == 'erro') {
            console.log('ERRO');
            window.location.href = "../erros.html";
        } else {
            console.log('Certo');
            $('#meuSaldo').text(parseFloat(isOk.USU_SALDO.trim()).toLocaleString('pt-BR'));
            $(".areaValor").removeClass("skeletonLoading")
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
        //window.location.href = "../erros.html";
    }
}

var usuId = localStorage.getItem('USU_ID');
//PegarSaldo(usuId)

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
        } else {
            $(".areaValor").css("display", 'none');
            $(".confirmaInfos").css("display", 'flex');
        }
    }
})

$("#btnPedirSenha").click(function (event) {
    event.preventDefault();
    $(".confirmaInfos").css("display", 'none');
    $(".pedesenha").css("display", 'flex');

})

if ($('#Uppercase').is(':checked')) {
    //manda para api add contatos
}

// confirmSenha


$("#confirmSenha").click(function (event) {
    event.preventDefault();
    $(".pedesenha").css("display", 'none');
    $(".pedesenha").css("display", 'flex');

})


//comprovante


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

