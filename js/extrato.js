var usuId = localStorage.getItem('USU_ID');
async function VerContatos(id) {
    const dataJSON = JSON.stringify({ "USU_ID_ORIGEM": id });
    try {
        $(".elementosEx").css("display", 'flex');
        $(".noContactsEx").css("display", 'none');
        $(".elementosEx").addClass("skeletonLoading")

        const response = await fetch('http://localhost:9000/extrato', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());
        if (isOk['mensagem'] == 'erro') {
            $(".noContactsEx").css("display", 'flex');
            $(".elementosEx").css("display", 'none');

        } else {
            $(".elementosEx").empty();
            const contatos = Array.isArray(isOk) ? isOk : [isOk];
            contatos.forEach((contato) => {
                console.log('contato', JSON.stringify(contato))
                const nome = contato.NOME;
                const tipo = contato.TIPO
                const valor = contato.VALOR
                const data = contato.DATA
                const iniciais = obterIniciais(nome);

                // Separar a string data
                const partes = data.split('/');
                const dia = parseInt(partes[0], 10);
                const mes = parseInt(partes[1], 10) - 1;
                const mesesAbreviados = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

                let tipo1, tipo2

                if (valor.startsWith('-')) {
                    tipo1 = "enviada"
                    tipo2 = "para"

                } else {
                    tipo1 = "recebida"
                    tipo2 = "de"
                }

                let projeto = `
                    <div class="contatoCe sl">
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
                $('.elementosEx').append(projeto);
            })

            $(".elementosEx").removeClass("skeletonLoading");
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
        $(".noContactsEx").css("display", 'flex');
        $(".elementosEx").css("display", 'none');
    }
}

VerContatos(usuId)


//filtro contatos pelo nome

$(document).ready(function () {
    $('#buscafiltro').on('input', function () {
        var filtroNome = $(this).val().toLowerCase();
        var ContatosVisiveis = false;

        $('.contatoCe').each(function () {
            var contatoName = $(this).find('.nameuserex').text().toLowerCase();
            var contatoValor = $(this).find('.date .valorEx').text().toLowerCase().replace(/r\$|\s+/g, '');
            var dataValor = $(this).find('.date .dataEx').text().toLowerCase();

            if (contatoName.includes(filtroNome) || contatoValor.includes(filtroNome) || dataValor.includes(filtroNome)) {
                $(this).show();
                ContatosVisiveis = true;
            } else {
                $(this).hide();
            }
        });

        if (ContatosVisiveis) {
            $('.barra').show();
            $('.noContactsEx').hide();
        } else {
            $('.barra').hide();
            $('.noContactsEx').show();
        }
    });
});




