ALGOS.shellsort = (() => {
  const PSEUDO = [
    'shellSort(A, n)',
    '  gap = floor(n / 2)',
    '  while gap > 0:',
    '    for i = gap to n - 1:',
    '      temp = A[i]',
    '      j = i',
    '      while j >= gap and A[j - gap] > temp:',
    '        A[j] = A[j - gap]',
    '        j = j - gap',
    '      A[j] = temp',
    '    gap = floor(gap / 2)',
  ];

  function buildSteps(input) {
    const A = [...input], n = A.length, steps = [], passes = [];
    let vars = {}, gap = null, i = null, j = null, keyAt = null, written = null, done = false, comparisons = 0, shifts = 0;
    const snap = (line, text, output, extra = {}) => steps.push({
      line, text, output, A: [...A], vars: { ...vars, comparisons, shifts }, stack: [`shellSort(A, ${n})`],
      gap, i, j, keyAt, written, done, passes: passes.map(p => ({ ...p })), focus: [], major: false, ...extra,
    });

    snap(1, `Start Shell sort on ${fmt(A)}.`, fmt(A));
    gap = Math.floor(n / 2);
    vars = { gap };
    snap(2, `Start with a gap of ${gap}, half the list.`, `gap = ${gap}`);
    while (true) {
      i = null; j = null; keyAt = null; written = null;
      vars = { gap };
      snap(3, gap > 0 ? `The gap is ${gap}, so run another pass.` : `The gap is 0, so the list is sorted.`, gap > 0 ? 'loop: true' : 'loop: false');
      if (gap === 0) break;
      for (i = gap; i <= n - 1; i++) {
        j = null; keyAt = null; written = null;
        vars = { gap, i };
        snap(4, `Take A[${i}] = ${A[i]}. Compare it with values ${gap} ${gap === 1 ? 'spot' : 'spots'} apart.`, `i = ${i}`);
        const temp = A[i];
        keyAt = i;
        vars = { gap, i, temp };
        snap(5, `Save ${temp} as temp, because shifting may overwrite A[${i}].`, `temp = ${temp}`);
        j = i;
        vars = { gap, i, temp, j };
        snap(6, `Start with j at ${j}.`, `j = ${j}`);
        while (true) {
          if (j < gap) {
            snap(7, `j = ${j} is less than the gap, so there's nothing left to compare.`, 'loop ends');
            break;
          }
          const a = A[j - gap], bigger = a > temp;
          comparisons++;
          snap(7, `Compare A[${j - gap}] = ${a} with temp, ${temp}.`, `${a} > ${temp} is ${bigger}`, { focus: [j - gap] });
          if (!bigger) break;
          A[j] = a;
          shifts++;
          keyAt = null; written = j;
          snap(8, `${a} is bigger, so shift it ${gap} ${gap === 1 ? 'spot' : 'spots'} right into A[${j}].`, fmt(A), { focus: [j] });
          j -= gap;
          vars = { gap, i, temp, j };
          snap(9, `Move j back to ${j}.`, `j = ${j}`);
        }
        A[j] = temp;
        keyAt = null; written = j;
        snap(10, `Put ${temp} into A[${j}].`, fmt(A), { focus: [j] });
      }
      i = null; j = null; written = null;
      const finished = gap === 1;
      if (finished) done = true;
      passes.push({ label: `Gap ${gap}`, note: finished ? 'The list is sorted' : `Values ${gap} apart are sorted`, vals: [...A], from: finished ? 0 : n, to: n - 1, mark: null });
      gap = Math.floor(gap / 2);
      vars = { gap };
      snap(11, `The pass is done. Halve the gap to ${gap}.`, fmt(A), { major: true });
    }
    vars = {};
    snap(0, `Finished with ${comparisons} comparisons and ${shifts} shifts. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });
    return { steps, nodes: [] };
  }

  return { PSEUDO, buildSteps };
})();
