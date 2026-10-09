import { createRoot, hydrateRoot } from "react-dom/client";
import { PortfolioPage } from "./PortfolioPage";
import "./styles.css";

const root = document.getElementById("root")!;
if (root.querySelector("main")) hydrateRoot(root, <PortfolioPage />);
else createRoot(root).render(<PortfolioPage />);
