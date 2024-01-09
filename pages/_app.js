import "@/styles/globals.css";
import { Nunito } from "next/font/google";

const font = Nunito({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
	return (
		<main className={`p-20 pt-12 ${font.className}`}>
			<Component {...pageProps} />
		</main>
	);
}
