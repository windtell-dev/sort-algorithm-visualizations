ALGOS.mergesort = (() => {
  const PSEUDO = [
    'mergeSort(A, lo, hi)',
    '  if lo >= hi: return',
    '  mid = floor((lo + hi) / 2)',
    '  mergeSort(A, lo, mid)',
    '  mergeSort(A, mid + 1, hi)',
    '  merge(A, lo, mid, hi)',
    '',
    'merge(A, lo, mid, hi)',
    '  L = copy of A[lo..mid]',
    '  R = copy of A[mid+1..hi]',
    '  i = 0; j = 0; k = lo',
    '  while i < length(L) and j < length(R):',
    '    if L[i] <= R[j]:',
    '      A[k] = L[i]; i++',
    '    else:',
    '      A[k] = R[j]; j++',
    '    k++',
    '  copy any remaining items from L into A',
    '  copy any remaining items from R into A',
  ];

  function buildSteps(input) {
    const A = [...input], steps = [], nodes = [], byKey = {}, stack = [];
    (function make(lo, hi, d) {
      const n = { key: lo + '-' + hi, lo, hi, d, state: 'todo', vals: null };
      nodes.push(n); byKey[n.key] = n;
      if (lo < hi) { const m = Math.floor((lo + hi) / 2); make(lo, m, d + 1); make(m + 1, hi, d + 1); }
    })(0, input.length - 1, 0);

    let vars = {}, mw = null, cur = null;
    const snap = (line, text, output, extra = {}) => steps.push({
      line, text, output, A: [...A], vars: { ...vars }, stack: [...stack], cur, mw: mw && { ...mw },
      nodes: nodes.map(n => ({ state: n.state, vals: n.vals && [...n.vals] })), hl: null, major: false, ...extra,
    });

    function merge(lo, mid, hi, node) {
      stack.push(`merge(${lo}, ${mid}, ${hi})`);
      snap(8, `Start merging A[${lo}..${mid}] and A[${mid + 1}..${hi}].`, 'merge starts');
      const L = A.slice(lo, mid + 1), R = A.slice(mid + 1, hi + 1);
      mw = { L, R: null, i: null, j: null };
      snap(9, `Copy the left half into L = ${fmt(L)}.`, `L = ${fmt(L)}`);
      mw.R = R;
      snap(10, `Copy the right half into R = ${fmt(R)}.`, `R = ${fmt(R)}`);
      let i = 0, j = 0, k = lo;
      const sync = () => {
        mw.i = i; mw.j = j;
        vars = { lo, mid, hi, i, j, k };
        node.vals = A.slice(lo, k).concat(Array(hi - k + 1).fill(null));
      };
      node.state = 'merging'; sync();
      snap(11, `Point i at the front of L, j at the front of R, and k at A[${lo}], the next spot to fill.`, `i = 0, j = 0, k = ${lo}`);
      const sofar = () => fmt(A.slice(lo, k));
      while (true) {
        const go = i < L.length && j < R.length;
        snap(12, go ? `L and R both have items left, so the loop continues.`
          : `${i >= L.length ? 'L' : 'R'} has no items left, so the loop ends.`, go ? 'loop: true' : 'loop: false');
        if (!go) break;
        const a = L[i], b = R[j], leftWins = a <= b;
        snap(13, `Compare the fronts: L[${i}] = ${a} and R[${j}] = ${b}.`, `${a} <= ${b} is ${leftWins}`, { hl: { kind: 'compare' } });
        const at = k;
        A[k] = leftWins ? a : b;
        if (leftWins) i++; else j++;
        const taken = leftWins ? i - 1 : j - 1;
        const side = leftWins ? 'L' : 'R';
        k++; sync(); vars.k = at;
        snap(leftWins ? 14 : 16, `${leftWins ? a + ' is less than or equal to ' + b : a + ' is greater than ' + b}, so write ${A[at]} into A[${at}] and move ${leftWins ? 'i' : 'j'} forward.`,
          `A[${at}] = ${A[at]}  so far ${sofar()}`, { hl: { kind: 'write', side, idx: taken, k: at } });
        vars.k = k;
        snap(17, `Move k forward to ${k}.`, `k = ${k}`);
      }
      const drain = (arr, name, line) => {
        const has = name === 'L' ? i < L.length : j < R.length;
        if (!has) { snap(line, `${name} has nothing left to copy.`, 'nothing to copy'); return; }
        while (name === 'L' ? i < L.length : j < R.length) {
          const idx = name === 'L' ? i : j, at = k;
          A[k] = arr[idx];
          if (name === 'L') i++; else j++;
          k++; sync(); vars.k = at;
          snap(line, `Copy the leftover ${arr[idx]} from ${name} into A[${at}].`, `A[${at}] = ${arr[idx]}  so far ${sofar()}`,
            { hl: { kind: 'write', side: name, idx, k: at } });
          vars.k = k;
        }
      };
      drain(L, 'L', 18);
      drain(R, 'R', 19);
      stack.pop();
      mw = null;
    }

    function sort(lo, hi) {
      const node = byKey[lo + '-' + hi];
      let scope = { lo, hi };
      stack.push(`mergeSort(${lo}, ${hi})`);
      node.state = 'open'; node.vals = A.slice(lo, hi + 1);
      cur = node.key; vars = scope;
      snap(1, `Call mergeSort on A[${lo}..${hi}] = ${fmt(node.vals)}.`, fmt(node.vals));
      if (lo >= hi) {
        node.state = 'done';
        snap(2, `lo >= hi (${lo} >= ${hi}), so this list has one element. It's already sorted, so return.`, `base case ${fmt(node.vals)}`);
        stack.pop();
        return;
      }
      snap(2, `lo < hi (${lo} < ${hi}), so this list still needs to be split.`, 'keep going');
      const mid = Math.floor((lo + hi) / 2);
      vars = scope = { lo, mid, hi };
      snap(3, `The middle is floor((${lo} + ${hi}) / 2) = ${mid}.`, `mid = ${mid}`);
      snap(4, `Sort the left half, A[${lo}..${mid}].`, fmt(A.slice(lo, mid + 1)));
      sort(lo, mid);
      cur = node.key; vars = scope;
      snap(5, `The left half is sorted. Now sort the right half, A[${mid + 1}..${hi}].`, fmt(A.slice(mid + 1, hi + 1)));
      sort(mid + 1, hi);
      cur = node.key; vars = scope;
      snap(6, `Both halves are sorted, so merge them.`, `${fmt(A.slice(lo, mid + 1))} + ${fmt(A.slice(mid + 1, hi + 1))}`);
      merge(lo, mid, hi, node);
      node.state = 'done'; node.vals = A.slice(lo, hi + 1);
      vars = scope;
      snap(6, `The merge is finished, so A[${lo}..${hi}] is sorted. Return to the caller.`, fmt(node.vals), { major: true });
      stack.pop();
    }

    sort(0, input.length - 1);
    cur = null; vars = {};
    snap(0, `Finished. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });
    return { steps, nodes };
  }

  return { PSEUDO, buildSteps };
})();
