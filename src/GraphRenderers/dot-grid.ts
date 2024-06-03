import { ZoomTransform } from 'd3';

export function dotGrid(dotDistance = 40) {
	const styleElement = document.createElement('style');
	styleElement.id = 'dotGridStyle';
	document.head.appendChild(styleElement);
	function draw(transform: ZoomTransform) {
		// https://stackoverflow.com/a/466256/5648839
		const roundDownToPower = Math.pow(2, Math.floor(Math.log2(transform.k)));
		const dotSpacing = (transform.k / roundDownToPower) * dotDistance;
		const dotOffsetX = transform.x % dotSpacing;
		const dotOffsetY = transform.y % dotSpacing;
		const dotOpacity = 0.3;
		const dotSubOpacityMultiplier = (dotSpacing - dotDistance) / dotDistance;
		const dotSubOpacity = dotOpacity * dotSubOpacityMultiplier;
		const dotGradient = `hsla(${dotColorHsl}, ${dotOpacity}) 1px, transparent 0`;
		const dotSubGradient = `hsla(${dotColorHsl}, ${dotSubOpacity}) 1px, transparent 0`;
		const backgroundImage = sides
			.map((side) => `radial-gradient(circle at ${side}, ${dotSubGradient})`)
			.concat(`radial-gradient(${dotGradient})`)
			.join(',\n');
		const backgroundSize = `${dotSpacing}px ${dotSpacing}px`;
		const backgroundPositionX = `calc(50% + ${dotOffsetX}px)`;
		const backgroundPositionY = `calc(50% + ${dotOffsetY}px)`;

		const properties = [
			['--dot-color-hsl', '0, 0%, 50%'],
			['background-size', backgroundSize],
			['background-position-x', backgroundPositionX],
			['background-position-y', backgroundPositionY],
			['background-image', backgroundImage],
		]
			.map(([prop, value]) => `${prop}: ${value};`)
			.join('\n');
		styleElement.innerHTML = `.${dotGridClassName}{\n${properties}\n}`;
	}
	return draw;
}

export const dotGridClassName = 'dotGrid';

const dotColorHsl = `var(--dot-color-hsl)`;

const sides = [
	'top left',
	// 'top', // this is the primary dot
	'top right',
	'right',
	'bottom right',
	'bottom',
	'bottom left',
	'left',
];
