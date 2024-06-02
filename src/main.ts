import './style.css';
import { json } from 'd3';
import { getServers } from './GraphData/random-graph';
import { GraphHandler as RedEyeGraph } from './GraphHandler';
import { SerializableHierarchicalGraphData } from './GraphData/types';

declare global {
	interface Window {
		graph: RedEyeGraph;
	}
}

const getGraphData = async () => {
	try {
		return (await json('./testData/small.json')) as SerializableHierarchicalGraphData;
	} catch {
		return getServers(75, 5);
	}
};

const getPreviouslyParsedGraphData = async () => {
	try {
		return (await json('./testData/parsedGraphData.json')) as SerializableHierarchicalGraphData;
	} catch {
		return undefined;
	}
};

const testGraph = async (svgElementId: string) => {
	const graphData = await getGraphData();
	const previouslyParsedGraphData = await getPreviouslyParsedGraphData();

	const element = document.getElementById(svgElementId) as unknown as SVGSVGElement;

	window.graph = new RedEyeGraph({
		graphData,
		element,
		previouslyParsedGraphData,
		onSelectionChange: (selectedNode) => console.log(selectedNode),
	});
	window.addEventListener('resize', () => window.graph.resize());
	console.log(window.graph);
};

testGraph('app'); // RUN IT!
