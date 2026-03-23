document.addEventListener('DOMContentLoaded', () => {
    const tabs = {
        smtp: { el: document.getElementById('tab-smtp') },
        imap: { el: document.getElementById('tab-imap') }
    };

    const formTitle = document.getElementById('form-title');
    const testTypeInput = document.getElementById('test-type');
    const hostInput = document.getElementById('host');
    const portInput = document.getElementById('port');
    const securitySelect = document.getElementById('security');
    const testForm = document.getElementById('test-form');
    const btnIcon = document.getElementById('btn-icon');
    const btnSpinner = document.getElementById('btn-spinner');
    const submitBtn = document.getElementById('submit-btn');
    const resultConsole = document.getElementById('result-console');
    const resultHeader = document.getElementById('result-header');
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultBody = document.getElementById('result-body');

    const defaults = {
        smtp: { port: 587, security: 'STARTTLS', hostPlaceholder: 'smtp.gmail.com', title: 'Configuração SMTP' },
        imap: { port: 993, security: 'SSL', hostPlaceholder: 'imap.gmail.com', title: 'Configuração IMAP' },
    };

    let hideConsoleTimeout;
    
    function resetTabStyles() {
        Object.values(tabs).forEach(tab => {
            tab.el.className = 'tab-btn w-full text-left px-5 py-4 rounded-xl flex items-center space-x-4 transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent';
            tab.el.querySelector('div').className = 'bg-white/5 p-2 rounded-lg transition-colors';
            tab.el.querySelector('i').classList.remove('text-primary-light');
        });
    }

    function setActiveTab(type) {
        resetTabStyles();
        const activeClass = 'tab-btn w-full text-left px-5 py-4 rounded-xl flex items-center space-x-4 transition-all duration-300 bg-primary/20 text-white border border-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-[1.02]';
        tabs[type].el.className = activeClass;
        tabs[type].el.querySelector('div').className = 'bg-primary/30 p-2 rounded-lg transition-colors';
        tabs[type].el.querySelector('i').classList.add('text-primary-light');
        
        testTypeInput.value = type;
        formTitle.innerHTML = defaults[type].title;
        portInput.value = defaults[type].port;
        hostInput.placeholder = defaults[type].hostPlaceholder;
        securitySelect.value = defaults[type].security;
        
        resultConsole.classList.remove('opacity-100', 'translate-y-0');
        resultConsole.classList.add('opacity-0', 'translate-y-4');
        if (hideConsoleTimeout) clearTimeout(hideConsoleTimeout);
        hideConsoleTimeout = setTimeout(() => resultConsole.classList.add('hidden'), 300);
    }

    tabs.smtp.el.addEventListener('click', () => setActiveTab('smtp'));
    tabs.imap.el.addEventListener('click', () => setActiveTab('imap'));

    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye text-primary"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    });

    testForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
        btnIcon.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        
        resultConsole.classList.remove('opacity-100', 'translate-y-0');
        resultConsole.classList.add('opacity-0', 'translate-y-4');
        if (hideConsoleTimeout) clearTimeout(hideConsoleTimeout);
        hideConsoleTimeout = setTimeout(() => resultConsole.classList.add('hidden'), 300);

        const type = testTypeInput.value;
        const data = {
            host: hostInput.value,
            port: parseInt(portInput.value),
            security: securitySelect.value,
            user: document.getElementById('user').value,
            password: passwordInput.value
        };

        try {
            const response = await fetch(`/test-${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            showResult(result.status, result.message);
        } catch (error) {
            showResult('error', 'Falha na requisição de rede: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
            btnSpinner.classList.add('hidden');
            btnIcon.classList.remove('hidden');
        }
    });

    function showResult(status, message) {
        if (hideConsoleTimeout) clearTimeout(hideConsoleTimeout);
        resultConsole.classList.remove('hidden');
        setTimeout(() => {
            resultConsole.classList.remove('opacity-0', 'translate-y-4');
            resultConsole.classList.add('opacity-100', 'translate-y-0');
        }, 10);

        resultIcon.className = status === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
        
        if (status === 'success') {
            resultHeader.className = 'px-5 py-3 font-medium text-sm flex items-center space-x-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-t-xl';
            resultTitle.textContent = 'Sucesso Total';
            resultBody.innerHTML = `<span class="text-green-300">${message}</span>`;
        } else {
            resultHeader.className = 'px-5 py-3 font-medium text-sm flex items-center space-x-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-t-xl';
            resultTitle.textContent = 'Falha na Conexão / Autenticação';
            resultBody.innerHTML = `<span class="text-red-300">${message}</span>`;
        }
    }
});
