var usuId = localStorage.getItem('USU_ID');
var usuCPF = localStorage.getItem('USU_CPF');

if (usuId == null && usuCPF == null) {
    window.location.href = "./erros.html";
}