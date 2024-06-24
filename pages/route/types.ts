export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Problem {
  problem: string;
  test_cases: [string, string][];
}
