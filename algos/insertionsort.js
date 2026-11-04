ALGOS.insertionsort = (() => {
  const PSEUDO = [
    'insertionSort(A, n)',
    '  for i = 1 to n - 1:',
    '    key = A[i]',
    '    j = i - 1',
    '    while j >= 0 and A[j] > key:',
    '      A[j + 1] = A[j]',
    '      j--',
    '    A[j + 1] = key',
  ];

  function buildSteps(input) {
    const A = [...input], n = A.length, steps = [], passes = [];
    let vars = {}, sortedTo = 1, comparisons = 0, shifts = 0, i = null, j = null, keyAt = null, written = null;
    const snap = (line, text, output, extra = {}) => steps.push({
      line, text, output, A: [...A], vars: { ...vars, comparisons, shifts }, stack: [`insertionSort(A, ${n})`],
      sortedTo, i, j, keyAt, written, passes: passes.map(p => ({ ...p })), focus: [], major: false, ...extra,
    });

    snap(1, `Start insertion sort on ${fmt(A)}. The first value counts as a sorted section of one.`, fmt(A));
    for (i = 1; i <= n - 1; i++) {
      j = null; keyAt = null; written = null;
      vars = { i };
      snap(2, `Take the next value, A[${i}] = ${A[i]}. A[0..${i - 1}] is already sorted.`, `i = ${i}`);
      const key = A[i];
      keyAt = i;
      vars = { i, key };
      snap(3, `Save ${key} as the key, because shifting may overwrite A[${i}].`, `key = ${key}`);
      j = i - 1;
      vars = { i, key, j };
      snap(4, `Start comparing at the end of the sorted section, j = ${j}.`, `j = ${j}`);
      while (true) {
        if (j < 0) {
          snap(5, `j is -1, so nothing is left to compare and the loop ends.`, 'loop ends');
          break;
        }
        const a = A[j], bigger = a > key;
        comparisons++;
        snap(5, `Compare A[${j}] = ${a} with the key, ${key}.`, `${a} > ${key} is ${bigger}`, { focus: [j] });
        if (!bigger) break;
        A[j + 1] = a;
        shifts++;
        keyAt = null; written = j + 1;
        snap(6, `${a} is bigger than the key, so shift it right into A[${j + 1}].`, fmt(A), { focus: [j + 1] });
        j--;
        vars = { i, key, j };
        snap(7, `Move j to ${j}.`, `j = ${j}`);
      }
      A[j + 1] = key;
      keyAt = null; written = j + 1; sortedTo = i + 1;
      passes.push({ label: `Pass ${i}`, note: `${key} goes to index ${j + 1}`, vals: [...A], from: 0, to: i, mark: j + 1 });
      snap(8, `Put ${key} into A[${j + 1}]. A[0..${i}] is now sorted.`, fmt(A), { major: true, focus: [j + 1] });
    }
    i = null; j = null; written = null; vars = {};
    snap(0, `Finished with ${comparisons} comparisons and ${shifts} shifts. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });
    return { steps, nodes: [] };
  }

  return { PSEUDO, buildSteps };
})();
