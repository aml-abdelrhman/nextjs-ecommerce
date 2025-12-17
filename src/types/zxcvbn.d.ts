declare module "zxcvbn" {
  const zxcvbn: (password: string) => {
    score: number;
    feedback: {
      warning: string;
      suggestions: string[];
    };
  };
  export default zxcvbn;
}
