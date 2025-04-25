document.addEventListener('DOMContentLoaded', () => {
    const userNameInput = document.getElementById('userName');
    const saveBtn = document.getElementById('saveBtn');
    const statusEl = document.getElementById('status');
  
    // Carrega o nome salvo
    chrome.storage.sync.get(['userName'], (result) => {
      if (result.userName) {
        userNameInput.value = result.userName;
      }
    });
  
    // Salva o novo nome
    saveBtn.addEventListener('click', () => {
      const userName = userNameInput.value.trim();
      if (userName) {
        chrome.storage.sync.set({ userName }, () => {
          statusEl.textContent = 'Nome salvo com sucesso!';
          setTimeout(() => statusEl.textContent = '', 2000);
        });
      }
    });
  });