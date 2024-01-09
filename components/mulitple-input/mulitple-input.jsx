import { Fragment, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { GrFormClose } from "react-icons/gr";

export default function MultipleInput(props) {
	//   const [data, setData] = useState([{ quantity: "", rate: "", description: "" }]);
	const { data, setData, currency } = props;

	const handleClick = (e) => {
		e.preventDefault();
		setData([...data, { quantity: 0, rate: 0, description: "" }]);
	};
	const handleChange = (e, i) => {
		const { name, value } = e.target;
		const onchangeVal = [...data];
		onchangeVal[i][name] = value;
		setData(onchangeVal);
	};
	const handleDelete = (e, i) => {
		e.preventDefault();
		const deleteVal = [...data];
		deleteVal.splice(i, 1);
		setData(deleteVal);
	};
	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			// Trigger the click event on the desired button
			// Here, we're triggering the click event on the first button (index 0)
		}
	};

	const [textareaHeight, setTextareaHeight] = useState({});

	function handleTextareaChange(e, i) {
		e.preventDefault();
		const { name, value } = e.target;
		const onchangeVal = [...data];
		onchangeVal[i][name] = value;
		setData(onchangeVal);

		if (value) {
			setTextareaHeight((prevState) => ({
				...prevState,
				[name + i]: e.target.scrollHeight,
			}));
		} else {
			setTextareaHeight((prevState) => ({ ...prevState, [name + i]: null }));
		}
	}

	console.log(data);

	return (
		<Fragment>
			<div
				className={
					"bg-neutral flex text-white rounded py-1 mb-2 w-full float-left px-3 space-x-4"
				}
			>
				<div className={"w-[calc(70%-20px)]"}>Item</div>
				<div className={"flex-1 text-right"}>Quantity</div>
				<div className={"flex-1 text-right"}>Rate</div>
				<div className={"flex-1 text-right"}>Amount</div>
			</div>

			{data?.map((val, i) => (
				<div
					className={
						"flex text-white rounded py-1 mb-2 w-full float-left px-3 space-x-4 items-center"
					}
					key={i}
				>
					<div className="min-w-[calc(70%-20px)] overflow-y-hidden">
						<textarea
							name="description"
							className={
								"textarea textarea-primary text-area-xs rounded-sm w-full text-neutral "
							}
							onChange={(e) => handleTextareaChange(e, i)}
							placeholder="Description of service of product"
							value={val.description}
							style={{ height: textareaHeight["description" + i] || "35px" }}
						></textarea>
					</div>
					<div className="flex-1">
						<input
							name="quantity"
							value={val.quantity}
							type="number"
							placeholder="Quantity"
							onChange={(e) => handleChange(e, i)}
							onKeyDown={handleKeyPress}
							className={
								"input input-sm w-full input-primary rounded-sm text-neutral mb-2 text-right"
							}
						/>
					</div>
					<div className="flex-1">
						<input
							name="rate"
							type="number"
							value={val.rate}
							onChange={(e) => handleChange(e, i)}
							onKeyDown={handleKeyPress}
							className={
								"input input-sm input-primary w-full rounded-sm text-neutral mb-2 text-right"
							}
						/>
					</div>
					<div className={"flex-1"}>
						<div className="relative text-neutral text-right">
							{currency}
							{data[i]["quantity"] * data[i]["rate"]}

							{data?.length > 1 && i != 0 && (
								<button
									onClick={(e) => handleDelete(e, i)}
									className="absolute top-1/2 translate-y-[-50%] right-[-20px]"
								>
									<GrFormClose />
								</button>
							)}
						</div>
					</div>
				</div>
			))}

			<button
				onClick={handleClick}
				className={" btn btn-success btn-sm ms-3 text-white rounded-sm"}
			>
				<FiPlus />
				Add
			</button>
			{/* <p>{JSON.stringify(data)}</p> */}
		</Fragment>
	);
}
