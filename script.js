document.addEventListener("DOMContentLoaded", function () {
  const jsonUrl = 'https://raw.githubusercontent.com/kauacodex/rj/refs/heads/main/dados.json'; // URL do arquivo JSON gerado pelo Node.js

  function fetchAndDisplayData() {
    // Adiciona um parâmetro de timestamp para evitar cache
    const urlComTimestamp = `${jsonUrl}?t=${new Date().getTime()}`;

    fetch(urlComTimestamp)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao carregar os dados do arquivo.");
        return response.json();
      })
      .then((data) => {
        const Ult_Dado = data.Ult_Dado;
        const Data_ult_dado = data.Data_ult_dado;
        const formattedDado = formatUltDado(Ult_Dado);
        const formattedDate = formatDate(Data_ult_dado);

        document.getElementById("Ult_Dado_Numero").innerText = formattedDado;
        document.getElementById("Data_ult_dado").innerHTML = `<i class="far fa-clock" style="animation: shake 3s infinite;"></i> Em: <span style="color: white;">${formattedDate}</span>`;
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados:", error);
        document.getElementById("Ult_Dado_Numero").innerText = "Erro ao carregar dados";
        document.getElementById("Data_ult_dado").innerText = "Erro ao carregar dados";
      });
  }

  function formatUltDado(dado) {
    const dadoStr = dado.toString();
    const numeroComZeros = dadoStr.padStart(3, '0');
    const parteInteira = numeroComZeros.slice(0, -2);
    const parteDecimal = numeroComZeros.slice(-2);
    return `${parteInteira},${parteDecimal}`;
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  // Força uma atualização imediata ao carregar a página
  fetchAndDisplayData();
  
  // Continua atualizando a cada 30 segundos
  setInterval(fetchAndDisplayData, 30000);
});
