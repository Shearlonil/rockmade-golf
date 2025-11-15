import IMAGES from "../assets/images";

const gameModes = [
    {
        id: 2,
        name: "Member Game",
        desc: "Perfect for casual play or practice. Invite friends or join a friendly round at registered golf courses near you.",
        image: IMAGES.image3,
    },
    {
        id: 1,
        name: "Tournament Game",
        desc: "Compete in structured competitions and climb the leaderboard.",
        image: IMAGES.image5,
    },
    {
        name: "Versus Game",
        desc: "Perfect for casual play or practice. Invite friends or join a friendly round at registered golf courses near you.",
        image: IMAGES.image2,
    },
];

export {
	gameModes,
};

/*	https://stackblitz.com/edit/disable-dates-datetime-react-app?file=src%2FApp.js
	// disable past dates
	const yesterday = moment().subtract(1, 'day');
	const disablePastDt = current => {
		return current.isAfter(yesterday);
	};

	// disable future dates
	const today = moment();
	const disableFutureDt = current => {
		return current.isBefore(today)
	}

	// disable weekends
	const disableWeekends = current => {
		return current.day() !== 0 && current.day() !== 6;
	}

	// disable the list of custom dates
	const customDates = ['2020-04-08', '2020-04-04', '2020-04-02'];
	const disableCustomDt = current => {
	return !customDates.includes(current.format('YYYY-MM-DD'));
	}

	return (
	<div className="App">
		<h2>Disable dates in react-datetime - <a href="https://www.cluemediator.com" target="_blank">Clue Mediator</a></h2>

		<p className="title">Disable past dates:</p>
		<DatePicker
			timeFormat={false}
			isValidDate={disablePastDt}
		/>

		<p className="title">Disable future dates:</p>
		<DatePicker
			timeFormat={false}
			isValidDate={disableFutureDt}
		/>

		<p className="title">Disable weekends:</p>
		<DatePicker
			timeFormat={false}
			isValidDate={disableWeekends}
		/>

		<p className="title">Disable the list of custom dates: <small>(2020-04-08, 2020-04-04, 2020-04-02)</small></p>
		<DatePicker
			timeFormat={false}
			isValidDate={disableCustomDt}
		/>
	</div>
	);
*/