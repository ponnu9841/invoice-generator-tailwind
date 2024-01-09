import ImageUpload from "../image-upload/imageUpload";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import DatePicker from "../date-picker/datePicker";
import MultipleInput from "../mulitple-input/mulitple-input";
import PriceSummary from "../price-summary/price-summary";
import { dataState } from "../data";
import PoNumber from "../number-input-adder/poNumber";
import { currencyDataList } from "@/data/currency";
import jsPDF from "jspdf";
import PrintTemplate from "../printTemplate/print";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";

import * as htmlToImage from "html-to-image";

export default function InvoiceForm() {
	const router = useRouter();

	const { data, setData } = dataState();
	const [base64Data, setBase64Data] = useState(null);

	const [date, setDate] = useState(new Date());
	const [dueDate, setDueDate] = useState(new Date());
	const [mulitpleInputData, setMultipleInputData] = useState([
		{ quantity: 0, rate: 0, description: "" },
	]);

	const [numberInput, setNumberInput] = useState([
		{ name: "PO Number", value: "" },
	]);

	const [priceSummary, setPriceSummary] = useState({
		discount: { name: "Discount", value: "", type: true, display: true },
		tax: { name: "Tax", value: "", type: true, display: false },
		shipping: { name: "Shipping", type: true, value: "", display: false },
	});

	const [selectedCurrency, setSelectedCurrency] = useState("₹");

	async function formHandler(e) {
		e.preventDefault();
		const input = document.getElementById("printForm");

		input.style.display = "block";

		htmlToImage
			.toPng(input)
			.then(function (dataUrl) {
				const image = new Image();
				image.src = dataUrl;
				image.onload = () => {
					const imgWidth = 208;
					const imgHeight = (image.height * imgWidth) / image.width;

					// const imgData = dataUrl.toDataURL("image/png");
					const pdf = new jsPDF("p", "mm", "a4");
					pdf.addImage(dataUrl, "JPEG", 0, 0, imgWidth, imgHeight);
					pdf.save("invoice.pdf");

					// input.classList.add("d-none");
					input.style.display = "none";

					let localData = localStorage.getItem("saveData");
					if (!localData) {
						var data = [saveData];
						localStorage.setItem("saveData", JSON.stringify(data));
						setPrevData(data);
					} else {
						var data = saveData;
						var existingData = JSON.parse(localData);
						if (existingData.length < 5) {
							var alredyExist = false;
							var index = null;
							existingData?.forEach((e, i) => {
								if (e.invoiceNumber == saveData?.invoiceNumber) {
									alredyExist = true;
									index = i;
								} else {
									alredyExist = false;
								}
							});
							if (!alredyExist) {
								existingData.push(saveData);
								localStorage.setItem("saveData", JSON.stringify(existingData));
								setPrevData(existingData);
							} else {
								existingData[index] = JSON.parse(JSON.stringify(saveData));
								localStorage.setItem("saveData", JSON.stringify(existingData));
								setPrevData(existingData);
							}
						}
					}
				};
			})
			.catch(function (error) {
				console.error("oops, something went wrong!", error);
			});
	}

	function handleChange(e) {
		e.preventDefault();
		const { name, value } = e.target;
		setData((prevState) => ({ ...prevState, [name]: value }));
	}

	function getDate(date) {
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		return `${year}-${month}-${day}`;
	}

	var subTotal = 0;
	var discount = 0;
	var tax = 0;
	var shippingCharge = 0;

	mulitpleInputData?.forEach((e) => {
		var total = parseFloat(e?.quantity) * parseFloat(e?.rate);
		subTotal = subTotal + total;
	});

	var balance = subTotal;

	if (priceSummary) {
		if (priceSummary?.discount?.value) {
			if (priceSummary?.discount?.type) {
				// discount in percentage
				balance =
					subTotal -
					(subTotal * parseFloat(priceSummary?.discount?.value)) / 100;
				discount = (subTotal * parseFloat(priceSummary?.discount?.value)) / 100;
			} else {
				balance = subTotal - parseFloat(priceSummary?.discount?.value);
				discount = parseFloat(priceSummary?.discount?.value);
			}
		}

		if (priceSummary?.tax?.value) {
			if (priceSummary?.tax?.type) {
				balance =
					balance + (balance * parseFloat(priceSummary?.tax?.value)) / 100;
				tax = (balance * parseFloat(priceSummary?.tax?.value)) / 100;
			} else {
				balance = balance + parseFloat(priceSummary?.tax?.value);
				tax = parseFloat(priceSummary?.tax?.value);
			}
		}

		if (priceSummary?.shipping?.value) {
			if (priceSummary?.shipping?.type) {
				// discount in percentage
				balance =
					balance + (balance * parseFloat(priceSummary?.shipping?.value)) / 100;
				shippingCharge =
					(balance * parseFloat(priceSummary?.shipping?.value)) / 100;
			} else {
				balance = balance + parseFloat(priceSummary?.shipping?.value);
				shippingCharge = parseFloat(priceSummary?.shipping?.value);
			}
		}
	}

	var balanceDue = balance;
	if (data?.amtPaidValue) {
		balanceDue = balanceDue - parseFloat(data?.amtPaidValue);
	}

	const [showModal, setShowModal] = useState(false);
	function handleHistory(e) {
		e.preventDefault();
		setShowModal(true);
	}

	const handleClose = () => setShowModal(false);

	const [invoiceNumber, setInvoiceNumber] = useState(1);

	const { history } = router?.query;
	const [prevData, setPrevData] = useState([]);
	useEffect(() => {
		const savedData = localStorage.getItem("saveData");
		if (savedData) {
			let items = JSON.parse(savedData);
			let length = items?.length;
			setInvoiceNumber(length + 1);
			// if (history) {
			setPrevData(items);
			// }
			if (history) {
				const data = items[history];
				if (data) {
					setData(data?.data);
					setBase64Data(data?.base64Data);
					setDate(new Date(data?.date));
					setDueDate(new Date(data?.dueDate));
					setMultipleInputData(data?.mulitpleInputData);
					setNumberInput(data?.numberInput);
					setPriceSummary(data?.priceSummary);
					setSelectedCurrency(data?.selectedCurrency);
					setInvoiceNumber(data?.invoiceNumber);
					setShowModal(false);
				} else {
					router?.push("/");
				}
			}
		}
	}, [history && history]);

	function handleRouting(e, index) {
		e.preventDefault();
		router.push("/" + index);
	}

	const saveData = {
		invoiceNumber: invoiceNumber,
		data: data,
		base64Data: base64Data,
		date: getDate(date),
		dueDate: getDate(dueDate),
		mulitpleInputData: mulitpleInputData,
		numberInput: numberInput,
		priceSummary: priceSummary,
		selectedCurrency: selectedCurrency,
		subTotal: subTotal,
		balance: balance,
		balanceDue: balanceDue,
		discount: discount,
		tax: tax,
		shippingCharge: shippingCharge,
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			// Trigger the click event on the desired button
			// Here, we're triggering the click event on the first button (index 0)
		}
	};

	const [textareaHeight, setTextareaHeight] = useState({
		notesValue: null,
		termsValue: null,
	});

	let notesHeight = 70;
	let termsHeight = 70;
	if (textareaHeight?.notesValue > 70) notesHeight = textareaHeight?.notesValue;
	if (textareaHeight?.termsValue > 70) termsHeight = textareaHeight?.termsValue;

	function handleTextareaChange(e) {
		e.preventDefault();
		const { name, value } = e.target;
		setData((prevState) => ({ ...prevState, [name]: value }));
		setTextareaHeight((prevState) => ({
			...prevState,
			[name]: e.target.scrollHeight,
		}));
	}

	return (
		<>
			<form onSubmit={formHandler} className="mb-8">
				<div className="grid grid-cols-8 gap-4">
					<div className="col-span-6 bg-white" id="form">
						<div className="bg-white">
							<div className="flex p-10 mt-3">
								<div className={"w-1/2 my-auto "}>
									<ImageUpload
										base64Data={base64Data}
										setBase64Data={setBase64Data}
									/>
								</div>
								<div className={"w-1/2 text-md-end "}>
									<h1 className="text-right text-sm md:text-md lg:text-lg xl:text-4xl font-semibold">
										INVOICE
									</h1>
									<div className="mt-2 mb-3">
										<div className={"w-[200px] float-right flex relative"}>
											<span
												className={
													"absolute left-[1px] top-[1px] bg-gray-100 h-[calc(100%-2px)] px-2 flex jusify-center items-center border-r"
												}
												id="basic-addon1"
											>
												#
											</span>

											<input
												type="text"
												className="input input-sm rounded-sm input-bordered input-primary w-full max-w-xs pl-8"
												placeholder="1"
												value={invoiceNumber}
												onChange={(e) => setInvoiceNumber(e.target.value)}
												onKeyDown={handleKeyPress}
												maxLength={"20"}
											/>
											{/* <input
												type="text"
												className="form-control"
												placeholder="1"
												value={invoiceNumber}
												onChange={(e) => setInvoiceNumber(e.target.value)}
												onKeyDown={handleKeyPress}
												maxLength={"20"}
											/> */}
										</div>
									</div>
								</div>
							</div>

							<div className="flex p-10 pt-0 space-x-8">
								<div className={"w-[60%] "}>
									<div className="mt-3">
										<textarea
											name="invoiceFrom"
											className="textarea textarea-primary w-[65%] rounded-sm"
											onChange={handleChange}
											placeholder="*Who is this invoice from?"
											value={data.invoiceFrom}
										></textarea>
										{/* <textarea
											name="invoiceFrom"
											className={"form-control " + styles["form-input"]}
											onChange={handleChange}
											placeholder="*Who is this invoice from?"
											value={data.invoiceFrom}
										></textarea> */}
									</div>
									<div className="flex mt-4 space-x-8">
										<div className="w-1/2">
											<input
												type="text"
												className={
													"input input-sm rounded-sm mb-1 focus:border-primary"
												}
												placeholder="Bill To"
												name="billTo"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.billTo}
												required
											/>

											<textarea
												name="billToValue"
												className={
													"textarea textarea-primary pb-3 rounded-sm w-full"
												}
												onChange={handleChange}
												placeholder="*Who is this invoice to?"
												value={data.billToValue}
											></textarea>
										</div>
										<div className="w-1/2">
											<input
												type="text"
												className={
													"input input-sm rounded-sm mb-1 focus:border-primary"
												}
												placeholder="Ship To"
												name="shipTo"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.shipTo}
												required
											/>
											{/* <input
                        type="text"
                        className={"form-control mb-3 " + styles["form-input-small"]}
                        placeholder="(optional)"
                        name="shipToValue"
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        value={data.shipToValue}
                      /> */}
											<textarea
												name="shipToValue"
												className={
													"textarea textarea-primary rounded-sm w-full pb-3"
												}
												onChange={handleChange}
												placeholder="(optional)"
												value={data.shipToValue}
											></textarea>
										</div>
									</div>
								</div>

								<div className={"w-[40%] md:text-right "}>
									<div className="flex mt-3 items-center justify-end space-x-2 mb-3">
										<input
											type="text"
											className="input input-sm input-primary border-white rounded-sm text-right"
											name="date"
											onChange={handleChange}
											onKeyDown={handleKeyPress}
											value={data.date}
										/>
										<div>
											<div>
												<DatePicker setDate={setDate} date={date} />
											</div>
										</div>
									</div>

									{/* payment terms */}
									<div className="flex mt-3 items-center justify-end space-x-2 mb-3">
										<input
											type="text"
											className="input input-sm input-primary border-white rounded-sm text-right"
											name="payTerms"
											onChange={handleChange}
											onKeyDown={handleKeyPress}
											value={data.payTerms}
										/>
										<div>
											<input
												type="text"
												placeholder="Payment Terms"
												className="input input-sm input-primary w-[175px] rounded-sm"
												name="payTermsValue"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.payTermsValue}
											/>
										</div>
									</div>

									{/* <div
										className="mt-2 flex items-center justify-end space-x-2 mb-3"
										style={{ gap: "5px" }}
									>
										<div className={styles["text"]}>
											<input
												type="text"
												className="input input-sm input-primary border-white text-right"
												name="payTerms"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.payTerms}
											/>
										</div>
										<div>
											<input
												type="text"
												className="input input-sm input-primary w-[175px] rounded-sm"
												name="payTermsValue"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.payTermsValue}
											/>
										</div>
									</div> */}

									{/* due date */}
									<div className="flex mt-3 items-center justify-end space-x-2 mb-3">
										<input
											type="text"
											className="input input-sm input-primary border-white rounded-sm text-right"
											name="dueDate"
											onChange={handleChange}
											onKeyDown={handleKeyPress}
											value={data.dueDate}
										/>
										<div>
											<div>
												<DatePicker setDate={setDueDate} date={dueDate} />
											</div>
										</div>
									</div>

									{/* <div
										className="mt-2 d-flex align-items-center justify-content-end"
										style={{ gap: "5px" }}
									>
										<div className={styles["text"]}>
											<input
												type="text"
												className={
													styles["inputHeading"] + " form-control text-end"
												}
												name="dueDate"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.dueDate}
											/>
										</div>
										<div className={styles["dateInput"]}>
											<div>
												<DatePicker setDate={setDueDate} date={dueDate} />
											</div>
										</div>
									</div> */}

									<PoNumber data={numberInput} setData={setNumberInput} />
								</div>
							</div>

							<div className="pb-4 px-10">
								<MultipleInput
									data={mulitpleInputData}
									setData={setMultipleInputData}
									currency={selectedCurrency}
								/>

								<div className="mt-3 pt-3">
									<div className="flex space-x-8">
										<div className="w-[60%]">
											<input
												type="text"
												className="text-gray-400 w-100 input input-sm input-primary border-white rounded-sm mb-1"
												placeholder="Notes"
												name="notes"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.notes}
											/>
											<textarea
												className="textarea text-area-primary rounded-sm w-full textarea-primary"
												placeholder="Notes - any relevant information not already covered"
												name="notesValue"
												onChange={handleTextareaChange}
												value={data.notesValue}
												style={{ height: notesHeight }}
											></textarea>

											<input
												type="text"
												className="text-gray-400 w-100 input input-sm input-primary border-white rounded-sm mb-1 mt-3"
												placeholder="Terms"
												name="terms"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.terms}
											/>
											<textarea
												className="textarea text-area-primary rounded-sm w-full textarea-primary"
												placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
												name="termsValue"
												onChange={handleTextareaChange}
												value={data.termsValue}
												style={{ height: termsHeight }}
											></textarea>
										</div>
										<div className={"w-[40%] float-end "}>
											<div className="mt-2 flex items-center justify-end space-x-4">
												<input
													type="text"
													className="text-gray-400 text-right input input-sm input-primary mb-1 w-75 border-transparent"
													placeholder="Subtotal"
													name="subtotal"
													onChange={handleChange}
													onKeyDown={handleKeyPress}
													value={data.subtotal}
													required
												/>
												<div className={"w-[100px] text-end"}>
													<div>
														{selectedCurrency}
														{subTotal?.toFixed(2) || 0}
													</div>
												</div>
											</div>

											<PriceSummary
												data={priceSummary}
												setData={setPriceSummary}
												currency={selectedCurrency}
											/>

											<div className="mt-3 flex items-center justify-end space-x-4">
												<input
													type="text"
													className="text-muted text-end form-control mb-1 input input-sm input-primary border-transparent rounded-sm "
													name="total"
													onChange={handleChange}
													onKeyDown={handleKeyPress}
													value={data.total}
													required
												/>

												<div className={"w-[112px] text-right"}>
													<div>
														{selectedCurrency}
														{balance?.toFixed(2) || 0}
													</div>
												</div>
											</div>

											<div className="mt-3 flex items-center justify-end space-x-4">
												<input
													type="text"
													className="text-right form-control mb-1 input input-sm input-primary border-transparent rounded-sm "
													placeholder="Amount Paid"
													name="amtPaid"
													onChange={handleChange}
													onKeyDown={handleKeyPress}
													value={data?.amtPaid}
													required
												/>

												<div className="relative  text-end">
													<input
														type="number"
														className="input input-sm input-primary rounded-sm w-[100px] ps-8"
														name="amtPaidValue"
														onChange={handleChange}
														onKeyDown={handleKeyPress}
														value={data.amtPaidValue}
													/>
													<span className="absolute top-1/2 translate-y-[-50%] left-[10px]">
														{selectedCurrency}
													</span>
												</div>
												{/* <div className={styles["form-input-sm2"]+" text-end"}>
                              <div>$0.00</div>
                            </div> */}
											</div>

											<div className="mt-3 flex items-center justify-end space-x-4">
												<input
													type="text"
													className="text-right form-control mb-1 input input-sm input-primary border-transparent rounded-sm "
													placeholder="Balance Due"
													name="balDue"
													onChange={handleChange}
													onKeyDown={handleKeyPress}
													value={data.balDue}
													required
												/>

												{/* <div>
                              <input type="text" className={"form-control "} />
                            </div> */}
												<div className={"w-[100px] text-end"}>
													<div>
														{selectedCurrency}
														{balanceDue?.toFixed(2) || 0}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-span-2">
						<div className="mt-3 text-center">
							<button className="btn btn-success text-white ">
								Download Invoice
							</button>
						</div>
						<div className="mt-4 ms-3 text-center">
							<small className="mb-2 fw-bold">CURRENCY</small>
							<select
								className="ms-3"
								value={selectedCurrency}
								onChange={(e) => setSelectedCurrency(e.target.value)}
							>
								{currencyDataList?.map((item, index) => {
									let symbol = item?.currency?.symbol;
									if (symbol == "false") {
										symbol = JSON.parse(item?.currency?.symbol);
									}
									if (item?.currency?.code) {
										return (
											<option value={item?.currency?.symbol} key={index}>
												{`${item?.currency?.code} ${symbol && symbol}`}
											</option>
										);
									}
								})}
							</select>
						</div>

						{/* <div className="mt-4">
							<div className="mt-3 text-center">
								{prevData?.length > 0 && (
									<button
										className="btn btn-success text-white "
										onClick={handleHistory}
									>
										Invoice History
									</button>
								)}
							</div>
						</div> */}
					</div>
				</div>
			</form>
			<PrintTemplate
				data={data}
				base64Data={base64Data}
				date={date}
				dueDate={dueDate}
				mulitpleInputData={mulitpleInputData}
				numberInput={numberInput}
				priceSummary={priceSummary}
				selectedCurrency={selectedCurrency}
				subTotal={subTotal}
				balance={balance}
				balanceDue={balanceDue}
				discount={discount}
				tax={tax}
				shippingCharge={shippingCharge}
			/>

			<Modal
				show={showModal}
				onHide={handleClose}
				centered
				size="lg"
				scrollable
			>
				<Modal.Header closeButton>
					<Modal.Title>Your Invoice History</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{prevData ? (
						<div className="row">
							{prevData?.map((item, index) => (
								<div className="col-12 border-bottom" key={index}>
									<PrintTemplate
										data={item?.data}
										base64Data={item?.base64Data}
										date={new Date(item?.date)}
										dueDate={new Date(item?.dueDate)}
										mulitpleInputData={item?.mulitpleInputData}
										numberInput={item?.numberInput}
										priceSummary={item?.priceSummary}
										selectedCurrency={item?.selectedCurrency}
										subTotal={item?.subTotal}
										balance={item?.balance}
										balanceDue={item?.balanceDue}
										discount={item?.discount}
										tax={item?.tax}
										shippingCharge={item?.shippingCharge}
										history={true}
									/>
									<div className="text-end">
										<button
											className="btn btn-success btn-sm mb-5 px-4 text-white"
											onClick={(e) => handleRouting(e, index)}
										>
											Edit
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						"No Data Found"
					)}
				</Modal.Body>
			</Modal>

			{/* template */}
		</>
	);
}
