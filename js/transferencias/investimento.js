var usuId = localStorage.getItem('USU_ID');
var isSaque = false

var DadosComprovante = {
    valorInvest: "",
    tipoInvest: "",
    jurosInvest: "",
    valorSaque: ""
};

var dataBanco = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

//graficos 1 com varios valores
function graphic() {
    var graphicTwo = {
        series: [{
            name: 'Inflation',
            data: dataBanco
        }],
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return "R$ " + val;
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },

        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            position: 'top',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {
                    return val + "%";
                }
            }

        },
        title: {
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
                color: '#444'
            }
        }

    };

    var chart = new ApexCharts(document.querySelector(".graphicTotal"), graphicTwo);
    chart.render();
}

async function mostraGanhos(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".areaValor").addClass("skeletonLoading")
        const response = await fetch(ipServer + 'mostraGanhos', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());
        isOk.forEach((dados) => {
            dataBanco[parseInt(dados.MES)] = parseInt(dados.VALOR)
        })

        graphic()

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}
mostraGanhos(usuId)

$("#btnTrocaGrafico").click(function () {
    if ($(".graphicDetails").hasClass("graficovisivel")) {
        $(".graphicDetails").hide().removeClass("graficovisivel");
        $(".graphicTotal").show().addClass("graficovisivel");
        $("#txtbtnGraf").text("Ver lucros detalhados");
    } else {
        $(".graphicTotal").hide().removeClass("graficovisivel");
        $(".graphicDetails").show().addClass("graficovisivel");
        $("#txtbtnGraf").text("Ver lucros gerais");
    }
});

$(document).ready(() => {
    const titulos = ['Tesouro direto', 'Poupança', 'CDB', 'LCI'];
    const iniciais = ['TD', 'PA', 'CB', 'LI'];
    const valores = ['0,931', '0,514', '0,771', '0,817'];

    for (let j = 1; j < 5; j++) {
        let projeto = `
        
        <div class="tiposInve" onclick="inveEscolhido('${titulos[j - 1]}', '${iniciais[j - 1]}', '${valores[j - 1]}')">
            <div class="alinhaintensCIT">
                <div class="contatoIcon sl">
                <h1 id="fotoPerfil">${iniciais[j - 1]}</h1>
                </div>
                <div class="infosCce sl">
                    <h1 id="nomeUserCheve">${titulos[j - 1]}</h1>
                </div>
            </div>
            <div class="valor">
                <h1><span>${valores[j - 1]}</span>%</h1>
                <p>ao mês</p>
            </div>
        </div>
       
        `;
        $('.elementosCardInve').append(projeto);
    }
});

function inveEscolhido(titulo, iniciais, valor) {
    console.log(titulo, iniciais, valor);

    $("#fotoPerfilInve").text(iniciais);
    $("#nomeUserInve").text(titulo);
    $("#valorInve").text(valor);

    DadosComprovante.tipoInvest = titulo
    DadosComprovante.jurosInvest = valor

    $(".areaInvest").css("display", 'none');
    $(".areaValor").css("display", 'flex');

    mostrarInvestimento(usuId, DadosComprovante.tipoInvest)
}

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
    });
});

async function PegarSaldo(id) {
    const dataJSON = JSON.stringify({ "USU_ID": id });
    try {
        $(".areaValor").addClass("skeletonLoading")
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
            $('#meuSaldo').text(parseFloat(isOk.USU_SALDO.trim()).toLocaleString('pt-BR'));
            $(".areaValor").removeClass("skeletonLoading")
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}
PegarSaldo(usuId)

async function mostrarInvestimento(id, tipo) {
    const dataJSON = JSON.stringify({ "USU_ID": id, "INV_TIPO": tipo });
    try {
        $(".areaValor").addClass("skeletonLoading")
        const response = await fetch(ipServer + 'mostrarInvestimento', {
            method: 'POST',
            body: dataJSON,
        });

        const isOk = JSON.parse(await response.text());

        if (isOk['mensagem'] == 'erro') {
            console.log('ERRO');
            $(".areaValor").removeClass("skeletonLoading")

        } else {
            console.log('Certo');
            $('#saldoDisponivelInve').text(parseFloat(isOk.VALOR.trim()).toLocaleString('pt-BR'));
            $(".areaValor").removeClass("skeletonLoading")
        }

    } catch (error) {
        console.error('Erro Servidor:', error.message);
    }
}

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
    $(".msgErroS").css("display", 'none');

    return preenchido
}

