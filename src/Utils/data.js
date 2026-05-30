import IMAGES from "../assets/images";
import {
    HiBolt,
    HiOutlineTrophy,
} from "react-icons/hi2";
import { BiBullseye } from "react-icons/bi";
import {
    HiClock,
    HiShieldCheck,
    HiUsers,
} from "react-icons/hi";

const features = [
	{
		Icon: HiOutlineTrophy,
		title: "Exclusive Tournaments",
		desc: "Compete in members-only events with prestigious prizes.",
	},
	{
		Icon: HiClock,
		title: "Priority Tee Times",
		desc: "Book up to 14 days in advance at premium courses.",
	},
	{
		Icon: BiBullseye,
		title: "Pro Coaching",
		desc: "Personalized training with PGA-certified instructors.",
	},
	{
		Icon: HiUsers,
		title: "Elite Network",
		desc: "Connect with influential golfers and business leaders.",
	},
	{
		Icon: HiShieldCheck,
		title: "Premium Insurance",
		desc: "Full coverage for equipment, travel, and tournaments.",
	},
	{
		Icon: HiBolt,
		title: "VIP Experiences",
		desc: "Pro-am events, player meet-ups, behind-the-scenes tours.",
	},
];

const testimonials = [
	{
		name: "Michael Chen",
		tier: "Gold",
		avatar: "MC",
		content: "RockMade Golf transformed my game and my network.",
	},
	{
		name: "Sarah Williams",
		tier: "Silver",
		avatar: "SW",
		content: "The exclusive tournaments are incredible.",
	},
	{
		name: "David Rodriguez",
		tier: "Gold",
		avatar: "DR",
		content: "Best investment in my golf journey.",
	},
	{
		name: "Emma Thompson",
		tier: "Bronze",
		avatar: "ET",
		content: "Even as a Bronze member I get amazing courses.",
	},
	{
		name: "James Patterson",
		tier: "Gold",
		avatar: "JP",
		content: "Improved my handicap by 4 strokes.",
	},
];

const ambassadors = [
	{
		name: "Alex Morgan",
		role: "PGA Tour Professional",
		achievement: "2023 Masters Top 10",
		handicap: "+4.2",
	},
	{
		name: "Jessica Lee",
		role: "LPGA Rising Star",
		achievement: "2024 Rookie of the Year",
		handicap: "+3.8",
	},
	{
		name: "Robert Hayes",
		role: "Club Champion",
		achievement: "15x Regional Winner",
		handicap: "0.2",
	},
];

const galleryItems = [
	{
		id: 1,
		src: IMAGES.agc_10,
		title: "Championship Tournament",
		caption: "Annual Masters Qualifier",
	},
	{
		id: 2,
		src: IMAGES.agc_13,
		title: "Pro-Am Event",
		caption: "Playing with PGA Pros",
	},
	{
		id: 3,
		src: IMAGES.image3,
		title: "Sunrise Session",
		caption: "Early Morning at Pebble Beach",
	},
	{
		id: 4,
		src: IMAGES.image4,
		title: "Member Networking",
		caption: "Business on the Fairway",
	},
	{
		id: 5,
		src: IMAGES.agc_14,
		title: "Coaching Clinic",
		caption: "Swing Analysis Session",
	},
	{
		id: 6,
		src: IMAGES.image6,
		title: "Victory Celebration",
		caption: "Gold Member Awards",
	},
];

const stats = [
	{ num: 1200, label: "Active Members", suffix: "+" },
	{ num: 45, label: "Annual Tournaments", suffix: "" },
	{ num: 150, label: "Partner Courses", suffix: "+" },
	{ num: 98, label: "Member Satisfaction", suffix: "%" },
];

const gameModes = [
    {
        id: 2,
        name: "Member Game",
        availability: true,
        desc: "Perfect for casual play or practice. Invite friends or join a friendly round at registered golf courses near you.",
        image: IMAGES.image3,
    },
    {
        id: 1,
        name: "Tournament Game",
        availability: true,
        desc: "Compete in structured competitions and climb the leaderboard.",
        image: IMAGES.image5,
    },
    {
        id: 3,
        name: "Versus Game",
        availability: false,
        desc: "Set up two teams/groups to battle against each other. COMING SOON",
        image: IMAGES.image2,
    },
];

const courseSearchOptions = [
	{
		label: 'Home Club',
		value: true
	},
	{
		label: 'All Clubs',
		value: false
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
];

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
	features,
	testimonials,
	ambassadors,
	galleryItems,
	stats,
	gameModes,
    groupSizeOptions,
	courseSearchOptions,
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