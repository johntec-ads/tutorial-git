document.addEventListener('DOMContentLoaded', () => {
    const exercises = document.querySelectorAll('.exercise-item');

    exercises.forEach(exercise => {
        const checkButton = exercise.querySelector('.check-exercise');
        const content = exercise.querySelector('.exercise-content');

        if (checkButton) {
            checkButton.addEventListener('click', () => {
                // Simula verificação do exercício
                const isComplete = Math.random() > 0.5;
                
                exercise.classList.toggle('complete', isComplete);
                exercise.classList.toggle('incomplete', !isComplete);
                
                const message = isComplete ? 
                    'Muito bem! Exercício concluído!' : 
                    'Tente novamente. Verifique as instruções.';
                
                showFeedback(exercise, message, isComplete);
            });
        }
    });

    function showFeedback(exercise, message, isSuccess) {
        const feedback = document.createElement('div');
        feedback.className = `exercise-feedback ${isSuccess ? 'success' : 'error'}`;
        feedback.textContent = message;
        
        const existingFeedback = exercise.querySelector('.exercise-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        exercise.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 500);
        }, 3000);
    }
});
