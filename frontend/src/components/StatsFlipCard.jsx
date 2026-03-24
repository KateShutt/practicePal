import { Card, CardTitle } from "react-bootstrap";
import "./StatsFlipCard.css";

function StatsFlipCard({ frontTitle, backTitle, children }) {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* front */}
        <div className="flip-card-front">
          <Card className="h-100 shadow text-center stats-card stats-card-front">
            <Card.Body className="d-flex flex-column justify-content-center">
              <CardTitle>{frontTitle}</CardTitle>
              <p>Hover to view stats</p>
            </Card.Body>
          </Card>
        </div>

        {/* back */}

        <div className="flip-card-back">
          <Card className="h-100 shadow text-center stats-card stats-card-back">
            <Card.Body className="d-flex flex-column justify-content-center">
              <CardTitle>{backTitle}</CardTitle>
              {children}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StatsFlipCard;
