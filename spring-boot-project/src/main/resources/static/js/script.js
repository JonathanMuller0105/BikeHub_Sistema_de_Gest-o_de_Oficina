/**
 * ======================================================================
 * PROJETO BIKEHUB - SCRIPTS JAVASCRIPT CLIENT-SIDE
 * Localização: src/main/resources/static/js/script.js
 * ======================================================================
 * Responsabilidades:
 * 1. Máscaras dinâmicas de formatação:
 *    - Telefone celular brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 *    - Moeda brasileira: R$ 0.000,00
 *    - CPF: 000.000.000-00
 * 2. Validação visual e acessibilidade de formulários no cliente.
 * 3. Envio assíncrono básico e transição de status via Fetch API (AJAX).
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa as máscaras de input nos campos apropriados
    inicializarMascarasTelefone();
    inicializarMascarasMoeda();
    inicializarMascarasCPF();
    inicializarValidacoesFormularios();
    configurarTransicoesStatusAjax();
});

/**
 * ======================================================================
 * 1. MÁSCARA DINÂMICA PARA TELEFONE BRASILEIRO (XX) XXXXX-XXXX
 * ======================================================================
 * Aplica a máscara enquanto o usuário digita no input.
 * Trata automaticamente tanto telefones fixos (8 dígitos) quanto celulares (9 dígitos).
 */
function inicializarMascarasTelefone() {
    const inputsTelefone = document.querySelectorAll('.mascara-telefone, input[name="telefone"]');

    inputsTelefone.forEach(input => {
        input.addEventListener('input', (evento) => {
            // Passo 1: Remove tudo que NÃO for dígito numérico (0-9) usando a RegEx \D
            let valor = evento.target.value.replace(/\D/g, '');

            // Limita o tamanho máximo para 11 dígitos (DDD + 9 dígitos)
            if (valor.length > 11) {
                valor = valor.substring(0, 11);
            }

            // Passo 2: Aplica a formatação condicional baseada na quantidade de dígitos
            if (valor.length > 10) {
                // Formato Celular com 9 dígitos: (11) 98765-4321
                // RegEx: Captura ($1 DDD 2 dígitos) ($2 Prefixo 5 dígitos) ($3 Sufixo 4 dígitos)
                valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (valor.length > 6) {
                // Formato intermediário ou Fixo: (11) 9876-5432
                valor = valor.replace(/^(\d{2})(\d{4,5})(\d{0,4})$/, '($1) $2-$3');
            } else if (valor.length > 2) {
                // Apenas DDD inserido: (11) 9876...
                valor = valor.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
            } else if (valor.length > 0) {
                // Apenas início do DDD: (1...
                valor = valor.replace(/^(\d{0,2})$/, '($1');
            }

            // Atribui o valor mascarado de volta ao campo
            evento.target.value = valor;
        });
    });
}

/**
 * ======================================================================
 * 2. MÁSCARA MONETÁRIA EM REAL BRASILEIRO (R$ 0,00)
 * ======================================================================
 * Formata valores numéricos para o padrão monetário nacional:
 * Exemplo: 125050 vira R$ 1.250,50
 */
function inicializarMascarasMoeda() {
    const inputsMoeda = document.querySelectorAll('.mascara-moeda');

    inputsMoeda.forEach(input => {
        input.addEventListener('input', (evento) => {
            // Remove qualquer caractere não numérico
            let valor = evento.target.value.replace(/\D/g, '');

            if (valor === '') {
                evento.target.value = '';
                return;
            }

            // Converte os centavos em número decimal (divide por 100)
            const valorFloat = parseFloat(valor) / 100;

            // Formata usando a API nativa Intl do JavaScript para moeda brasileira (BRL)
            const valorFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(valorFloat);

            evento.target.value = valorFormatado;
        });
    });
}

/**
 * ======================================================================
 * 3. MÁSCARA PARA CPF (000.000.000-00)
 * ======================================================================
 */
function inicializarMascarasCPF() {
    const inputsCPF = document.querySelectorAll('.mascara-cpf, input[name="cpf"]');

    inputsCPF.forEach(input => {
        input.addEventListener('input', (evento) => {
            // Remove caracteres não numéricos
            let valor = evento.target.value.replace(/\D/g, '');

            if (valor.length > 11) {
                valor = valor.substring(0, 11);
            }

            // Aplica os pontos e traço progressivamente
            // RegEx 1: Insere ponto após os 3 primeiros dígitos
            valor = valor.replace(/^(\d{3})(\d)/, '$1.$2');
            // RegEx 2: Insere ponto após os 6 primeiros dígitos
            valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
            // RegEx 3: Insere traço antes dos últimos 2 dígitos
            valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');

            evento.target.value = valor;
        });
    });
}

/**
 * ======================================================================
 * 4. VALIDAÇÃO RÁPIDA DE FORMULÁRIOS NO CLIENTE
 * ======================================================================
 */
function inicializarValidacoesFormularios() {
    const formularios = document.querySelectorAll('form');

    formularios.forEach(form => {
        form.addEventListener('submit', (evento) => {
            let formValido = true;
            const camposObrigatorios = form.querySelectorAll('[required]');

            camposObrigatorios.forEach(campo => {
                // Checa se o campo está vazio ou preenchido apenas com espaços
                if (!campo.value || campo.value.trim() === '') {
                    campo.classList.add('is-invalid');
                    formValido = false;
                } else {
                    campo.classList.remove('is-invalid');
                }
            });

            if (!formValido) {
                evento.preventDefault();
                // Notificação de alerta visual simples
                alert('Por favor, preencha todos os campos obrigatórios destacados em vermelho.');
            }
        });
    });
}

/**
 * ======================================================================
 * 5. ATUALIZAÇÃO ASSÍNCRONA DE STATUS VIA AJAX / FETCH API
 * ======================================================================
 */
function configurarTransicoesStatusAjax() {
    const selectsStatusAjax = document.querySelectorAll('.select-status-ajax-async');

    selectsStatusAjax.forEach(select => {
        select.addEventListener('change', async (evento) => {
            const osId = evento.target.getAttribute('data-os-id');
            const novoStatus = evento.target.value;

            try {
                // Monta o FormData para envio via POST
                const formData = new FormData();
                formData.append('status', novoStatus);

                const response = await fetch(`/servicos/api/${osId}/status`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.sucesso) {
                    // Feedback visual sutil (animação ou badge)
                    console.log(`[BikeHub] Status da OS #${osId} alterado para ${data.descricaoStatus}`);
                } else {
                    alert('Erro ao atualizar status: ' + (data.mensagem || 'Falha na requisição.'));
                }
            } catch (err) {
                console.error('[BikeHub] Erro na requisição AJAX de status:', err);
            }
        });
    });
}
