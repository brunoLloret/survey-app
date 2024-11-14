import express from "express";
import type { UserInputDto, UserOutputDto } from "./types";

const exampleRouter = express.Router();

// if you need to add anything to the request object, do it in the ./utils/global.d.ts file
// the example in the global file adds a user object to the request object

//...

exampleRouter.get("/example", (req, res) => {
  res.status(200).json({ message: "I am an example" });
});

//...

export default exampleRouter;
