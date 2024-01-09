import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePicker(props) {
	const { date, setDate } = props;
	return (
		<ReactDatePicker
			selected={date}
			onChange={(date) => setDate(date)}
			peekNextMonth
			showMonthDropdown
			showYearDropdown
			dropdownMode="select"
			closeOnScroll={true}
			className="w-[175px] input input-sm input-primary rounded-sm"
		/>
	);
}
