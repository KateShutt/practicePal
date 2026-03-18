import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // extracts the authorization header

  if (!authHeader) {
    return res.status(401).json({ error: "authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; //extract the token

  try {
    // the following line checks that token has been signed, has not been modified and has not expired. If any of these checks fail, an error is thrown that is caught later
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if nothing fails, the above returns the payload
    // for example decoded = {userId: 7, ....}
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
