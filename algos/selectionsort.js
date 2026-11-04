ALGOS.selectionsort = (() => {
  const PSEUDO = [
    'selectionSort(A, n)',
    '  for i = 0 to n - 2:',
    '    min = i',
    '    for j = i + 1 to n - 1:',
    '      if A[j] < A[min]:',
    '        min = j',
    '    swap A[i], A[min]',
  ];

  function buildSteps(input) {
    const A = [...input], n = A.length, steps = [], passes = [];
    let vars = {}, sortedTo = 0, comparisons = 0, swaps = 0, i = null, j = null, min = null;
    const snap = (line, text, output, extra = {}) => steps.push({
      line, text, output, A: [...A], vars: { ...vars, comparisons, swaps }, stack: [`selectionSort(A, ${n})`],
      sortedTo, i, j, min, passes: passes.map(p => ({ ...p })), focus: [], major: false, ...extra,
    });

    snap(1, `Start selection sort on ${fmt(A)}.`, fmt(A));
    for (i = 0; i <= n - 2; i++) {
      j = null; min = null;
      vars = { i };
      snap(2, `Find the value that belongs at index ${i}.`, `i = ${i}`);
      min = i;
      vars = { i, min };
      snap(3, `Assume A[${i}] = ${A[i]} is the smallest so far.`, `min = ${i}`);
      for (j = i + 1; j <= n - 1; j++) {
        vars = { i, min, j };
        snap(4, `Move j to ${j}.`, `j = ${j}`);
        const a = A[j], b = A[min], smaller = a < b;
        comparisons++;
        snap(5, `Compare A[${j}] = ${a} with the smallest so far, A[${min}] = ${b}.`, `${a} < ${b} is ${smaller}`, { focus: [j, min] });
        if (smaller) {
          min = j;
          vars = { i, min, j };
          snap(6, `${a} is the new smallest, so set min to ${j}.`, `min = ${j}`);
        }
      }
      j = null;
      vars = { i, min };
      const from = min, value = A[min];
      if (from !== i) { [A[i], A[from]] = [A[from], A[i]]; swaps++; }
      sortedTo = i === n - 2 ? n : i + 1;
      passes.push({ label: `Pass ${i + 1}`, note: `${value} goes to index ${i}`, vals: [...A], from: 0, to: sortedTo - 1, mark: null });
      snap(7, from === i
        ? `A[${i}] = ${value} is already the smallest, so the swap changes nothing.`
        : `Swap A[${i}] and A[${from}], which puts ${value} in its final spot.`, fmt(A), { major: true, focus: [i, from] });
    }
    i = null; j = null; min = null; vars = {};
    snap(0, `Finished with ${comparisons} comparisons and ${swaps} swaps. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });
    return { steps, nodes: [] };
  }

  return { PSEUDO, buildSteps };
})();
