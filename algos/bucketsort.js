ALGOS.bucketsort = (() => {
  const PSEUDO = [
    'bucketSort(A, n)',
    '  min = smallest value in A; max = largest value in A',
    '  create n empty buckets',
    '  for i = 0 to n - 1:',
    '    b = floor((A[i] - min) * n / (max - min + 1))',
    '    add A[i] to bucket b',
    '  for each bucket b:',
    '    insertionSort(b)',
    '  k = 0',
    '  for each bucket b:',
    '    for each x in b:',
    '      A[k] = x; k++',
  ];

  function buildSteps(input) {
    const A = [...input], n = A.length, steps = [], stack = [`bucketSort(A, ${n})`];
    let vars = {}, buckets = null, i = null, k = null, active = null, sortedBuckets = -1, item = null;
    const snap = (line, text, output, extra = {}) => steps.push({
      line, text, output, A: [...A], vars: { ...vars }, stack: [...stack], i, k, active, item, sortedBuckets,
      buckets: buckets && buckets.map(b => [...b]), focus: [], major: false, ...extra,
    });

    snap(1, `Start bucket sort on ${fmt(A)}.`, fmt(A));
    const min = Math.min(...A), max = Math.max(...A);
    vars = { min, max };
    snap(2, `The smallest value is ${min} and the largest is ${max}.`, `min = ${min}, max = ${max}`);
    buckets = Array.from({ length: n }, () => []);
    snap(3, `Create ${n} empty buckets, one for each value.`, `${n} buckets`);
    for (i = 0; i <= n - 1; i++) {
      active = null; item = null;
      vars = { min, max, i };
      snap(4, `Take A[${i}] = ${A[i]}.`, `i = ${i}`, { focus: [i] });
      const b = Math.floor((A[i] - min) * n / (max - min + 1));
      active = b;
      vars = { min, max, i, b };
      snap(5, `(${A[i]} - ${min}) * ${n} / ${max - min + 1} rounds down to ${b}, so ${A[i]} goes in bucket ${b}.`, `b = ${b}`, { focus: [i] });
      buckets[b].push(A[i]);
      item = buckets[b].length - 1;
      snap(6, `Add ${A[i]} to bucket ${b}.`, `bucket ${b} = ${fmt(buckets[b])}`, { focus: [i] });
    }
    i = null; active = null; item = null;
    for (let b = 0; b < n; b++) {
      active = b;
      vars = { min, max, b };
      snap(7, buckets[b].length ? `Move to bucket ${b}, which holds ${fmt(buckets[b])}.` : `Bucket ${b} is empty.`, `bucket ${b} = ${fmt(buckets[b])}`);
      const before = fmt(buckets[b]);
      for (let x = 1; x < buckets[b].length; x++) {
        const key = buckets[b][x];
        let y = x - 1;
        while (y >= 0 && buckets[b][y] > key) { buckets[b][y + 1] = buckets[b][y]; y--; }
        buckets[b][y + 1] = key;
      }
      sortedBuckets = b;
      snap(8, buckets[b].length > 1 ? `Insertion sort turns ${before} into ${fmt(buckets[b])}.` : `Insertion sort has nothing to reorder in this bucket.`, fmt(buckets[b]), { major: buckets[b].length > 1 });
    }
    active = null;
    k = 0;
    vars = { min, max, k };
    snap(9, `Every bucket is sorted. Set k to 0 to start writing back into A.`, 'k = 0');
    for (let b = 0; b < n; b++) {
      active = b; item = null;
      vars = { min, max, b, k };
      snap(10, buckets[b].length ? `Read from bucket ${b}.` : `Bucket ${b} is empty, so skip it.`, `bucket ${b} = ${fmt(buckets[b])}`);
      for (let y = 0; y < buckets[b].length; y++) {
        item = y;
        vars = { min, max, b, x: buckets[b][y], k };
        snap(11, `The next value in bucket ${b} is ${buckets[b][y]}.`, `x = ${buckets[b][y]}`);
        A[k] = buckets[b][y];
        k++;
        vars = { min, max, b, x: buckets[b][y], k };
        snap(12, `Write ${buckets[b][y]} into A[${k - 1}].`, fmt(A.slice(0, k)), { major: true, focus: [k - 1] });
      }
    }
    active = null; item = null; vars = {};
    snap(0, `Finished. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });
    return { steps, nodes: [] };
  }

  return { PSEUDO, buildSteps };
})();
