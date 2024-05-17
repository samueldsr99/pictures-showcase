interface Branch<TInput, TOutput> {
  pattern: TInput;
  result: TOutput | (() => TOutput);
}

export interface MatchProps<TInput, TOutput> {
  value: TInput;
  branches: Array<Branch<TInput, TOutput>>;
  fallback?: TOutput | (() => TOutput);
}