$("#btnConfirmarPix").click(function (event) {
    event.preventDefault();
    const camposOk = ValidaValor();

    if (camposOk) {
        const saldoUserFloat = parseFloat($("#meuSaldo").text().replace(/\./g, '').replace(',', '.'));
        const valorInvestiFloat = parseFloat($("#valorRecebido").val().replace(/\./g, '').replace(',', '.'));

        console.log(saldoUserFloat, valorInvestiFloat)

        if (valorInvestiFloat == 0) {
            $("#valorRecebido").parent("div").css("border-color", 'red');
            $(".msgErroL").css("display", 'flex');
        } else if (saldoUserFloat < valorInvestiFloat) {
            $("#valorRecebido").parent("div").css("border-color", 'red');
            $(".msgErroE").css("display", 'flex');
        }
        else {
            DadosComprovante.valorInvest = valorInvestiFloat
            console.log(valorInvestiFloat)
            $(".areaValor").css("display", 'none');
            $(".pedesenha").css("display", 'flex');
        }
    }
})

// button sacar
$("#btnSacarPix").click(function () {
    const camposOk = ValidaValor();

    if (camposOk) {
        const saldoDisponivelInve = parseFloat($("#saldoDisponivelInve").text().replace(/\./g, '').replace(',', '.'));
        const valorSaqueFloat = parseFloat($("#valorRecebido").val().replace(/\./g, '').replace(',', '.'));

        console.log(saldoDisponivelInve, valorSaqueFloat)

        if (valorSaqueFloat == 0) {
            $("#valorRecebido").parent("div").css("border-color", 'red');
            $(".msgErroS").css("display", 'flex');
        } else if (saldoDisponivelInve < valorSaqueFloat) {
            $("#valorRecebido").parent("div").css("border-color", 'red');
            $(".msgErroE").css("display", 'flex');
        }
        else {
            isSaque = true
            DadosComprovante.valorSaque = valorSaqueFloat
            console.log(valorSaqueFloat)
            $(".areaValor").css("display", 'none');
            $(".pedesenha").css("display", 'flex');
        }
    }
})

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

$("#btnConfirmaInvestimento").click(function () {
    var usuCPF = localStorage.getItem('USU_CPF');
    var senhaUserS = $("#confirmSenha").val()

    const senhaCriptografada = CriptografarSenha(senhaUserS);
    confirmarSenhaServerInvestimento(usuCPF, senhaCriptografada)
})

async function confirmarSenhaServerInvestimento(chavePix, senha) {
    const camposOk = validaCamposSenha();
    if (camposOk) {
        const dataJSON = JSON.stringify({ "USU_CPF": chavePix, "USU_SENHA_ACESSO": senha });
        try {
            const response = await fetch(ipServer + 'login', {
                method: 'POST',
                body: dataJSON,
            });

            const isOk = JSON.parse(await response.text());
            if (isOk['mensagem'] == 'ok') {
                if (isSaque) {
                    FazerSaquedoInvestimento(
                        DadosComprovante.tipoInvest,
                        DadosComprovante.valorSaque
                    )
                } else {
                    FazerInvestimento(
                        DadosComprovante.tipoInvest,
                        DadosComprovante.jurosInvest,
                        DadosComprovante.valorInvest
                    )
                }

            } else if (isOk['mensagem'] == 'senha incorreta') {
                $("#confirmSenha").parent("div").css("border-color", 'red');
                $("#msgErroSenha").css("display", "flex")
            }

        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
}

async function FazerInvestimento(tipo, juros, valor) {
    const camposOk = validaCamposSenha();

    const jurosformatado = juros.replace(",", ".")

    if (camposOk) {
        const dataJSON = JSON.stringify(
            { "USU_ID": usuId, "INV_VALOR": valor, "INV_TIPO": tipo, "INV_JUROS": jurosformatado }
        );
        try {
            const response = await fetch(ipServer + 'investimento', {
                method: 'POST',
                body: dataJSON,
            });

            const isOk = JSON.parse(await response.text());

            if (isOk['mensagem'] == 'aplicado') {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Investimento realizado",
                    showConfirmButton: false,
                    timer: 1000
                });
                setTimeout(function () {
                    $(".pedesenha").css("display", 'none');
                    window.location.href = "../home.html";
                }, 1100)
            } else {
                window.location.href = "../erros.html";
            }
        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }
}

async function FazerSaquedoInvestimento(tipo, valor) {
    const camposOk = validaCamposSenha();

    if (camposOk) {
        const dataJSON = JSON.stringify(
            { "USU_ID": usuId, "INV_TIPO": tipo, "INV_VALOR": valor }
        );
        try {
            const response = await fetch(ipServer + 'removeInvestimento', {
                method: 'POST',
                body: dataJSON,
            });

            const isOk = JSON.parse(await response.text());

            if (isOk['mensagem'] == 'ok') {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Saque Realizado",
                    showConfirmButton: false,
                    timer: 1000
                });
                setTimeout(function () {
                    $(".pedesenha").css("display", 'none');
                    window.location.href = "../home.html";
                }, 1100)
            } else {
                window.location.href = "../erros.html";
            }
        } catch (error) {
            console.error('Erro Servidor:', error.message);
        }
    }

}