function obterIniciais(nomeCompleto) {
    var partesNome = nomeCompleto.trim().split(' '); // Dividindo o nome completo em partes (palavras)
    var primeiraLetraPrimeiroNome = partesNome[0].charAt(0); // Pegando a primeira letra do primeiro nome

    // Pegando a última palavra e então a primeira letra dessa palavra
    var ultimaPalavra = partesNome[partesNome.length - 1];
    var primeiraLetraUltimoNome = ultimaPalavra.charAt(0);


    var iniciais = primeiraLetraPrimeiroNome + primeiraLetraUltimoNome;

    return iniciais.toUpperCase();
}

$('#sairdaconta').click(function () {
    localStorage.removeItem('USU_ID');
    localStorage.removeItem('USU_CPF');

    window.location.href = '../index.html';
});

$('#sairdacontaTrasferencias').click(function () {
    localStorage.removeItem('USU_ID');
    localStorage.removeItem('USU_CPF');

    window.location.href = '../../index.html';
});

var ipServer = "http://localhost:9000/"