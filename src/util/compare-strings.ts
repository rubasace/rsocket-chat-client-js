export default function compareStrings(first: string, second: string): number {
	return first.localeCompare(second, undefined, {
		sensitivity: 'base'
	});
}
