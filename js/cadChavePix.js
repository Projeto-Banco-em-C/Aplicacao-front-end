var usuId = localStorage.getItem('USU_ID');

async function VerChavePix(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".elementosContatos").css("display", 'flex');
        $(".noContacts").css("display", 'none');
        $(".elementosContatos").addClass("skeletonLoading")

        const response = await fetch('http://localhost:9000/lista_chave_pix', {
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
            const response = await fetch('http://localhost:9000/adicionar_chave_pix', {
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