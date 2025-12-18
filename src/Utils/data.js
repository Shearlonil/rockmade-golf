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
        id: 3,
        name: "Versus Game",
        desc: "Perfect for casual play or practice. Invite friends or join a friendly round at registered golf courses near you.",
        image: IMAGES.image2,
    },
];

const groupSizeOptions = [
	{
		label: '2',
		value: 2
	},
	{
		label: '3',
		value: 3
	},
	{
		label: '4',
		value: 4
	},
	{
		label: '5',
		value: 5
	}
]

const gender = [
	{
		label: 'Male',
		value: "M"
	},
	{
		label: 'Female',
		value: "F"
	}
];

const holeMode = [
	{
		label: '18 Holes',
		value: 18
	},
	{
		label: '9 Holes',
		value: 9
	}
];

const statusOptions = [
	{
		label: 'Active',
		value: true
	},
	{
		label: 'Inactive',
		value: false
	}
];

const pageSizeOptions = [
	{
		label: '20',
		value: 20
	},
	{
		label: '50',
		value: 50
	},
	{
		label: '100',
		value: 100
	},
	{
		label: '200',
		value: 200
	},
	{
		label: '500',
		value: 500
	},
	{
		label: '1000',
		value: 1000
	}
];

// Dynamic form field configuration
const dynamic18Fields = [
    { name: 'hcp1', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par1', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp2', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par2', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp3', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par3', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp4', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par4', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp5', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par5', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp6', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par6', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp7', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par7', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp8', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par8', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp9', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par9', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp10', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par10', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp11', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par11', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp12', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par12', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp13', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par13', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp14', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par14', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp15', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par15', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp16', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par16', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp17', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par17', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp18', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par18', type: 'number', label: 'PAR', required: true, min: 1 },
];

const dynamic9Fields = [
    { name: 'hcp1', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par1', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp2', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par2', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp3', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par3', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp4', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par4', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp5', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par5', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp6', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par6', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp7', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par7', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp8', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par8', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'hcp9', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par9', type: 'number', label: 'PAR', required: true, min: 1 },
];

const dynamic18Hcp = [
    { name: 'hcpOne', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpTwo', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpThree', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpFour', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpFive', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpSix', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpSeven', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpEight', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpNine', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpTen', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpEleven', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpTwelve', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpThirteen', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpFourteen', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpFifteen', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpSixteen', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpSeventeen', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'hcpEighteen', type: 'number', label: 'HCP', required: true, min: 1 },
];

const dynamic18Pars = [
    { name: 'parOne', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parTwo', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parThree', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parFour', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parFive', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parSix', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parSeven', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parEight', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parNine', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parTen', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parEleven', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parTwelve', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parThirteen', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parFourteen', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parFifteen', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parSixteen', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parSeventeen', type: 'number', label: 'PAR', required: true, min: 1 },
    { name: 'parEighteen', type: 'number', label: 'PAR', required: true, min: 1 },
];

export {
	gameModes,
    groupSizeOptions,
	gender,
	holeMode,
	dynamic18Fields,
	dynamic9Fields,
    statusOptions,
    pageSizeOptions,
};

/*	
	AbortController
	refs:
	https://blog.logrocket.com/complete-guide-abortcontroller/
	https://dev.to/rigalpatel001/the-easy-way-to-cancel-fetch-requests-when-you-dont-need-them-1d3g
	https://medium.com/@ajayverma_5579/abortcontroller-how-to-cancel-ongoing-api-requests-b1df3251eec7

	
	DATE-FNS
	https://stackblitz.com/edit/disable-dates-datetime-react-app?file=src%2FApp.js
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