>> filterEvents({date: 2025-07-11})
<< 
[
	{
		series: reading
		value: 15
		units: pages
		notes: chapter 2
		date: 2025-07-11
	},
	{
		series: exercise
		value: 30
		units: minutes
		notes: running
		date: 2025-07-11
	}
]
>> filterEvents({series: reading})
<<
[
	{
		series: reading
		value: 15
		units: pages
		notes: chapter 2
		date: 2025-07-11
	},
	{
		series: reading
		value: 10
		units: pages
		notes: chapter 1
		date: 2025-07-09
	}
]
>> filterEvents({series: reading, date: 2025-07-11})
<<
[
	{
		series: reading
		value: 15
		units: pages
		notes: chapter 2
		date: 2025-07-11
	}
]