document.addEventListener('DOMContentLoaded', function() {
    const selectedLevel = localStorage.getItem('selectedLevel');
    const selectedMembers = JSON.parse(localStorage.getItem('selectedMembers'));
    const selectedMembers_without_pm = selectedMembers.filter(member => member !== "Project Manager(You)");

    fetch(`data/${selectedLevel}.json`)
        .then(response => response.json())
        .then(data => createCorrelationTable(data, selectedMembers))
        .catch(error => console.error("Error loading the data:", error));


    const table_question1_select = document.getElementById('table_question1');
    let option = document.createElement('option');

    selectedMembers.forEach(member => {
        option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        table_question1_select.appendChild(option);
    });


    const otherSelectIds = ['table_question2', 'table_question3', 'table_question4', 'table_question5'];
    otherSelectIds.forEach(selectId => {
        const select = document.getElementById(selectId);
        selectedMembers_without_pm.forEach(member => {
            option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            select.appendChild(option);
        });
    });

    var subButton = document.getElementById('table_quiz_button');
    subButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        var allFieldsFilled = true;

        // Check if the name and email inputs are filled
        var nameInput = document.querySelector('#quizForm input[name="name"]');
        var emailInput = document.querySelector('#quizForm input[name="email"]');

        if (!nameInput.value.trim()) {
            allFieldsFilled = false;
            nameInput.style.borderColor = 'red';
        } else {
            nameInput.style.borderColor = '';
        }

        if (!emailInput.value.trim()) {
            allFieldsFilled = false;
            emailInput.style.borderColor = 'red';
        } else {
            emailInput.style.borderColor = '';
        }

        // Check if all select elements are filled
        document.querySelectorAll('#quizForm select[required]').forEach(function(select) {
            if (select.value === "") {
                allFieldsFilled = false;
                select.style.borderColor = 'red';
            } else {
                select.style.borderColor = '';
            }
        });

        // If all fields are filled, proceed with form submission
        if (allFieldsFilled) {
            SubForm();
        } else {
            alert('Please fill out all required fields before proceeding.');
        }
    });

    document.getElementById('goBackButton').addEventListener('click', handleGoBack);

});


function createCorrelationTable(data, selectedMembers) {
    const table = document.getElementById('correlationTable');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Team Members</th>' + selectedMembers.map(member => `<th>${member}</th>`).join('');
    thead.appendChild(headerRow);

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


function handleGoBack() {
    localStorage.clear();
    window.location.href = 'index.html';
}


