function calculateAverageRating(reviews) {
  if (reviews.length === 0) {
    return null;
  }

  let total = 0;

  for (const review of reviews) {
    const raw = review.rating;

    // Accept numbers and non-empty strings only.
    if (
      (typeof raw !== "number" && typeof raw !== "string") ||
      (typeof raw === "string" && raw.trim() === "")
    ) {
      throw new Error("Rating must be an integer from 1 to 5.");
    }

    const rating = Number(raw);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error("Rating must be an integer from 1 to 5.");
    }

    total += rating;
  }

  return total / reviews.length;
}

// Each test defines the input and the expected result.
const tests = [
  { name: "Original bug", ratings: ["5", "4", "3"], expected: 4 },
  { name: "Numeric ratings", ratings: [5, 4, 3], expected: 4 },
  { name: "Empty list", ratings: [], expected: null },
  { name: "Blank rating", ratings: ["", "4"], error: true },
  { name: "Whitespace", ratings: [" ", "4"], error: true },
  { name: "Invalid text", ratings: ["abc", "4"], error: true },
  { name: "Below minimum", ratings: ["0"], error: true },
  { name: "Above maximum", ratings: ["6"], error: true },
  { name: "Decimal rating", ratings: ["3.5"], error: true },
  { name: "Null rating", ratings: [null], error: true }
];

let passed = 0;

for (const test of tests) {
  const reviews = test.ratings.map(rating => ({ rating }));
  let success = false;

  try {
    const result = calculateAverageRating(reviews);
    success = !test.error && result === test.expected;
  } catch (error) {
    success =
      test.error === true &&
      error.message === "Rating must be an integer from 1 to 5.";
  }

  console.log(`${success ? "PASS" : "FAIL"}: ${test.name}`);

  if (success) passed++;
}

console.log(`\n${passed}/${tests.length} tests passed.`);