document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/users') // Va chercher les données du backend
        .then(response => response.json()) // Convertit en JSON
        .then(users => {
            const userList = document.getElementById('user-list');

            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.id} - ${user.name} ${user.surname} (${user.email})`;
                userList.appendChild(li);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des utilisateurs:', error));
});
