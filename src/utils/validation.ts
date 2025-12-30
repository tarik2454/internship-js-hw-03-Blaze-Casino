export const validateBet = (
  amount: number,
  balance?: number,
  minAmount = 0,
): void => {
  if (amount < minAmount) {
    throw new Error(`Bet must be at least $${minAmount}`);
  }
  if (!Number.isFinite(amount)) {
    throw new Error("Invalid bet amount");
  }
  if (balance !== undefined && amount > balance) {
    throw new Error("Insufficient balance");
  }
};

export const validateInRange = (
  value: number,
  validValues: number[],
  fieldName: string,
): void => {
  if (!validValues.includes(value)) {
    throw new Error(
      `Invalid ${fieldName}. Must be one of: ${validValues.join(", ")}`,
    );
  }
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
};
