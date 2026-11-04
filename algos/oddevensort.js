ALGOS.oddevensort = (() => {
  const PSEUDO = [
    'oddEvenSort(A, n)',
    '  sorted = false',
    '  while not sorted:',
    '    sorted = true',
    '    for i = 1 to n - 2, step 2:',
    '      if A[i] > A[i + 1]:',
    '        swap A[i], A[i + 1]',
    '        sorted = false',
    '    for i = 0 to n - 2, step 2:',
    '      if A[i] > A[i + 1]:',
    '        swap A[i], A[i + 1]',
    '        sorted = false',
  ];

  function buildSteps(input) {
    const A = [...input], n = A.length, steps = [], passes = [];
    let vars = {}, sorted = false, i = null, phase = null, done = false, comparisons = 0, swaps = 0;
    const snap = (line, text, output, extra = {}) => steps.push({
      line, text, output, A: [...A], vars: { ...vars, comparisons, swaps }, stack: [`oddEvenSort(A, ${n})`],
      i, phase, done, passes: passes.map(p => ({ ...p })), focus: [], major: false, ...extra,
    });

    function runPhase(startIndex, name, line) {
      phase = startIndex;
      for (i = startIndex; i <= n - 2; i += 2) {
        vars = { sorted, i };
        snap(line, `${name} phase: look at the pair at indexes ${i} and ${i + 1}.`, `i = ${i}`, { focus: [i, i + 1] });
        const a = A[i], b = A[i + 1], outOfOrder = a > b;
        comparisons++;
        snap(line + 1, `Compare A[${i}] = ${a} and A[${i + 1}] = ${b}.`, `${a} > ${b} is ${outOfOrder}`, { focus: [i, i + 1] });
        if (outOfOrder) {
          [A[i], A[i + 1]] = [b, a];
          swaps++;
          snap(line + 2, `They're out of order, so swap them.`, fmt(A), { focus: [i, i + 1] });
          sorted = false;
          vars = { sorted, i };
          snap(line + 3, `A swap happened, so another round is needed.`, 'sorted = false');
        }
      }
      i = null;
    }

    snap(1, `Start odd-even sort on ${fmt(A)}.`, fmt(A));
    vars = { sorted };
    snap(2, `Set sorted to false so the first round runs.`, 'sorted = false');
    let round = 0;
    while (true) {
      i = null; phase = null;
      vars = { sorted };
      snap(3, sorted ? `The last round made no swaps, so the list is sorted.` : `The list may not be sorted yet, so run a round.`, sorted ? 'loop ends' : 'loop: true');
      if (sorted) break;
      round++;
      const before = swaps;
      sorted = true;
      vars = { sorted };
      snap(4, `Round ${round}: assume it's sorted unless a swap proves otherwise.`, 'sorted = true');
      runPhase(1, 'Odd', 5);
      runPhase(0, 'Even', 9);
      phase = null;
      const count = swaps - before;
      if (sorted) done = true;
      passes.push({ label: `Round ${round}`, note: count ? `${count} ${count === 1 ? 'swap' : 'swaps'}` : 'No swaps, so stop', vals: [...A], from: sorted ? 0 : n, to: n - 1, mark: null });
      vars = { sorted };
      snap(9, `Round ${round} is done with ${count} ${count === 1 ? 'swap' : 'swaps'}.`, fmt(A), { major: true });
    }
    vars = {};
    done = true;
    snap(0, `Finished with ${comparisons} comparisons and ${swaps} swaps. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });
    return { steps, nodes: [] };
  }

  return { PSEUDO, buildSteps };
})();
