import { FiPlus } from "react-icons/fi";
import { GrFormClose } from "react-icons/gr";

export default function PoNumber(props) {
	// const [data, setData] = useState([{ name: "PO Number", value: "" }]);
	const { data, setData } = props;

	const handleClick = (e) => {
		e.preventDefault();
		setData([...data, { name: "New", value: "" }]);
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

	return (
		<>
			{data?.map((item, i) => (
				<div
					className={"mt-2 flex items-center justify-end"}
					style={{ gap: "5px" }}
					key={i}
				>
					<input
						type="text"
						className="input input-sm text-right input-primary border-white rounded-sm"
						name="name"
						onChange={(e) => handleChange(e, i)}
						onKeyDown={handleKeyPress}
						value={item.name}
					/>
					<div className="relative">
						<input
							type="number"
							className="input input-sm input-primary rounded-sm w-[175px]"
							name="value"
							onChange={(e) => handleChange(e, i)}
							onKeyDown={handleKeyPress}
							value={item.value}
						/>
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
			))}

			{data?.length < 5 && (
				<button
					onClick={handleClick}
					className={"btn btn-primary btn-xs mt-2 rounded-sm"}
				>
					<FiPlus />
					Add
				</button>
			)}
		</>
	);
}
