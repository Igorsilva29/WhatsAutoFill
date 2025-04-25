// Carrega o nome do armazenamento
let userName = "Usuário"; // Valor padrão

// Obtém o nome salvo
chrome.storage.sync.get(['userName'], (result) => {
  if (result.userName) {
    userName = result.userName;
  }
});

function initializeExtension() {
    // Função principal que insere o nome e quebra de linha
    function handleTextareaClick(event) {
        const textarea = event.currentTarget;
        
        // Verifica se está vazio ou contém apenas espaços em branco
        if (textarea.textContent.trim() === '') {
            try {
                // Foca na caixa de texto
                textarea.focus();
                
                // Insere o nome formatado
                document.execCommand('insertText', false, `*${userName}:* `);
                
                // Dispara eventos necessários
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Adiciona Shift+Enter para quebra de linha
                setTimeout(() => {
                    const shiftEnterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        shiftKey: true,
                        bubbles: true
                    });
                    textarea.dispatchEvent(shiftEnterEvent);
                }, );
                
            } catch (error) {
                console.warn('Erro ao inserir nome:', error);
            }
        }
    }

    // Configura os listeners nas caixas de texto
    function setupTextareaListeners() {
        // Adiciona listeners a todas as caixas de texto existentes
        const textareas = document.querySelectorAll('#main div[contenteditable="true"]');
        textareas.forEach(textarea => {
            // Remove listener antigo para evitar duplicação
            textarea.removeEventListener('click', handleTextareaClick);
            // Adiciona novo listener
            textarea.addEventListener('click', handleTextareaClick);
        });
    }

    // Monitora mudanças no DOM para detectar novas caixas de texto
    const observer = new MutationObserver((mutations) => {
        setupTextareaListeners();
    });

    // Inicia a observação
    function startObservation() {
        const mainContainer = document.querySelector('#main') || document.body;
        observer.observe(mainContainer, {
            childList: true,
            subtree: true
        });
        
        // Configura os listeners iniciais
        setupTextareaListeners();
    }

    // Inicialização segura
    if (document.readyState === 'complete') {
        startObservation();
    } else {
        window.addEventListener('load', startObservation);
        document.addEventListener('DOMContentLoaded', startObservation);
    }
}

// Inicia a extensão
initializeExtension();