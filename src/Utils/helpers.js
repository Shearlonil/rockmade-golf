const hyphenToSpace = (string) => {
	return string.replace(/-/g, " ");
};

const slashToSpace = (string) => {
	return string.replace(/\//g, " ");
};

const capitalizeFirstLetters = (string) => {
	let theString = string.split(" ");
	let newString = "";
	theString.forEach(
		(e) => {
			newString += e.charAt(0).toUpperCase() + e.slice(1) + " ";
		}
		//   return string.charAt(0).toUpperCase() + string.slice(1);
	);
	return newString;
};

const spaceToHypen = (string) => {
	return string.replace(/ /g, "-");
};

export {
	hyphenToSpace,
	spaceToHypen,
	capitalizeFirstLetters as capitalizeFirstLetter,
	slashToSpace,
};
