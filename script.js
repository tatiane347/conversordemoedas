document.addEventListener('DOMContentLoaded', async () => {

    const valorDolarInput = document.getElementById('valor-dolar');

    const converterBtn = document.getElementById('converter-btn');

    const resultadoDiv = document.getElementById('resultado');

    const loadingDiv = document.getElementById('loading');

    const lastUpdatedDiv = document.getElementById('last-updated');

    const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'; // API gratuita, buscando taxas com base no USD

    let taxaDolarParaBRL = 0; // Variável para armazenar a taxa BRL

    // --- Funções de UI ---

    function showLoading() {

        resultadoDiv.innerHTML = '';

        loadingDiv.style.display = 'block';

        lastUpdatedDiv.innerHTML = '';

    }

    function hideLoading() {

        loadingDiv.style.display = 'none';

    }

    function showError(message) {

        resultadoDiv.innerHTML = `<p style="color: #FF6347; font-size: 1em;">${message}</p>`;

    }

    function updateLastUpdated(timestamp) {

        const date = new Date(timestamp * 1000); // Timestamp da API está em segundos

        lastUpdatedDiv.innerHTML = `Última atualização: ${date.toLocaleString('pt-BR')}`;

    }

    // --- Funções de Dados ---

    async function fetchExchangeRate() {

        showLoading();

        try {

            const response = await fetch(API_URL);

            const data = await response.json();

            if (data && data.rates && data.rates.BRL) {

                taxaDolarParaBRL = data.rates.BRL;

                updateLastUpdated(data.time_last_updated);

                // Converte imediatamente após carregar a taxa inicial

                converterDolarParaBRL();

            } else {

                showError('Não foi possível carregar a taxa de câmbio USD para BRL.');

            }

        } catch (error) {

            showError('Erro ao buscar a taxa de câmbio. Verifique sua conexão.');

            console.error('Erro ao buscar taxa:', error);

        } finally {

            hideLoading();

        }

    }

    function converterDolarParaBRL() {

        const valorDolar = parseFloat(valorDolarInput.value);

        if (isNaN(valorDolar) || valorDolar <= 0) {

            showError('Por favor, insira um valor numérico válido.');

            resultadoDiv.innerHTML = ''; // Limpa resultado anterior

            return;

        }

        if (taxaDolarParaBRL === 0) {

            showError('Taxa de câmbio não carregada. Tente novamente.');

            return;

        }

        const valorEmReais = valorDolar * taxaDolarParaBRL;

        resultadoDiv.innerHTML = `${valorDolar.toFixed(2)} USD = ${valorEmReais.toFixed(2)} BRL`;

    }

    // --- Event Listeners ---

    converterBtn.addEventListener('click', converterDolarParaBRL);

    // Converte automaticamente ao mudar o valor no input

    valorDolarInput.addEventListener('input', converterDolarParaBRL);

    // --- Inicialização ---

    fetchExchangeRate(); // Carrega a taxa quando a página carrega

});