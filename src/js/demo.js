import * as d3 from 'd3'
export function draw () {
  // 数据示例：这里只是一个简单的示例，实际使用时需要根据具体情况提供真实数据
  const data = {
    nodes: [
        { id: 1, name: "祖父" },
        { id: 2, name: "祖母" },
        { id: 3, name: "父亲" },
        { id: 4, name: "母亲" },
        { id: 5, name: "我" },
    ],
    links: [
        { source: 1, target: 3 },
        { source: 2, target: 3 },
        { source: 3, target: 5 },
        { source: 4, target: 5 },
    ],
};

const width = 500;
const height = 300;

const svg = d3.select("#container")
    .attr("width", width)
    .attr("height", height);

const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).strength(1).distance(50).iterations(10))
    .force("charge", d3.forceManyBody().strength(-120))
    .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.selectAll(".link")
    .data(data.links)
    .enter().append("line")
    .attr("class", "link");

const node = svg.selectAll(".node")
    .data(data.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 10);

simulation.on("tick", () => {
    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x)
        .attr("cy", d => d.y);
});
}