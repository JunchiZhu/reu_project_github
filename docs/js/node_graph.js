document.addEventListener('DOMContentLoaded', function() {
    const selectedLevel = localStorage.getItem('selectedLevel');
    const selectedMembers = JSON.parse(localStorage.getItem('selectedMembers'));
    console.log(selectedLevel)
    console.log(selectedMembers)
    // Fetch the data for the selected level and create the graph
    fetch(`data/${selectedLevel}.json`)
        .then(response => response.json())
        .then(data => {
            createNodeGraph(data, selectedMembers);
        })
        .catch(error => console.error("Error loading the data:", error));
});

function createNodeGraph(data, selectedMembers) {
    const width = 960, height = 600;

    const svg = d3.select('#nodeGraph').append('svg')
        .attr('width', width)
        .attr('height', height);

    const nodes = selectedMembers.map(member => ({ id: member }));
    const links = [];

    const projectManager = 'Project Manager(You)'; // Assume the project manager has a specific key

    selectedMembers.forEach(member => {
        if (member !== projectManager) {
            const sourceData = data.find(d => d['Team Members'] === projectManager);
            const value = sourceData[member];
            if (value && value !== 0) { // Ensure there is a connection and it's not to self
                links.push({ source: projectManager, target: member, value });
            }
        }
    });
    // selectedMembers.forEach((source, i) => {
    //     selectedMembers.slice(i + 1).forEach(target => {
    //         // Only create an edge if source is less than target to avoid duplicates
    //         const sourceData = data.find(d => d['Team Members'] === source);
    //         const value = sourceData[target];
    //         if (value) {
    //             links.push({ source, target, value });
    //         }
    //     });
    // });


    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(200)) // Increase distance to spread out nodes
        .force('charge', d3.forceManyBody().strength(-500)) // Increase repulsion strength
        .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .style('stroke-width', d => d.value) // Adjust thickness based on value
        .style('stroke', '#999');

    const linkText = svg.append('g')
        .selectAll('text')
        .data(links)
        .join('text')
        .text(d => d.value)
        .style('fill', '#555')
        .style('font-size', '10px');

    const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 20) // Adjust node size as needed
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
    // Label each node with its id
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
}




function GoBackHome() {
    localStorage.clear();
    window.location.href = 'index.html';
}
document.getElementById('goBackHome').addEventListener('click', GoBackHome);