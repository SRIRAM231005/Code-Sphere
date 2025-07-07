import VerticalMenuSection from "./VerticalMenuSection";
import "./ExplorePage.css";

function ExplorePage() {
  // ...your fetch and state logic...

  return (
    <div className="explore-layout">
        <div className="column menu-column">
            <VerticalMenuSection/>
        </div>
        <div className="explore-container">
            <h2>Explore</h2>
            <div className="explore-list">
            {/* ...your cards here... */}
            </div>
        </div>
    </div>
  );
}

export default ExplorePage;
