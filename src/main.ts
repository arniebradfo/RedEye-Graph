import './styles/global.css';
// import './styles/dot-grid.css' // degrades performance // TODO: rewrite as ts template string
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
		controls: any;
	}
}

const getGraphData = async () => {
	const data: { randomData: GraphData; realData?: GraphData; testData?: GraphData } = {
		randomData: getServers(50, 5),
	};

	try {
		data.realData = (await json('./public-test-data/reviewed-annotated-all.json')) as GraphData;
	} catch {}

	try {
		data.testData = (await json('./public-test-data/miserables.json')) as GraphData;
	} catch {}

	return data;
};

const getPreviouslyParsedGraphData = async () => {
	try {
		return (await json('./public-test-data/parsedGraphData.json')) as SerializableHierarchicalGraphData;
	} catch {
		return undefined;
	}
};

const testGraph = async (svgElementId: string) => {
	const graphData = await getGraphData();
	const previouslyParsedGraphData = await getPreviouslyParsedGraphData();

	const element = document.getElementById(svgElementId) as unknown as SVGSVGElement;

	window.graph = new RedEyeGraph({
		graphData: graphData.realData || graphData.randomData,
		element,
		previouslyParsedGraphData,
		onSelectionChange: (selectedNode) => console.log(selectedNode),
	});
	window.addEventListener('resize', () => window.graph.resize());

	const controls = {
		zoomIn: () => window.graph.zoomIn(),
		zoomOut: () => window.graph.zoomOut(),
		zoomToFit: () => window.graph.zoomToFit(),
		zoomToSelection: () => window.graph.zoomToSelection(),
		toggleForceMode: (e: PointerEvent) => {
			window.graph.toggleForceMode();
			toggleButton(e.target as HTMLButtonElement);
		},
		showMoreLabels: (e: PointerEvent) => {
			element.classList.toggle('showMoreLabels');
			toggleButton(e.target as HTMLButtonElement);
		},
		randomData: () => {
			window.graph.graphData.updateGraphData(getServers(50, 5), { mergeWithCurrentGraphData: false });
			window.graph.zoomToFit();
		},
		realData: () => {
			if (!graphData.realData) return;
			window.graph.graphData.updateGraphData(graphData.realData, { mergeWithCurrentGraphData: false });
			window.graph.zoomToFit();
		},
		testData: () => {
			if (!graphData.testData) return;
			window.graph.graphData.updateGraphData(graphData.testData, { mergeWithCurrentGraphData: false });
			window.graph.zoomToFit();
		},
	};
	window.controls = controls;

	console.log(window.graph);
};

const toggleButton = (buttonElement: HTMLButtonElement) => {
	['bp5-intent-primary', 'bp5-active'].forEach((className) => {
		buttonElement.classList.toggle(className);
	});
};

testGraph('app'); // RUN IT!
