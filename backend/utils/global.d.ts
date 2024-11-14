// This is an example of adding a user object to the request object

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
      // add any other properties you need here (you can delete the user property above if you don't need it)
    }
  }
}
