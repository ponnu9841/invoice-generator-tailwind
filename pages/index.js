import InvoiceForm from "@/components/invoice-form/invoiceForm";

export default function Home() {
	return (
		<>
			<h1 className="text-4xl mb-4">Invoice Generator</h1>
			<InvoiceForm />
		</>
	);
}
