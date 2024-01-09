import React from "react";
import parse from "html-react-parser";
export default function PrintTemplate(props) {
	const {
		data,
		base64Data,
		date,
		dueDate,
		mulitpleInputData,
		numberInput,
		priceSummary,
		selectedCurrency,
		subTotal,
		discount,
		tax,
		shippingCharge,
		balance,
		balanceDue,
		history,
	} = props;

	function getDate(date) {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		const day = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear();
		return `${month} ${day}, ${year}`;
	}

	return (
		<div
			className="bg-white w-[21cm] h-[29.7cm]"
			id="printForm"
			style={{ display: "none" }}
		>
			<div className={"p-8 "}>
				<div className="flex px-4 space-x-4 justify-between">
					<div>
						<img
							src={base64Data}
							alt=""
							className="max-w-[150px] max-h-[150px]"
						/>
					</div>
					<div>
						<h1 className="text-right text-4xl">INVOICE</h1>
						<div className="text-end">#1</div>
					</div>
				</div>

				<div className="flex space-x-4 px-4">
					<div className={"w-[40%]"}>
						<div className="mt-3">
							<p className={"fw-bold whitespace-pre-wrap"}>
								{parse(data?.invoiceFrom)}
							</p>
						</div>
						<div className="row mt-3">
							<div className="col-md-6">
								<p>{data?.billTo}</p>
								<p className={"fw-bold whitespace-pre-wrap"}>
									{data?.billToValue}
								</p>
							</div>
							<div className="col-md-6">
								<p>{data.shipTo}</p>
								<p className={"fw-bold whitespace-pre-wrap"}>
									{data.shipToValue}
								</p>
							</div>
						</div>
					</div>

					<div className="w-[60%] text-right float">
						<div className="flex items-center justify-end space-x-4 mb-2">
							<div>
								<p>{data.date}</p>
							</div>
							<div className="w-[150px]">
								<p>{getDate(date)}</p>
							</div>
						</div>

						<div className="flex items-center justify-end space-x-4 mb-2">
							<div>
								<p>{data?.payTerms}</p>
							</div>
							<div className={"w-[150px]"}>
								<p>{data.payTermsValue}</p>
							</div>
						</div>

						<div className="flex items-center justify-end space-x-4 mb-2">
							<div>
								<p>{data.dueDate}</p>
							</div>
							<div className="w-[150px]">
								<p>{getDate(dueDate)}</p>
							</div>
						</div>

						{numberInput?.map((item, index) => (
							<div
								className="flex items-center justify-end space-x-4 mb-2"
								key={index}
							>
								<div>
									<p className="mb-2">{item?.name}</p>
								</div>
								<div className="w-[150px]">
									<p className="mb-2">{item.value}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="px-4 mt-3">
					<div className="flex bg-neutral text-white rounded py-1 items-center px-4">
						<div className="w-[70%]">
							<div>Item</div>
						</div>
						<div className="flex-1">
							<div className="flex">
								<div className="flex-1 text-end">Quantity</div>
								<div className="flex-1 text-end">Rate</div>
								<div className="flex-1 text-end">Amount</div>
							</div>
						</div>
					</div>

					{mulitpleInputData?.map((item, index) => (
						<div
							className="flex rounded py-1 items-center px-4"
							style={{ fontSize: "14px" }}
							key={index}
						>
							<div className="w-[70%]">
								<div className="fw-bold text-wrap">
									<p className={"m-0 p-0 whitespace-pre-wrap"}>
										{item?.description}
									</p>
								</div>
							</div>
							<div className="flex-1">
								<div className="flex">
									<div className="flex-1 text-end">{item?.quantity}</div>
									<div className="flex-1 text-end">{item?.rate}</div>
									<div className="flex-1 text-end">
										{selectedCurrency}
										{(item?.quantity * item?.rate).toFixed(2)}
									</div>
								</div>
							</div>
						</div>
					))}

					<div className="text-right mt-8">
						<div className="flex justify-end mb-2">
							<div>Subtotal:</div>
							<div className="text-end w-[150px]">
								{selectedCurrency}
								{subTotal?.toFixed(2)}
							</div>
						</div>
						{discount ? (
							<div className="flex justify-end mb-2">
								<div>
									Discount{" "}
									{priceSummary?.discount?.type &&
										`(${priceSummary?.discount?.value}%)`}
									:
								</div>
								<div className="text-end w-[150px]">
									{selectedCurrency}
									{discount?.toFixed(2)}
								</div>
							</div>
						) : null}
						{tax && tax != 0 ? (
							<div className="flex justify-end mb-2">
								<div>
									Tax{" "}
									{priceSummary?.tax?.type && `(${priceSummary?.tax?.value}%)`}:
								</div>
								<div className="text-end w-[150px]">
									{selectedCurrency}
									{tax?.toFixed(2)}
								</div>
							</div>
						) : null}
						{shippingCharge && shippingCharge != 0 ? (
							<div
								className="flex justify-end mb-2"
								style={{ fontSize: "14px" }}
							>
								<div>
									Shipping{" "}
									{priceSummary?.shipping?.type &&
										`(${priceSummary?.shipping?.value}%)`}
									:
								</div>

								<div className="text-end w-[150px]">
									{selectedCurrency}
									{shippingCharge?.toFixed(2)}
								</div>
							</div>
						) : null}

						{data?.amtPaidValue && data?.amtPaidValue != 0 ? (
							<div className="flex justify-end mb-2">
								<div>Amount Paid :</div>

								<div className="text-end w-[150px]">
									{selectedCurrency}
									{data?.amtPaidValue}
								</div>
							</div>
						) : null}

						<div className="flex justify-end mb-2">
							<div>Balance:</div>

							<div className="text-end w-[150px]">
								{selectedCurrency}
								{balanceDue?.toFixed(2)}
							</div>
						</div>
					</div>

					<div className="mt-4">
						{data?.notesValue && (
							<div>
								<p className="text-muted p-0 m-0">{data?.notes}</p>
								<p className="whitespace-pre-wrap">{data?.notesValue}</p>
							</div>
						)}

						{data?.termsValue && (
							<div className="mt-3">
								<p className="text-muted m-0 p-0">{data?.terms}</p>
								<p className="whitespace-pre-wrap">{data?.termsValue}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
