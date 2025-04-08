/**
 * Sistema de Exercícios Interativos - Tutorial Git
 * 
 * Este módulo implementa exercícios práticos interativos que permitem
 * aos usuários testarem seus conhecimentos de Git e receberem feedback.
 * 
 * Funcionalidades:
 * - Verificação de soluções com feedback visual
 * - Sistema de mensagens temporárias para resultados
 * - Acompanhamento de progresso dos exercícios
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar soluções e estado de progresso
    const exerciseSolutions = {
        1: [
            "git checkout -b feature/exercicio-1",
            "echo '# Nome do Usuário' > README.md",
            "git add README.md",
            "git commit -m 'Adiciona README com nome'",
            "git checkout main",
            "git merge feature/exercicio-1"
        ],
        2: [
            "git checkout -b feature/a",
            "# Editar README.md na feature/a",
            "git add README.md",
            "git commit -m 'Alteração A no README'",
            "git checkout main",
            "git checkout -b feature/b",
            "# Editar a mesma linha do README.md",
            "git add README.md",
            "git commit -m 'Alteração B no README'",
            "git checkout main",
            "git merge feature/a",
            "git merge feature/b",
            "# Resolver conflito manualmente",
            "git add README.md",
            "git commit -m 'Resolve conflito de merge'"
        ]
    };

    // Carrega o progresso salvo, se existir
    const savedProgress = JSON.parse(localStorage.getItem('gitExercisesProgress') || '{}');

    // Seleciona todos os exercícios da página
    const exercises = document.querySelectorAll('.exercise-item');

    // Aplica o estado salvo aos exercícios
    exercises.forEach(exercise => {
        const exerciseId = exercise.querySelector('.check-exercise')?.dataset.exercise;
        if (exerciseId && savedProgress[exerciseId]) {
            exercise.classList.add(savedProgress[exerciseId] ? 'complete' : 'incomplete');
        }

        const checkButton = exercise.querySelector('.check-exercise');
        const content = exercise.querySelector('.exercise-content');

        if (checkButton) {
            // Adiciona um evento de clique para mostrar a solução
            checkButton.addEventListener('click', () => {
                const exerciseId = checkButton.dataset.exercise;
                
                // Se botão já foi clicado e mostra "Ver Solução", mostra a solução
                if (checkButton.textContent === "Ver Solução") {
                    showSolution(exercise, exerciseId);
                    return;
                }
                
                // Simulação de verificação (no mundo real, verificaria código real)
                const isComplete = true; // Sempre mostra solução no tutorial
                
                // Atualiza o estado do exercício
                exercise.classList.toggle('complete', isComplete);
                exercise.classList.toggle('incomplete', !isComplete);
                
                // Salva progresso
                savedProgress[exerciseId] = isComplete;
                localStorage.setItem('gitExercisesProgress', JSON.stringify(savedProgress));
                
                // Muda o texto do botão para mostrar solução
                checkButton.textContent = "Ver Solução";
                
                // Feedback para o usuário
                const message = isComplete ? 
                    'Clique em "Ver Solução" para conferir um exemplo de solução.' : 
                    'Tente novamente. Verifique as instruções.';
                
                showFeedback(exercise, message, isComplete);
            });
        }
    });

    /**
     * Exibe a solução para um exercício específico
     * @param {HTMLElement} exercise - O elemento DOM do exercício
     * @param {string} exerciseId - O ID do exercício
     */
    function showSolution(exercise, exerciseId) {
        // Remove qualquer solução anterior
        const existingSolution = exercise.querySelector('.exercise-solution');
        if (existingSolution) {
            existingSolution.remove();
            return;
        }

        // Cria o elemento de solução
        const solutionDiv = document.createElement('div');
        solutionDiv.className = 'exercise-solution';
        
        const heading = document.createElement('h4');
        heading.textContent = 'Exemplo de Solução:';
        solutionDiv.appendChild(heading);
        
        // Cria um bloco de código com a solução
        const solutionCode = document.createElement('pre');
        const code = document.createElement('code');
        
        // Obtém a solução para o exercício
        const steps = exerciseSolutions[exerciseId] || ['Solução não disponível'];
        code.textContent = steps.join('\n');
        
        solutionCode.appendChild(code);
        solutionDiv.appendChild(solutionCode);
        
        // Adiciona um botão para fechar a solução
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Fechar Solução';
        closeButton.className = 'close-solution';
        closeButton.addEventListener('click', () => solutionDiv.remove());
        solutionDiv.appendChild(closeButton);
        
        // Adiciona a solução ao exercício
        exercise.appendChild(solutionDiv);
    }

    /**
     * Exibe uma mensagem de feedback temporária
     * @param {HTMLElement} exercise - O elemento DOM do exercício
     * @param {string} message - A mensagem de feedback
     * @param {boolean} isSuccess - Se a mensagem é de sucesso ou erro
     */
    function showFeedback(exercise, message, isSuccess) {
        const feedback = document.createElement('div');
        feedback.className = `exercise-feedback ${isSuccess ? 'success' : 'error'}`;
        feedback.textContent = message;
        
        const existingFeedback = exercise.querySelector('.exercise-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        exercise.appendChild(feedback);
        
        // Remove o feedback após alguns segundos
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => {
                if (feedback.parentNode === exercise) {
                    feedback.remove();
                }
            }, 500);
        }, 5000);
    }

    // Adiciona estilos necessários para os exercícios
    addExerciseStyles();

    /**
     * Adiciona estilos CSS para os elementos de exercícios
     */
    function addExerciseStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .exercise-solution {
                background: #f5f5f5;
                padding: 1rem;
                border-radius: 8px;
                margin-top: 1rem;
                border-left: 4px solid var(--accent-color);
            }
            .exercise-solution pre {
                margin: 0.5rem 0;
                white-space: pre-wrap;
            }
            .close-solution {
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 1rem;
            }
            .exercise-feedback {
                padding: 0.5rem 1rem;
                margin-top: 1rem;
                border-radius: 4px;
                opacity: 1;
                transition: opacity 0.5s ease;
            }
            .exercise-feedback.success {
                background: #e6f7e6;
                color: #2e7d32;
            }
            .exercise-feedback.error {
                background: #fde8e8;
                color: #c62828;
            }
            .exercise-feedback.fade-out {
                opacity: 0;
            }
            .exercise-item.complete {
                border-left: 4px solid #4CAF50;
                padding-left: 1rem;
            }
            .exercise-item.incomplete {
                border-left: 4px solid #f44336;
                padding-left: 1rem;
            }
            [data-theme="dark"] .exercise-solution {
                background: var(--dark-code-bg);
                border-left-color: var(--dark-accent);
            }
            [data-theme="dark"] .exercise-feedback.success {
                background: #1b3a1b;
                color: #81c784;
            }
            [data-theme="dark"] .exercise-feedback.error {
                background: #3e1a1a;
                color: #ef9a9a;
            }
        `;
        document.head.appendChild(style);
    }
});
