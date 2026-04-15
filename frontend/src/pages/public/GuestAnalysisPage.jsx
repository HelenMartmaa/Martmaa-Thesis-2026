import { Link } from "react-router-dom";
import GuestModeNotice from "../../components/guest/GuestModeNotice";
import AnalysisInputSection from "../../components/analysis/AnalysisInputSection";
import StatisticsPanel from "../../components/analysis/StatisticsPanel";
import ChartPanel from "../../components/analysis/ChartPanel";

function GuestAnalysisPage() {
  return (
    <main>
      <header>
        <h1>Guest Analysis</h1>
        <p>
          Analyze experimental data without creating an account. Data entered in
          guest mode is temporary and will not be saved.
        </p>
        <Link to="/">Back to Home</Link>
      </header>

      <GuestModeNotice />
      <AnalysisInputSection />
      <StatisticsPanel />
      <ChartPanel />
    </main>
  );
}

export default GuestAnalysisPage;