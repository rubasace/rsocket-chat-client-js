// for more info, read https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

import {isMobileDevice} from '@/util/device-type-detection';

export default function fixVhUnits() {
	if (isMobileDevice()) {
		setVhCssPropertyForMobileDevices();
		window.addEventListener('resize', throttle(setVhCssPropertyForMobileDevices, 100));
	} else {
		setVhCssPropertyForNonMobileDevices();
	}
}

function setVhCssPropertyForNonMobileDevices(): void {
	document.documentElement.style.setProperty('--vh', '1vh');
}

function setVhCssPropertyForMobileDevices(): void {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

function throttle(fn: Function, wait: number) {

	let lastExecTime = 0;
	let lastExecResult: any = undefined;

	return function (this: any) {

		const currentTime = Date.now();
		const elapsedTime = currentTime - lastExecTime;

		if (elapsedTime >= wait) {
			lastExecTime = currentTime;
			lastExecResult = fn.call(this, arguments);
		}

		return lastExecResult;

	};

}
