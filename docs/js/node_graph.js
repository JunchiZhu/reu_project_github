document.addEventListener('DOMContentLoaded', function() {
    const selectedLevel = localStorage.getItem('selectedLevel');
    const selectedMembers = JSON.parse(localStorage.getItem('selectedMembers'));
    console.log(selectedLevel)
    console.log(selectedMembers)

    fetch(`data/${selectedLevel}.json`)
        .then(response => response.json())
        .then(data => {
            createNodeGraph(data, selectedMembers);
        })
        .catch(error => console.error("Error loading the data:", error));
});

function createNodeGraph(data, selectedMembers) {
    const width = window.innerWidth;
    const height = 600;


    const svg = d3.select('#nodeGraph').append('svg')
        .attr('width', width)
        .attr('height', height);


    const nodes = selectedMembers.map(member => ({ id: member }));
    const links = [];

    selectedMembers.forEach((source, i) => {
        selectedMembers.slice(i + 1).forEach(target => {
            const sourceData = data.find(d => d['Team Members'] === source);
            const value = sourceData[target];
            if (value) {
                links.push({ source, target, value });
            }
        });
    });


    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(300)) // Shorter distance
        .force('charge', d3.forceManyBody().strength(-200)) // Less repulsive force
        .force('center', d3.forceCenter(width / 2, height / 2));


    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .style('stroke-width', d => d.value)
        .style('stroke', '#999');

    const linkText = svg.append('g')
        .selectAll('text')
        .data(links)
        .join('text')
        .text(d => d.value)
        .style('fill', '#555')
        .style('font-size', '20px');

    const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 35)
        .style('fill', '#69b3a2')
        .call(drag(simulation));
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }

    const nodeText = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text(d => d.id)
        .style('fill', '#333')
        .style('font-size', '12px')
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'middle');

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        nodeText
            .attr('x', d => d.x)
            .attr('y', d => d.y);

        linkText
            .attr('x', d => (d.source.x + d.target.x) / 2)
            .attr('y', d => (d.source.y + d.target.y) / 2);
    });


    const graph_question1_select = document.getElementById('graph_question1');
    let option = document.createElement('option');

    selectedMembers.forEach(member => {
        option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        graph_question1_select.appendChild(option);
    });

    const selectedMembers_without_pm = selectedMembers.filter(member => member !== "Project Manager(You)");

    const otherSelectIds = ['graph_question2', 'graph_question3', 'graph_question4', 'graph_question5'];
    otherSelectIds.forEach(selectId => {
        const select = document.getElementById(selectId);
        selectedMembers_without_pm.forEach(member => {
            option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            select.appendChild(option);
        });
    });

    var subButton = document.getElementById('graph_quiz_button');
    subButton.addEventListener('click', function(event) {
        event.preventDefault();

        var allFieldsFilled = true;

        var nameInput = document.querySelector('#graph_quizForm input[name="name"]');
        var emailInput = document.querySelector('#graph_quizForm input[name="email"]');

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

        document.querySelectorAll('#graph_quizForm select[required]').forEach(function(select) {
            if (select.value === "") {
                allFieldsFilled = false;
                select.style.borderColor = 'red';
            } else {
                select.style.borderColor = '';
            }
        });

        if (allFieldsFilled) {
            SubForm();
        } else {
            alert('Please fill out all required fields before proceeding.');
        }
    });
}

// Add this inside your script tag
window.addEventListener('resize', resize);

function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    svg.attr('width', width)
        .attr('height', height);

    simulation.force('center', d3.forceCenter(width / 2, height / 2))
        .restart();
}

