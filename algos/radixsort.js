ALGOS.radixsort = (() => {
  const PSEUDO = [
    'radixSort(A, n)',
    '  max = largest value in A',
    '  for exp = 1; floor(max / exp) > 0; exp = exp * 10:',
    '    countingSort(A, n, exp)',
    '',
    'countingSort(A, n, exp)',
    '  count[0..9] = 0',
    '  for i = 0 to n - 1:',
    '    count[floor(A[i] / exp) % 10]++',
    '  for d = 1 to 9:',
    '    count[d] = count[d] + count[d - 1]',
    '  for i = n - 1 down to 0:',
    '    d = floor(A[i] / exp) % 10',
    '    count[d]--',
    '    output[count[d]] = A[i]',
    '  copy output into A',
  ];

  function placeName(exp) { return { 1: 'ones', 10: 'tens', 100: 'hundreds' }[exp]; }

  function buildSteps(input) {
    const A = [...input], n = A.length, steps = [], passes = [], stack = [`radixSort(A, ${n})`];
    let vars = {}, exp = null, count = null, output = null, i = null, d = null, written = null, done = false;
    const snap = (line, text, output_, extra = {}) => steps.push({
      line, text, output: output_, A: [...A], vars: { ...vars }, stack: [...stack], exp, i, d, written, done,
      count: count && [...count], out: output && [...output], passes: passes.map(p => ({ ...p })), focus: [], major: false, ...extra,
    });

    snap(1, `Start radix sort on ${fmt(A)}.`, fmt(A));
    const max = Math.max(...A);
    vars = { max };
    snap(2, `The largest value is ${max}, which sets how many digits to process.`, `max = ${max}`);
    for (exp = 1; ; exp *= 10) {
      count = null; output = null; i = null; d = null; written = null;
      vars = { max, exp };
      const more = Math.floor(max / exp) > 0;
      snap(3, more ? `floor(${max} / ${exp}) is above 0, so sort by the ${placeName(exp)} digit.` : `floor(${max} / ${exp}) is 0, so no digits are left.`, more ? 'loop: true' : 'loop ends');
      if (!more) break;
      snap(4, `Run a stable counting sort on the ${placeName(exp)} digit.`, `countingSort(A, ${n}, ${exp})`);
      stack.push(`countingSort(A, ${n}, ${exp})`);
      snap(6, `Counting sort groups values by their ${placeName(exp)} digit.`, 'counting sort starts');
      count = Array(10).fill(0);
      output = Array(n).fill('');
      snap(7, `Set all ten digit counts to 0.`, fmt(count));
      for (i = 0; i <= n - 1; i++) {
        d = Math.floor(A[i] / exp) % 10;
        vars = { max, exp, i };
        snap(8, `Look at A[${i}] = ${A[i]}.`, `i = ${i}`);
        count[d]++;
        snap(9, `Its ${placeName(exp)} digit is ${d}, so add 1 to count[${d}].`, fmt(count), { focus: [i] });
      }
      i = null; d = null;
      for (let x = 1; x <= 9; x++) {
        d = x;
        vars = { max, exp, d: x };
        snap(10, `Move to digit ${x}.`, `d = ${x}`);
        count[x] += count[x - 1];
        snap(11, `Add count[${x - 1}]. Now count[${x}] = ${count[x]} says how many values have a digit of ${x} or less.`, fmt(count));
      }
      d = null;
      for (i = n - 1; i >= 0; i--) {
        written = null;
        vars = { max, exp, i };
        snap(12, `Place A[${i}] = ${A[i]}, working from the end so equal digits keep their order.`, `i = ${i}`);
        d = Math.floor(A[i] / exp) % 10;
        vars = { max, exp, i, d };
        snap(13, `Its ${placeName(exp)} digit is ${d}.`, `d = ${d}`, { focus: [i] });
        count[d]--;
        snap(14, `Subtract 1 from count[${d}], which leaves ${count[d]}. That's its spot in the output.`, fmt(count));
        output[count[d]] = A[i];
        written = count[d];
        snap(15, `Write ${A[i]} into output[${count[d]}].`, fmt(output.filter(v => v !== '')), { focus: [i] });
      }
      i = null; d = null; written = null;
      for (let x = 0; x < n; x++) A[x] = output[x];
      vars = { max, exp };
      const last = Math.floor(max / (exp * 10)) === 0;
      if (last) done = true;
      passes.push({ label: `${placeName(exp)[0].toUpperCase() + placeName(exp).slice(1)} digit`, note: last ? 'The list is sorted' : 'Sorted by this digit', vals: [...A], from: last ? 0 : n, to: n - 1, mark: null });
      snap(16, `Copy the output back into A. It's now sorted by the ${placeName(exp)} digit.`, fmt(A), { major: true });
      stack.pop();
    }
    vars = {};
    done = true;
    exp = null;
    snap(0, `Finished. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });
    return { steps, nodes: [] };
  }

  return { PSEUDO, buildSteps };
})();
