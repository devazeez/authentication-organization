export const emailValidator = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Example usage
//   const isValidEmail = emailValidator("example@email.com");
//   console.log(isValidEmail); // Returns true or false
