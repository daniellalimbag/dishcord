import { Roboto } from "next/font/google";
import "./globals.css";
import {SessionMaker} from "./components/SessionMaker";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const roboto = Roboto({ subsets: ["latin"], weight: ['400', '500', '700'] });

export const metadata = {
  title: "Dishcord",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <SessionMaker>
            <Navbar />
            {children}
            <Footer />
        </SessionMaker>    
      </body>
    </html>
  );
}
