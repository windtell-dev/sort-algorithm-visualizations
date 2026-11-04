ALGOS.quicksort = (() => {
  const PSEUDO = [
    'quickSort(A, lo, hi)',
    '  if lo < hi:',
    '    p = partition(A, lo, hi)',
    '    quickSort(A, lo, p - 1)',
    '    quickSort(A, p + 1, hi)',
    '',
    'partition(A, lo, hi)',
    '  pivot = A[hi]; i = lo - 1',
    '  for j = lo to hi - 1:',
    '    if A[j] <= pivot:',
    '      i++; swap A[i], A[j]',
    '  swap A[i + 1], A[hi]',
    '  return i + 1',
  ];

  function buildSteps(input) {
    const A = [...input], steps = [], nodes = [], stack = [], placed = new Set();
    let vars = {}, cur = null, part = null;
    const snap = (line, text, output, extra = {}) => steps.push({
      line, text, output, A: [...A], vars: { ...vars }, stack: [...stack], cur, part: part && { ...part }, placed: [...placed],
      nodes: nodes.map(n => ({ state: n.state, vals: [...n.vals], p: n.p })), focus: [], major: false, ...extra,
    });
    const swap = (a, b) => { [A[a], A[b]] = [A[b], A[a]]; };

    function partition(lo, hi, node) {
      stack.push(`partition(${lo}, ${hi})`);
      node.state = 'merging';
      snap(7, `Start partitioning A[${lo}..${hi}].`, 'partition starts');
      const pivot = A[hi];
      let i = lo - 1;
      part = { lo, hi, pivot, i, seen: lo, j: null, pivotAt: hi };
      vars = { lo, hi, pivot, i };
      snap(8, `The pivot is the last value, A[${hi}] = ${pivot}. Set i to ${i}, just before the range.`, `pivot = ${pivot}, i = ${i}`);
      for (let j = lo; j < hi; j++) {
        part.j = j; part.seen = j; vars.j = j;
        snap(9, `Move j to ${j}.`, `j = ${j}`);
        const a = A[j], small = a <= pivot;
        snap(10, `Compare A[${j}] = ${a} with the pivot, ${pivot}.`, `${a} <= ${pivot} is ${small}`, { focus: [j] });
        part.seen = j + 1;
        if (small) {
          i++;
          swap(i, j);
          part.i = i; vars.i = i;
          node.vals = A.slice(lo, hi + 1);
          snap(11, i === j
            ? `${a} belongs on the left. Move i to ${i}. i and j match, so the swap changes nothing.`
            : `${a} belongs on the left. Move i to ${i}, then swap A[${i}] and A[${j}].`, fmt(A.slice(lo, hi + 1)), { focus: [i, j] });
        }
      }
      part.j = null; part.seen = hi; delete vars.j;
      snap(9, `j has checked every value before the pivot, so the loop ends.`, 'loop ends');
      const q = i + 1;
      swap(q, hi);
      part.pivotAt = q; part.seen = hi + 1;
      node.vals = A.slice(lo, hi + 1);
      snap(12, `Swap the pivot into A[${q}]. Smaller or equal values are on its left, and larger values are on its right.`, fmt(A.slice(lo, hi + 1)), { focus: [q, hi] });
      snap(13, `Return the pivot's index, ${q}.`, `return ${q}`);
      stack.pop();
      part = null;
      return q;
    }

    function sort(lo, hi, d) {
      stack.push(`quickSort(${lo}, ${hi})`);
      vars = { lo, hi };
      if (lo > hi) {
        snap(1, `Call quickSort on an empty range, lo = ${lo} and hi = ${hi}.`, '[]');
        snap(2, `lo < hi is false (${lo} > ${hi}), so there's nothing to sort. Return.`, 'empty, return');
        stack.pop();
        return;
      }
      const node = { key: lo + '-' + hi, lo, hi, d, state: 'open', vals: A.slice(lo, hi + 1), p: null };
      nodes.push(node);
      cur = node.key;
      snap(1, `Call quickSort on A[${lo}..${hi}] = ${fmt(node.vals)}.`, fmt(node.vals));
      if (lo === hi) {
        placed.add(lo);
        node.state = 'done';
        snap(2, `lo < hi is false (${lo} = ${hi}). One element is already in its final spot, so return.`, `base case ${fmt(node.vals)}`);
        stack.pop();
        return;
      }
      snap(2, `lo < hi (${lo} < ${hi}), so this range needs sorting.`, 'keep going');
      snap(3, `Partition A[${lo}..${hi}].`, fmt(node.vals));
      const p = partition(lo, hi, node);
      const scope = { lo, hi, p };
      vars = scope; cur = node.key;
      node.state = 'open'; node.p = p; node.vals = A.slice(lo, hi + 1);
      placed.add(p);
      snap(3, `partition returned ${p}. The pivot, ${A[p]}, is in its final spot and never moves again.`, `p = ${p}`, { major: true });
      snap(4, `Sort the values left of the pivot, lo = ${lo} to p - 1 = ${p - 1}.`, fmt(A.slice(lo, p)));
      sort(lo, p - 1, d + 1);
      vars = scope; cur = node.key;
      snap(5, `The left side is done. Now sort the values right of the pivot, p + 1 = ${p + 1} to hi = ${hi}.`, fmt(A.slice(p + 1, hi + 1)));
      sort(p + 1, hi, d + 1);
      vars = scope; cur = node.key;
      node.state = 'done'; node.vals = A.slice(lo, hi + 1);
      snap(5, `Both sides are done, so A[${lo}..${hi}] is sorted. Return to the caller.`, fmt(node.vals), { major: true });
      stack.pop();
    }

    sort(0, input.length - 1, 0);
    cur = null; vars = {};
    snap(0, `Finished. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });
    return { steps, nodes };
  }

  return { PSEUDO, buildSteps };
})();
