import React, { useState } from "react";
import { FiPlus, FiRefreshCcw } from "react-icons/fi";
import { GrFormClose } from "react-icons/gr";

export default function PriceSummary(props) {
	// const [data, setData] = useState({
	//   discount: { name: "Discount", value: "", type: true, display: true },
	//   tax: { name: "Tax", value: "", type: true, display: false },
	//   shipping: { name: "Shipping", type: true, value: "", display: false },
	// });
	const { data, setData, currency } = props;

	function handleChange(e) {
		e.preventDefault();
		const { value, name } = e.target;
		const onchangeVal = { ...data };

		if (name == "discountName") onchangeVal["discount"]["name"] = value;

		if (name == "discountValue") onchangeVal["discount"]["value"] = value;

		if (name == "taxName") onchangeVal["tax"]["name"] = value;

		if (name == "taxValue") onchangeVal["tax"]["value"] = value;

		if (name == "shippingName") onchangeVal["shipping"]["name"] = value;

		if (name == "shippingValue") onchangeVal["shipping"]["value"] = value;

		setData(onchangeVal);
	}

	function handleAdd(e) {
		e.preventDefault();
		const { name } = e.target;
		setData((prevState) => ({
			...prevState,
			[name]: { ...prevState[name], display: true },
		}));
	}

	function deleteItem(e, name) {
		e.preventDefault();
		setData((prevState) => ({
			...prevState,
			[name]: { ...prevState[name], display: false, value: "" },
		}));
	}

	function resetInput(e, name) {
		e.preventDefault();
		setData((prevState) => ({
			...prevState,
			[name]: { ...prevState[name], value: "" },
		}));
	}

	function toggleType(e) {
		e.preventDefault();
		const { name } = e.target;
		setData((prevState) => ({
			...prevState,
			[name]: { ...prevState[name], type: !prevState[name]["type"] },
		}));
	}

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			// Trigger the click event on the desired button
			// Here, we're triggering the click event on the first button (index 0)
		}
	};

	return (
		<>
			{data?.discount?.display && (
				<div
					className={"mt-3 flex items-center justify-end relative space-x-4"}
				>
					<div className="flex-1">
						<input
							type="text"
							className={
								"input input-sm input-primary w-full text-right w-[100px] float-right border-transparent w-[75%] rounded-sm"
							}
							name="discountName"
							onChange={(e) => handleChange(e)}
							onKeyDown={handleKeyPress}
							value={data?.discount?.name}
						/>
					</div>
					<div className="relative ">
						<input
							type="number"
							className="w-[100px] input input-sm input-primary rounded-sm text-right pr-11"
							name="discountValue"
							onChange={(e) => handleChange(e)}
							onKeyDown={handleKeyPress}
							value={data?.discount?.value}
						/>
						<button
							className="absolute right-[25px] top-1/2 translate-y-[-50%] p-0 btn-white border-0"
							onClick={toggleType}
							name="discount"
						>
							{data?.discount?.type ? "%" : currency}
						</button>
						<button
							className={
								"absolute right-[1.5px] top-1/2 translate-y-[-50%] p-0 btn-white border-0 rounded-s-none bg-gray-100 rounded-sm h-[calc(100%-2px)] min-h-[calc(100%-2px)]"
							}
							onClick={(e) => resetInput(e, "discount")}
						>
							<FiRefreshCcw />
						</button>
					</div>
				</div>
			)}

			{data?.tax?.display && (
				<div className="mt-2 flex items-center justify-end relative space-x-4">
					<div className="text-right">
						<input
							type="text"
							className="w-[75%] input input-sm input-primary rounded-sm border-transparent text-right"
							name="taxName"
							onChange={(e) => handleChange(e)}
							value={data?.tax?.name}
						/>
					</div>
					<div className="relative">
						<input
							type="number"
							className="w-[100px] input input-sm input-primary rounded-sm  text-right pr-11"
							name="taxValue"
							onChange={(e) => handleChange(e)}
							value={data?.tax?.value}
						/>
						<button
							className="absolute right-[25px] top-1/2 translate-y-[-50%] p-0 btn-white border-0"
							onClick={toggleType}
							name="tax"
						>
							{data?.tax?.type ? "%" : currency}
						</button>
						<button
							className="absolute right-[1.5px] top-1/2 translate-y-[-50%] p-0 btn-white border-0 rounded-s-none bg-gray-100 rounded-sm h-[calc(100%-2px)] min-h-[calc(100%-2px)]"
							onClick={(e) => resetInput(e, "tax")}
						>
							<FiRefreshCcw />
						</button>
						<button
							onClick={(e) => deleteItem(e, "tax")}
							className="absolute right-[-20px] top-1/2 translate-y-[-50%]"
						>
							<GrFormClose />
						</button>
					</div>
				</div>
			)}

			{data?.shipping?.display && (
				<div className="mt-2 flex items-center justify-end relative space-x-4">
					<div className="text-right">
						<input
							type="text"
							className="input input-sm input-primary w-[75%] text-right border-transparent rounded-sm"
							name="shippingName"
							onChange={(e) => handleChange(e)}
							value={data?.shipping?.name}
						/>
					</div>
					<div className="relative">
						<input
							type="number"
							className="input input-sm input-primary w-[100px] rounded-sm  text-right pr-11"
							name="shippingValue"
							onChange={(e) => handleChange(e)}
							value={data?.shipping?.value}
						/>
						<button
							className="absolute right-[25px] top-1/2 translate-y-[-50%] p-0 btn-white border-0"
							onClick={toggleType}
							name="shipping"
						>
							{data?.shipping?.type ? "%" : currency}
						</button>
						<button
							className="absolute right-[1.5px] top-1/2 translate-y-[-50%] p-0 btn-white border-0 rounded-s-none bg-gray-100 rounded-sm h-[calc(100%-2px)] min-h-[calc(100%-2px)]"
							onClick={(e) => resetInput(e, "shipping")}
						>
							<FiRefreshCcw />
						</button>
						<button
							onClick={(e) => deleteItem(e, "shipping")}
							className="absolute right-[-20px] top-1/2 translate-y-[-50%]"
						>
							<GrFormClose />
						</button>
					</div>
				</div>
			)}

			<div className="flex justify-end mt-3 space-x-3 mb-3">
				{!data?.tax?.display && (
					<div>
						<button
							className="flex items-center btn btn-white btn-sm text-success space-x-2"
							name="tax"
							onClick={(e) => handleAdd(e)}
						>
							<FiPlus /> Tax
						</button>
					</div>
				)}
				{!data?.shipping?.display && (
					<div>
						<button
							className="flex align-center btn btn-white btn-sm text-success space-x-2"
							name="shipping"
							onClick={(e) => handleAdd(e)}
						>
							<FiPlus /> Shipping
						</button>
					</div>
				)}
			</div>
		</>
	);
}
