import { useState } from "react";

export default function ImageUpload(props) {
	const [files, setFiles] = useState([]);
	// const [selectedImages, setSelectedImages] = useState([])
	// const [base64Data, setBase64Data] = useState(null);

	const { base64Data, setBase64Data } = props;

	const onSelectFile = (event) => {
		const selectedFiles = event.target.files;

		let filePath = event.target.value;
		var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;

		if (!allowedExtensions.exec(filePath)) {
			alert("Invalid file type");
			event.target.value = "";
			return false;
		} else {
			const selectedFilesArray = Array.from(selectedFiles);

			const imagesArray = selectedFilesArray.map((file) => {
				return URL.createObjectURL(file);
			});

			var imageSize = selectedFilesArray[0].size / 1024;

			if (imageSize > 2048) {
				alert("Upload Image Size exceeding 2mb");
			} else {
				handleObjectURL(imagesArray[0]);

				for (let i = 0; i < selectedFilesArray.length; i++) {
					selectedFilesArray[i]["url"] = imagesArray[i];
				}

				// setFiles((prevState) => prevState.concat(selectedFilesArray));
				setFiles(selectedFilesArray);

				// setSelectedImages((previousImages) => previousImages.concat(imagesArray));

				// FOR BUG IN CHROME
				event.target.value = "";
			}
		}
	};

	const handleObjectURL = (objectURL) => {
		// Fetch the object URL data as a Blob
		fetch(objectURL)
			.then((response) => response.blob())
			.then((blob) => {
				// Create a FileReader object
				const reader = new FileReader();

				// Define onload event handler to convert data to Base64
				reader.onload = () => {
					// Access the Base64 data
					const base64 = reader.result;
					setBase64Data(base64);
				};

				// Convert the Blob data to Base64
				reader.readAsDataURL(blob);
			});
	};

	function handleEdit(e) {
		e.preventDefault();
		setFiles([]);
		setBase64Data(null);
	}

	// console.log(selectedImages)

	return (
		<>
			{!base64Data && (
				<div>
					<label className="border bg-light cursor-pointer px-6 py-12">
						+ Add Your Logo
						<input
							type="file"
							name="images"
							onChange={onSelectFile}
							multiple
							accept="image/png , image/jpeg, image/webp"
							className="hidden"
						/>
					</label>
				</div>
			)}
			{base64Data && (
				<div className="relative">
					<img
						src={base64Data}
						className="max-w-[150px] max-h-[100px]"
						alt="logo"
					/>
					{/* <div className={styles.logo}>
            <NextImage src={base64Data} />
          </div> */}

					<button
						className="btn btn-circle btn-sm absolute top-[-10px] left-[-10px] p-0"
						onClick={handleEdit}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-3 w-3"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					{/* <button
						className={
							"absolute top-0 left-0 p-0 h-[20px] w-[20px] btn btn-sm btn-dark border-0 text-white"
						}
						onClick={handleEdit}
					>
						&times;
					</button> */}
				</div>
			)}
		</>
	);
}
