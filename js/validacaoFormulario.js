//validação formulario

//API correio para completar endereço.

async function buscaEndereco(input) {
    var CEP = input.value;

    try {
        var consultaCEP = await fetch(`https://viacep.com.br/ws/${CEP}/json/`);
        var consultaCEPConvertida = await consultaCEP.json();

        if (consultaCEPConvertida.erro) {
            console.log('CEP não existente!');
        }

        $("#endereco").val(consultaCEPConvertida.logradouro);
        $("#bairro").val(consultaCEPConvertida.bairro);
        $("#uf").val(consultaCEPConvertida.uf);
        $("#cidade").val(consultaCEPConvertida.localidade);

        return consultaCEPConvertida;

    } catch (erro) {
        console.log(erro);
    }
}

//validação dos campos

var camposValido = 0

function validaNome(elemento) {
    let regexNome = (nome) => {
        return nome.match(/^[A-ZÀ-Ÿ][A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-ZÀ-Ÿ][A-zÀ-ÿ']+$/i)
    }
    let inputParent = $(elemento).parent('.inputOrg')

    if (regexNome(elemento.value)) {
        inputParent.css("border-color", "#121212")
        return true
    }
    else {
        inputParent.css("border-color", "red")
        return false
    }
}

function validaCPF(elemento) {
    // Função para calcular o dígito verificador
    let calculaDigito = (cpfParcial) => {
        let soma = 0;
        let multiplicador = cpfParcial.length + 1;
        for (let i = 0; i < cpfParcial.length; i++) {
            soma += parseInt(cpfParcial[i]) * multiplicador
            multiplicador--
        }
        let resto = soma % 11;
        return (resto < 2) ? 0 : 11 - resto;
    };

    // Regex para verificar se o CPF está no formato correto
    let regexCPF = /^(\d{3}\.){2}\d{3}-\d{2}$/;

    let inputParent = $(elemento).parent('.inputOrg')

    if (regexCPF.test(elemento.value)) {
        let cpfNumeros = elemento.value.replace(/\D/g, ''); // Remove pontos e traço

        // Verifica se todos os dígitos do CPF são iguais
        if (/^(\d)\1{10}$/.test(cpfNumeros)) {
            inputParent.css("border-color", "red")
            return;
        }

        let cpfParcial = cpfNumeros.substr(0, 9); // Obtém os primeiros 9 dígitos do CPF
        let digito1 = calculaDigito(cpfParcial);

        cpfParcial += digito1.toString(); // Adiciona o primeiro dígito à parcial
        let digito2 = calculaDigito(cpfParcial); // Calcula o segundo dígito verificador

        if (digito1 === parseInt(cpfNumeros[9]) && digito2 === parseInt(cpfNumeros[10])) {
            inputParent.css("border-color", "#121212")
        } else {
            inputParent.css("border-color", "red");

        }
    }
}

function validaEmail(elemento) {
    let regexEmail = (email) => {
        return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    }

    let inputParent = $(elemento).parent('.inputOrg')

    if (elemento.value.length < 8 || !regexEmail(elemento.value)) {
        inputParent.css("border-color", "red")
        $("#btnNextInfos").css("opacity", "0.5")
    }
    else {
        inputParent.css("border-color", "#121212");
    }
}

function validaSenha(elemento) {
    let regexSenha = (senha) => {
        return senha.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W+)(?=^.{6,50}$).*$/g)
    }
    let inputParent = $(elemento).parent('.inputOrg')

    if (elemento.value.length < 8 || !regexSenha(elemento.value)) {
        inputParent.css("border-color", "red")
        $(".msgErroSenha").css("display", "flex")
    }
    else {
        inputParent.css("border-color", "#121212");
        $(".msgErroSenha").css("display", "none")
    }
}

function validaConfirmaSenha(elemento) {
    let inputParent = $(elemento).parent('.inputOrg')

    if (elemento.value != senha.value) {
        inputParent.css("border-color", "red")
    }
    else {
        inputParent.css("border-color", "#121212");
    }

}

function codigoValidacaoPadrao(elemento) {
    let inputParent = $(elemento).parent('.inputOrg')

    if (elemento.value.length < 5) {
        inputParent.css("border-color", "red");
        return false

    } else {
        inputParent.css("border-color", "#121212");
        return true
    }
}

function validaData(elemento) {
    codigoValidacaoPadrao(elemento)
}

function validaEndereco(elemento) {
    codigoValidacaoPadrao(elemento)
}

function validaNumero(elemento) {
    let inputParent = $(elemento).parent('.inputOrg')

    if (elemento.value.length < 1) {
        inputParent.css("border-color", "red");
        return false

    } else {
        inputParent.css("border-color", "#121212");
        return true
    }
}

function validaBairro(elemento) {
    codigoValidacaoPadrao(elemento)
}

function validaCidade(elemento) {
    codigoValidacaoPadrao(elemento)
}

function validaTelefone(elemento) {
    codigoValidacaoPadrao(elemento)
}

//mascaras
$(document).ready(function () {
    $('.maskTelefone').mask('(00) 00000-0000');
})