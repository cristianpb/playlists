<script>
  import Sigma from 'sigma';
  import Graph from 'graphology';
  import circular from "graphology-layout/circular";
  import forceAtlas2 from "graphology-layout-forceatlas2";
  import { onMount } from 'svelte';

  onMount(() => {
    const container1 =  document.getElementById("sigma-container");


      const graph = new Graph();

      // graph.addNode("John", { x: 0, y: 10, size: 15, label: "John", color: "blue" });
      // graph.addNode("Mary", { x: 10, y: 0, size: 10, label: "Mary", color: "green" });
      // graph.addNode("Thomas", { x: 7, y: 9, size: 20, label: "Thomas", color: "red" });
      // graph.addNode("Hannah", { x: -7, y: -6, size: 25, label: "Hannah", color: "teal" });

      // graph.addEdge("John", "Mary");
      // graph.addEdge("John", "Thomas");
      // graph.addEdge("John", "Hannah");
      // graph.addEdge("Hannah", "Thomas");
      // graph.addEdge("Hannah", "Mary");

    graph.import({
      attributes: {name: 'My Graph'},
      nodes: [{key: 'Thomas'}, {key: 'Eric'}],
      edges: [{source: 'Thomas', target: 'Eric'}]
    });

        // 6. Position nodes on a circle, then run Force Atlas 2 for a while to get
    //    proper graph layout:
    circular.assign(graph);
    const settings = forceAtlas2.inferSettings(graph);
    forceAtlas2.assign(graph, { settings, iterations: 600 });


      const renderer = new Sigma(graph, container1);

  });


</script>
<h1> Sigma graph exemple</h1>
<div id="sigma-container" />

<style>
  #sigma-container {
      width: 100%;
      height: 450px;
  }
</style>
