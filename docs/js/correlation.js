document.addEventListener('DOMContentLoaded', function() {
    const selectedLevel = localStorage.getItem('selectedLevel');
    const selectedMembers = JSON.parse(localStorage.getItem('selectedMembers'));
    console.log(selectedLevel)
    console.log(selectedMembers)
    if (!selectedLevel || !selectedMembers || selectedMembers.length === 0) {
        alert('No selection made or selection was cleared.');
        window.location.href = 'index.html';
        return;
    }

    fetch(`data/${selectedLevel}.json`)
        .then(response => response.json())
        .then(data => createCorrelationTable(data, selectedMembers))
        .catch(error => console.error("Error loading the data:", error));

    document.getElementById('quizForm').addEventListener('submit', SubForm);
    document.getElementById('goBackButton').addEventListener('click', handleGoBack);
    document.getElementById('goToGraphPageButton').addEventListener('click', handleGoToGraphPage);
});

function createCorrelationTable(data, selectedMembers) {
    const table = document.getElementById('correlationTable');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create the header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Team Members</th>' + selectedMembers.map(member => `<th>${member}</th>`).join('');
    thead.appendChild(headerRow);

    // Create the body rows
    selectedMembers.forEach(memberName => {
        const memberData = data.find(member => member["Team Members"] === memberName);
        const row = document.createElement('tr');
        row.innerHTML = `<td>${memberName}</td>` + selectedMembers.map(selected => {
            const value = memberData ? memberData[selected] : "N/A";
            return `<td>${value}</td>`;
        }).join('');
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
}

function handleQuizSubmit(event) {
    event.preventDefault();
    const quizForm = event.target;
    const name = quizForm.querySelector('input[name="name"]').value;
    const email = quizForm.querySelector('input[name="email"]').value;
    const answers = {
        question1: quizForm.querySelector('input[name="question1"]').value,
        question2: quizForm.querySelector('input[name="question2"]').value,
    };

    if (!name || !email) {
        document.getElementById('quizWarning').textContent = 'Please provide your name and email.';
        document.getElementById('quizWarning').style.display = 'block';
        return;
    }

    if (Object.values(answers).some(answer => answer.trim() === '')) {
        document.getElementById('quizWarning').textContent = 'Please answer all questions.';
        document.getElementById('quizWarning').style.display = 'block';
        return;
    }

    console.log('Submit to spreadsheet', { name, email, ...answers }); // Placeholder for API submission
    alert('Quiz submitted! Thank you.');
}

function handleGoBack() {
    localStorage.clear();
    window.location.href = 'index.html';
}

function handleGoToGraphPage() {
    window.location.href = 'node_graph.html';
}
