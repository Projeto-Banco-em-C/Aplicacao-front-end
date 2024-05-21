///////////////////////////////////////////////////
//AQUI OTARIO
/////////////////
//LEMBRAR DE VALIDA HORA COM JS PARA MANDAR VALOR DO PIX

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

    teste("#chaveRecebida");
});

function teste(elemento) {
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
//api





//dados na tela

// for (let j = 1; j < 13; j++) {
//     let projeto = `
//         ${titulos[j - 1]}

//     `
//     $('.cards').append(projeto);
// }
