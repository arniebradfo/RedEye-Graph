import './styles/global.css';
import './styles/dot-grid.css' // degrades performance // TODO: rewrite as ts template string
// import './styles/debug-style.css';

import './styles/blueprint-tokens.css';
import './styles/blueprint.css';
import './styles/override-tokens.css';
import './styles/override.css';
import './styles/bp5-dark.css';
import './styles/graph-styles.css';

import { json } from 'd3';
import { getServers } from './GraphData/random-graph';
import { GraphHandler as RedEyeGraph } from './GraphHandler';
import { GraphData, SerializableHierarchicalGraphData } from './GraphData/types';

declare global {
	interface Window {
		graph: RedEyeGraph;
	}
}

const getGraphData = async () => {
	try {
		return (await json('./private-test-data/reviewed-annotated-all.json')) as GraphData;
	} catch {
		try {
			return (await json('./public-test-data/miserables.json')) as GraphData;
		} catch {
			return getServers(75, 5);
		}
	}
};

const getPreviouslyParsedGraphData = async () => {
	try {
		return (await json('./private-test-data/parsedGraphData.json')) as SerializableHierarchicalGraphData;
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
