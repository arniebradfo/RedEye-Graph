import { range } from 'd3';
import Jabber from 'jabber';

const jabber = new Jabber();

function uuidv4() {
	// @ts-ignore
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
	);
}

function randomIntFromInterval(min: number, max: number) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getServers = (numNodes: number, numServers = 1) => {
	return range(numServers)
		.map(() => randomGraph(numNodes))
		.reduce(
			(acc: any, curr: any) => {
				const nodeToConnect = acc.nodes[randomIntFromInterval(acc.nodes.length / 2, acc.nodes.length - 1)];
				const nodeToConnect2 = curr.nodes[randomIntFromInterval(curr.nodes.length / 2, curr.nodes.length - 1)];
				acc.nodes.push(...curr.nodes);
				acc.links.push(...curr.links);
				acc.parents.push(...curr.parents);
				if (nodeToConnect && Math.random() > 0.5) {
					acc.links.push({
						source: nodeToConnect.id,
						target: nodeToConnect2.id,
						id: `${nodeToConnect.id}-${nodeToConnect2.id}`,
					});
				}
				return acc;
			},
			{ nodes: [], links: [], parents: [] }
		);
};

export const randomGraph = (numNodes: number) => {
	let parent = {
		id: uuidv4(),
		name: randomCorp(),
	};
	const parents = [parent];
	const nodes = range(numNodes).map((i: number) => {
		if (Math.random() > 0.75) {
			parent = {
				id: uuidv4(),
				name: randomCorp(),
			};
			parents.push(parent);
		}
		return {
			isServer: i === 0,
			name: randomEmail(parent.name), // i === 0 ? null : uuidv4(),
			id: uuidv4(),
			parent: parent.id,
		};
	});
	// const list = chunkArray(nodes);
	const list = unorderedPairs([...nodes]);
	const links = [...list].map(([a, b]: any) => {
		return { source: a.id, target: b.id, id: `${a.id}-${b.id}` };
	});
	return { nodes, links, parents };
};

function unorderedPairs(s: any[], a: any[] = []) {
	// returns the list of all unordered pairs from s
	let i = -1,
		j;
	while (++i < s.length) {
		j = i + 1;
		if (s[j]) {
			a.push([s[i], s[j]]);
			if (Math.random() > 0.25) {
				const first = randomIntFromInterval(1, 5);
				const second = randomIntFromInterval(1, 5);
				a.push(...unorderedPairs([s[j], ...s.splice(j + 1, first)]));
				if (a[second]) {
					a.push(
						...unorderedPairs([
							s[j],
							...s.splice(j + 1, second),
							...(Math.random() > 0.75 ? [s[randomIntFromInterval(j, s.length - 1)]] : []),
						])
					);
				}
			}
		}
	}
	return a;
}

const corp = ' Corp.';
function randomCorp() {
	return jabber.createFullName(false).split(' ')[0] + corp;
}
function randomEmail(randCorp: string) {
	const domain = randCorp.replace(corp, '') + 'Corp.com';
	return jabber.createEmail(domain);
}
