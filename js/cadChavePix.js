var usuId = localStorage.getItem('USU_ID');

async function VerChavePix(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".elementosContatos").css("display", 'flex');
        $(".noContacts").css("display", 'none');
        $(".elementosContatos").addClass("skeletonLoading")

        const response = await fetch(ipServer + 'lista_chave_pix', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        if (isOk['mensagem'] == 'erro') {
            $(".noContacts").css("display", 'flex');
            $(".elementosContatos").css("display", 'none');
            console.log("aqui porra")

        } else {
            console.log("aqui porra2")
            $(".elementosContatos").empty();
            const contatos = Array.isArray(isOk) ? isOk : [isOk];

            contatos.forEach((contato) => {
                console.log('contato', JSON.stringify(contato))
                const chavePix = contato.CHA_CODIGO;

                let projeto = `
                    <div class="contatoCe sl">
                        <div class="elementosCce">
                            <div class="infosCce">
                                <h1>Chave Pix:</h1>
                            <p><span>${chavePix}</span></p>
                        </div>
                        </div>
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

VerChavePix(usuId)


function validaCamposChavepix(elemento) {

    let preenchido = true;
    if ($("#chaveRecebida").val() == "") {
        preenchido = false;
        $("#chaveRecebida").parent("div").css("border-color", 'red');
    }
    $(elemento).parent("div").css("border-color", '#121212');

    $(".msgErroChavePix").css("display", "none")
    return preenchido

}

$("#btnCadastrarChavePix").click(function () {
    const chavePix = $("#chaveRecebida").val()
    cadastraChavePix(chavePix, usuId)
})

async function cadastraChavePix(chavePix, id) {
    const camposOk = validaCamposChavepix();
    if (camposOk) {
        const dataJSON = JSON.stringify({ "USU_ID": id, "CHA_CODIGO": chavePix });
        $(".loading").css("display", "flex")
        try {
            const response = await fetch(ipServer + 'adicionar_chave_pix', {
                method: 'POST',
                body: dataJSON,
            });

            const isOk = JSON.parse(await response.text());
            if (isOk['mensagem'] == 'chave pix adicionada') {
                $(".loading").css("display", "none")
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Chave Pix cadastrada",
                    showConfirmButton: false,
                    timer: 1000
                });

            } else if (isOk['mensagem'] == 'pix ja existente') {
                $("#chaveRecebida").parent("div").css("border-color", 'red');
                $(".msgErroChavePix").css("display", "flex")
                $(".loading").css("display", "none")
            }

        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
}


//selectpersonalizado
$(".inputOrgPensonalizado").click(function () {
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