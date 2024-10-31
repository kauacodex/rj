const axios = require("axios");
const fs = require("fs");
const path = require("path");

// URL da API
const apiUrl = 'https://portal1.snirh.gov.br/server/rest/services/SGH/CotasReferencia2/MapServer/dynamicLayer/query?f=json&returnGeometry=false&spatialRel=esriSpatialRelIntersects&geometry=%7B"xmin"%3A-5704261.757328038%2C"ymin"%3A-3508025.0787798706%2C"xmax"%3A-5704204.429556822%2C"ymax"%3A-3507967.751008655%2C"spatialReference"%3A%7B"wkid"%3A102100%7D%7D&geometryType=esriGeometryEnvelope&inSR=102100&outFields=Data_ult_dado%2CUlt_Dado&outSR=102100&layer=%7B"source"%3A%7B"type"%3A"mapLayer"%2C"mapLayerId"%3A2%7D%7D';

// Função para formatar a data
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Função para buscar os dados
async function fetchData() {
    try {
        const response = await axios.get(apiUrl);
        const json = response.data;

        const features = json.features || [];
        if (features.length > 0) {
            const attributes = features[0].attributes;
            const Ult_Dado = attributes.Ult_Dado;
            const Data_ult_dado = parseInt(attributes.Data_ult_dado);

            const dataToSave = {
                Ult_Dado,
                Data_ult_dado,
                ultima_atualizacao: formatDate(new Date())
            };

            // Carrega o conteúdo existente do dados.json, se houver
            const filePath = path.resolve(__dirname, 'dados.json');
            let existingData = {};

            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath);
                existingData = JSON.parse(rawData);
            }

            // Atualiza o objeto existente com os novos dados
            const updatedData = { ...existingData, ...dataToSave };

            // Salva o arquivo atualizado
            fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
            console.log("Dados atualizados e salvos em dados.json");
        } else {
            console.log("Sem dados disponíveis");
        }
    } catch (error) {
        console.error("Erro ao buscar os dados:", error.message);
    }
}

// Executa a busca de dados imediatamente
fetchData();
