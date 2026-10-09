import { renderToString } from "react-dom/server";
import { PortfolioPage } from "./PortfolioPage";
export function render() {
  return renderToString(<PortfolioPage />);
}
