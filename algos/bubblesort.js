ALGOS.bubblesort = (() => {
  const PSEUDO = [
    'bubbleSort(A, n)',
    '  for pass = 0 to n - 2:',
    '    swapped = false',
    '    for j = 0 to n - 2 - pass:',
    '      if A[j] > A[j + 1]:',
    '        swap A[j], A[j + 1]',
    '        swapped = true',
    '    if not swapped: return',
  ];

  function buildSteps(input) {
    const A = [...input], n = A.length, steps = [], passes = [];
    let vars = {}, sortedFrom = n, comparisons = 0, swaps = 0, j = null;
    const snap = (line, text, output, extra = {}) => steps.push({
      line, text, output, A: [...A], vars: { ...vars, comparisons, swaps }, stack: [`bubbleSort(A, ${n})`],
      sortedFrom, j, passes: passes.map(p => ({ ...p })), focus: [], major: false, ...extra,
    });

    snap(1, `Start bubble sort on ${fmt(A)}.`, fmt(A));
    for (let pass = 0; pass <= n - 2; pass++) {
      j = null;
      vars = { pass };
      snap(2, `Start pass ${pass + 1}. It will push the largest unsorted value to the end.`, `pass = ${pass}`);
      let swapped = false, count = 0;
      vars = { pass, swapped };
      snap(3, `Set swapped to false. Nothing has been swapped in this pass yet.`, 'swapped = false');
      for (j = 0; j <= n - 2 - pass; j++) {
        vars = { pass, swapped, j };
        snap(4, `Move j to ${j}.`, `j = ${j}`);
        const a = A[j], b = A[j + 1], outOfOrder = a > b;
        comparisons++;
        snap(5, `Compare neighbors: A[${j}] = ${a} and A[${j + 1}] = ${b}.`, `${a} > ${b} is ${outOfOrder}`, { focus: [j, j + 1] });
        if (outOfOrder) {
          [A[j], A[j + 1]] = [b, a];
          swaps++; count++;
          snap(6, `They're out of order, so swap them.`, fmt(A), { focus: [j, j + 1] });
          swapped = true;
          vars = { pass, swapped, j };
          snap(7, `Set swapped to true.`, 'swapped = true');
        }
      }
      j = null;
      vars = { pass, swapped };
      if (!swapped) {
        sortedFrom = 0;
        passes.push({ label: `Pass ${pass + 1}`, note: 'No swaps, so stop', vals: [...A], from: 0, to: n - 1, mark: null });
        snap(8, `This pass made no swaps, so the list is sorted. Return early.`, 'return', { major: true });
        break;
      }
      sortedFrom = pass === n - 2 ? 0 : n - 1 - pass;
      passes.push({ label: `Pass ${pass + 1}`, note: `${count} ${count === 1 ? 'swap' : 'swaps'}, ${A[n - 1 - pass]} settled`, vals: [...A], from: sortedFrom, to: n - 1, mark: null });
      snap(8, `${A[n - 1 - pass]} is in its final spot. This pass made swaps, so keep going.`, fmt(A), { major: true });
    }
    vars = {};
    snap(0, `Finished with ${comparisons} comparisons and ${swaps} swaps. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });
    return { steps, nodes: [] };
  }

  return { PSEUDO, buildSteps };
})();
