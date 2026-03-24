import { Card, CardTitle } from "react-bootstrap";
import "./StatsFlipCard.css";
import { useEffect, useState } from "react";

function StatsFlipCard({ frontTitle, backTitle, backContent }) {
  // check to see if the device is a small screen

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    handleResize(); // check screen size again in case inital state is wrong
    window.addEventListener("resize", handleResize); // listen for window resize
    return () => window.removeEventListener("resize", handleResize); // remove when component dismounts
  }, []);

  if (isMobile) {
    return (
      <div className="flip-card">
        <Card className="shadow text-center stats-card stats-card-back">
          <Card.Body className="d-flex flex-column justify-content-center">
            <CardTitle>{frontTitle}</CardTitle>
            {backContent}
          </Card.Body>
        </Card>
      </div>
    );
  }

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
              {backContent}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StatsFlipCard;
