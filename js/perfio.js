var usuId = localStorage.getItem('USU_ID');

var Dados = {
    nome: "",
    cpf: "",
    agencia: "",
    conta: "",
    dataNac: "",
    telefone: "",
    email: "",
    cep: "",
    logradouro: "",
    numCasa: "",
    bairro: "",
    cidade: "",
    uf: "",
    complemento: "",

};

$('#fechar').click(function () {
    window.location.href = "./home.html";
});

$('#verInfos').click(function () {
    Swal.fire({
        title: "Dados pessoais",
        text: "Something went wrong!",
        showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
    });
});

async function PegarDados(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".headerPerfil").addClass("skeletonLoading")
        const response = await fetch(ipServer + 'dados', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        if (isOk['mensagem'] == 'erro') {
            //window.location.href = "../erros.html";
        } else {
            $(".headerPerfil").removeClass("skeletonLoading")
            $("#userName").text(isOk.USU_NOME)
            $("#agencia").text(isOk.USU_NUM_AGENCIA)
            $("#conta").text(isOk.USU_NUM_CONTA)

            var iniciaisICf = obterIniciais(isOk.USU_NOME);
            $("#fotoPerfil").text(iniciaisICf)


            //manda infos para obj
            Dados.nome = isOk.USU_NOME
            Dados.cpf = isOk.USU_CPF
            Dados.agencia = isOk.USU_NUM_AGENCIA
            Dados.conta = isOk.USU_NUM_CONTA
            Dados.dataNac = isOk.USU_DATA_NASC
            Dados.telefone = isOk.USU_TELEFONE
            Dados.email = isOk.USU_EMAIL
            Dados.cep = isOk.USU_CEP
            Dados.logradouro = isOk.USU_LOGRADOURO
            Dados.numCasa = isOk.USU_NUM_ENDERECO
            Dados.bairro = isOk.USU_BAIRRO
            Dados.cidade = isOk.USU_CIDADE
            Dados.uf = isOk.USU_UF
            Dados.complemento = isOk.USU_COMPLEMENTO

        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}

$(document).ready(async function () {
    await PegarDados(usuId);

    $('#verInfos').click(function () {
        Swal.fire({
            html: `
                <h1 class='titlePopup'>Seus dados pessoais</h1>
                <div class='dadosPessoais'>
                    <p>Nome: <span>${Dados.nome}</span></p>
                    <p>CPF: <span>${Dados.cpf}</span></p>
                    <p>Email: <span>${Dados.email}</span></p>
                    <p>Telefone: <span>${Dados.telefone}</span></p>
                    <p>Data de Nascimento: <span>${Dados.dataNac}</span></p>
                    <p>Agência: <span>${Dados.agencia}</span></p>
                    <p>Conta: <span>${Dados.conta}</span></p>
                </div>
                <h1 class='titlePopup'>Seus dados de endereço</h1>
                <div class='dadosPessoais'>
                    <p>CEP: <span>${Dados.cep}</span></p>
                    <p>Logradouro: <span>${Dados.logradouro}</span></p>
                    <p>Número: <span>${Dados.numCasa}</span></p>
                    <p>Bairro: <span>${Dados.bairro}</span></p>
                    <p>Cidade: <span>${Dados.cidade}</span></p>
                    <p>UF: <span>${Dados.uf}</span></p>
                    <p>Complemento: <span>${Dados.complemento}</span></p>
                </div>
            `,
            showClass: {
                popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                `
            },
            hideClass: {
                popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                `
            }
        });
    });
});

$('#sairdaconta').click(function () {
    localStorage.removeItem('USU_ID');
    localStorage.removeItem('USU_CPF');

    window.location.href = '../index.html';
});

