export const Form = {
  exerciseId: { field: { name: "exerciseId" } },
  exerciseName: { field: { name: "exerciseName" } },
  query: { field: { name: "query" } },
  sets: { pattern: { min: 1, max: 20 }, field: { name: "sets", defaultValue: 3 } },
  repsMin: { pattern: { min: 1, max: 100 }, field: { name: "repsMin", defaultValue: 8 } },
  repsMax: { pattern: { min: 1, max: 100 }, field: { name: "repsMax", defaultValue: 12 } },
};
