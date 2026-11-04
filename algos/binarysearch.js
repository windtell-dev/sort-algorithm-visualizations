ALGOS.binarysearch = (() => {
  const PSEUDO = [
    'binarySearch(A, target)',
    '  lo = 0; hi = n - 1',
    '  while lo <= hi:',
    '    mid = floor((lo + hi) / 2)',
    '    if A[mid] == target: return mid',
    '    else if A[mid] < target: lo = mid + 1',
    '    else: hi = mid - 1',
    '  return -1',
  ];

  function buildSteps({ list, target }) {
    const A = [...list], steps = [], passes = [];
    let vars = { target }, lo = null, hi = null, mid = null, found = null;
    const snap = (line, text, output, major = false) => steps.push({
      line, text, output, major, A, vars: { ...vars }, stack: ['binarySearch(A, ' + target + ')'],
      lo, hi, mid, found, passes: passes.map(p => ({ ...p })),
    });

    snap(1, `Search the sorted list for ${target}.`, fmt(A));
    lo = 0; hi = A.length - 1;
    vars = { target, lo, hi };
    snap(2, `Start with the whole list: lo = ${lo} and hi = ${hi}.`, `lo = ${lo}, hi = ${hi}`);
    while (true) {
      const go = lo <= hi;
      snap(3, go ? `lo <= hi (${lo} <= ${hi}), so there's still a range to check.` : `lo > hi (${lo} > ${hi}), so no values are left to check.`, go ? 'loop: true' : 'loop: false');
      if (!go) break;
      mid = Math.floor((lo + hi) / 2);
      vars = { target, lo, mid, hi };
      passes.push({ lo, hi, mid, note: 'Checking the middle' });
      snap(4, `The middle is floor((${lo} + ${hi}) / 2) = ${mid}, and A[${mid}] = ${A[mid]}.`, `mid = ${mid}`);
      const a = A[mid], pass = passes[passes.length - 1];
      if (a === target) {
        found = mid;
        pass.note = `${a} = ${target}, found`;
        snap(5, `A[${mid}] = ${a} equals the target. Return ${mid}.`, `return ${mid}`, true);
        break;
      }
      snap(5, `A[${mid}] = ${a} is not ${target}.`, `${a} == ${target} is false`);
      if (a < target) {
        lo = mid + 1;
        vars = { target, lo, hi };
        pass.note = `${a} < ${target}, go right`;
        mid = null;
        snap(6, `${a} is less than ${target}, so discard the left side. Set lo to ${lo}.`, `lo = ${lo}`);
      } else {
        hi = mid - 1;
        vars = { target, lo, hi };
        pass.note = `${a} > ${target}, go left`;
        mid = null;
        snap(7, `${a} is greater than ${target}, so discard the right side. Set hi to ${hi}.`, `hi = ${hi}`);
      }
    }
    if (found === null) snap(8, `${target} isn't in the list. Return -1.`, 'return -1', true);
    const compares = passes.length;
    snap(0, found === null
      ? `Finished. ${target} isn't in the list, after checking ${compares} ${compares === 1 ? 'value' : 'values'}.`
      : `Finished. ${target} is at index ${found}, after checking ${compares} ${compares === 1 ? 'value' : 'values'}.`,
      found === null ? '-1' : String(found), true);
    return { steps, nodes: [] };
  }

  return { PSEUDO, buildSteps };
})();
