/**
 * Funcionalidades de Progressive Web App (PWA) - Tutorial Git
 * 
 * Este arquivo implementa recursos que tornam o tutorial instalável como um aplicativo
 * nos dispositivos dos usuários, permitindo uso offline e melhor experiência.
 * 
 * Funcionalidades:
 * - Registro do Service Worker para cache e funcionamento offline
 * - Prompt de instalação personalizado para melhorar a taxa de adoção
 */

// Registra o Service Worker se o navegador suportar
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(error => {
                console.log('Falha ao registrar ServiceWorker:', error);
            });
    });
}

/**
 * Sistema de prompt de instalação personalizado
 * Captura o evento padrão beforeinstallprompt e implementa uma interface mais amigável
 * para encorajar os usuários a instalarem o tutorial como aplicativo
 */
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostra botão de instalação personalizado
    const installButton = document.createElement('button');
    installButton.textContent = 'Instalar Tutorial Git';
    installButton.classList.add('install-button');
    document.body.appendChild(installButton);
    
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Resposta do usuário: ${outcome}`);
            deferredPrompt = null;
            installButton.remove();
        }
    });
});
