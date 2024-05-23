async function PegarDados(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        const response = await fetch('http://localhost:9000/dados', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        console.log(isOk)

        if (isOk['mensagem'] == 'erro') {
            console.log('ERRO');
            window.location.href = "./erros.html";

        } else {
            console.log('Certo');
            $('#userName').text(isOk.USU_NOME.trim());
            $('#userSaldo').text(parseFloat(isOk.USU_SALDO.trim()).toLocaleString('pt-BR'));

            var nomeCompleto = isOk.USU_NOME;
            var iniciais = obterIniciais(nomeCompleto);
            $('#fotoPerfil').text(iniciais);

        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
        //window.location.href = "./erros.html";
    }
}

function obterIniciais(nomeCompleto) {
    var partesNome = nomeCompleto.trim().split(' '); // Dividindo o nome completo em partes (palavras)
    var primeiraLetraPrimeiroNome = partesNome[0].charAt(0); // Pegando a primeira letra do primeiro nome

    // Pegando a última palavra e então a primeira letra dessa palavra
    var ultimaPalavra = partesNome[partesNome.length - 1];
    var primeiraLetraUltimoNome = ultimaPalavra.charAt(0);


    var iniciais = primeiraLetraPrimeiroNome + primeiraLetraUltimoNome;

    return iniciais.toUpperCase();
}

var usuId = localStorage.getItem('USU_ID');

if (usuId !== null) {
    PegarDados(usuId)
} else {
    window.location.href = "./erros.html";
}

$("#visibility").click(function () {
    if ($(this).hasClass("visibility")) {
        $(".hiddenvalue").css("display", "flex")
        $(".userSaldo").css("display", "none")
        $(this).removeClass("visibility")
        $(this).addClass("hidden")
        $("#visiOff").removeClass("visiOff")
        $("#visiTrue").addClass("visiOff")

    } else {
        $(".hiddenvalue").css("display", "none")
        $(".userSaldo").css("display", "flex")
        $(this).removeClass("hidden")
        $(this).addClass("visibility")
        $("#visiOff").addClass("visiOff")
        $("#visiTrue").removeClass("visiOff")
    }

});


