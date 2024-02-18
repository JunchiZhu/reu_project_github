document.addEventListener('DOMContentLoaded', function() {
    let descriptions = {};

    function loadDescriptions() {
        fetch('data/description.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    descriptions[item["Team Members"]] = item["Brief Description"];
                });
                setupLevelSelection();
            })
            .catch(error => console.error("Failed to load descriptions:", error));
    }

    loadDescriptions();

    function setupLevelSelection() {
        document.querySelectorAll('input[name="level"]').forEach(input => {
            input.addEventListener('change', function() {
                document.getElementById('membersContainer').innerHTML = '';
                loadMembers(this.value);
            });
        });
    }

    function loadMembers(level) {
        fetch(`data/${level}.json`)
            .then(response => response.json())
            .then(data => {
                displayMembers(data);
            })
            .catch(error => {
                console.error("Failed to load data:", error);
                document.getElementById('membersContainer').innerHTML = '<p>Error loading member data.</p>';
            });
    }

    function displayMembers(members) {
        const membersContainer = document.getElementById('membersContainer');

        members.forEach(member => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = member["Team Members"];
            checkbox.name = 'members';
            checkbox.value = member["Team Members"];

            if (member["Team Members"] === "Project Manager(You)") {
                checkbox.checked = true;
                checkbox.disabled = true;
            }

            const tooltipSpan = document.createElement('span');
            tooltipSpan.className = 'tooltip-text';
            tooltipSpan.textContent = descriptions[member["Team Members"]] || "No description available.";

            label.appendChild(checkbox);
            label.append(member["Team Members"]);
            label.appendChild(tooltipSpan);

            membersContainer.appendChild(label);
            membersContainer.appendChild(document.createElement('br'));
        });
    }

    document.getElementById('proceedButton').addEventListener('click', function() {
        const selectedLevel = document.querySelector('input[name="level"]:checked');
        const selectedMembers = document.querySelectorAll('input[name="members"]:checked');
        const warningContainer = document.getElementById('warning');

        warningContainer.style.display = 'none';
        warningContainer.textContent = '';

        if (!selectedLevel) {
            warningContainer.style.display = 'block';
            warningContainer.textContent = 'Please select one level!';
            return;
        }

        if (selectedMembers.length === 1) {
            warningContainer.style.display = 'block';
            warningContainer.textContent = 'Please select at least one more member!';
            return;
        }

        localStorage.setItem('selectedLevel', selectedLevel.value);
        const memberSelections = Array.from(selectedMembers).map(member => member.value);
        localStorage.setItem('selectedMembers', JSON.stringify(memberSelections));

        window.location.href = 'correlation.html';
    });


});

