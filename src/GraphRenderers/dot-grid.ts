import { ZoomTransform } from 'd3';

export function dotGrid(element: HTMLElement | SVGElement = document.documentElement, dotDistance = 40) {
	function draw(transform: ZoomTransform) {
		// https://stackoverflow.com/a/466256/5648839
		const roundDownToPower = Math.pow(2, Math.floor(Math.log2(transform.k)));
		const dotSpacing = (transform.k / roundDownToPower) * dotDistance;
		const dotOffsetX = transform.x % dotSpacing;
		const dotOffsetY = transform.y % dotSpacing;
		const dotOpacity = 0.3;
		const dotSubOpacityMultiplier = (dotSpacing - dotDistance) / dotDistance;
		const dotSubOpacity = roundPercent(dotOpacity * dotSubOpacityMultiplier);
		const dotGradient = `hsla(${dotColorHsl}, ${dotOpacity}) 1px, transparent 0`;
		const dotSubGradient = `hsla(${dotColorHsl}, ${dotSubOpacity}) 1px, transparent 0`;
		const backgroundImage = sides
			.map((side) => `radial-gradient(circle at ${side}, ${dotSubGradient})`)
			.concat(`radial-gradient(${dotGradient})`)
			.join(',');
		const backgroundSize = `${dotSpacing}px ${dotSpacing}px`
		const backgroundPositionX = `calc(50% + ${dotOffsetX}px)`
		const backgroundPositionY = `calc(50% + ${dotOffsetY}px)`
		element.style.setProperty('background-image', backgroundImage);
		element.style.setProperty('background-size', backgroundSize);
		element.style.setProperty('background-position-x', backgroundPositionX);
		element.style.setProperty('background-position-y', backgroundPositionY);
	}
	return draw;
}

const dotColorHsl = `var(--dot-color-hsl)` // `0, 0%, 100%`; // 

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

const roundPercent = (percent: number) => Math.round(percent * 100) * .01
