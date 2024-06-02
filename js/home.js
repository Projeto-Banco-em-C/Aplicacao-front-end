async function PegarDados(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        const response = await fetch(ipServer + 'dados', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

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

var usuId = localStorage.getItem('USU_ID');

PegarDados(usuId)

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

$("#abrenot").click(function () {
    if ($(".cardNotfica").hasClass("visibilitylink")) {
        $(".cardNotfica").removeClass("visibilitylink")
        $(".cardNotfica").addClass("hiddenlink")

    } else {
        $(".cardNotfica").removeClass("hiddenlink")
        $(".cardNotfica").addClass("visibilitylink")
    }
});

$("#mandaparaIA").click(function () {
    window.location.href = "./suporte.html";
});



// notificação
async function VerContatos(id) {
    const dataJSON = JSON.stringify({ "USU_ID_ORIGEM": id });
    try {
        const response = await fetch(ipServer + 'extrato', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());
        if (isOk['mensagem'] === 'erro') {
            console.log("erro");

        } else {
            const contatos = Array.isArray(isOk) ? isOk : [isOk];
            const limitedContatos = contatos.slice(0, 4);
            console.log("Total de contatos recebidos:", contatos.length);

            limitedContatos.forEach((contato) => {
                const nome = contato.NOME;
                const tipo = contato.TIPO;
                const valor = contato.VALOR;
                const data = contato.DATA;
                const iniciais = obterIniciais(nome);

                // Separar a string data
                const partes = data.split('/');
                const dia = parseInt(partes[0], 10);
                const mes = parseInt(partes[1], 10) - 1;
                const mesesAbreviados = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

                let tipo1, tipo2;

                if (valor.startsWith('-')) {
                    tipo1 = "enviada";
                    tipo2 = "para";
                } else {
                    tipo1 = "recebida";
                    tipo2 = "de";
                }

                let projeto = `
                    <div class="contatoCe sl nahome">
                        <div class="elementosCce">
                            <div class="contatoIcon">
                                <h1 id="fotoPerfil">${iniciais}</h1>
                            </div>
                            <div class="infosCce">
                                <h1>Transferencia <span>${tipo}</span> <span>${tipo1}</span></h1>
                                <p><span>${tipo2} </span> <span class="nameuserex">${nome}</span></p>
                            </div>
                        </div>
                        <div class="date ${valor.startsWith('-') ? 'negativo' : 'positivo'}">
                            <h1 class="valorEx"><span>${valor.startsWith('-') ? '-' : '+'} </span>R$ ${Math.abs(valor)}</h1>
                            <p class="dataEx"><span>${dia}</span> <span>${mesesAbreviados[mes]}</span></p>
                        </div>
                    </div>   
                `;

                $('.elementoscardNotfica').append(projeto);
            });
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
        $(".noContactsEx").css("display", 'flex');
        $(".elementosEx").css("display", 'none');
    }
}

VerContatos(usuId)