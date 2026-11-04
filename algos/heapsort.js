ALGOS.heapsort = (() => {
  const PSEUDO = [
    'heapSort(A, n)',
    '  for i = floor(n / 2) - 1 down to 0:',
    '    siftDown(A, i, n)',
    '  for end = n - 1 down to 1:',
    '    swap A[0], A[end]',
    '    siftDown(A, 0, end)',
    '',
    'siftDown(A, root, size)',
    '  while 2 * root + 1 < size:',
    '    child = 2 * root + 1',
    '    if child + 1 < size and A[child + 1] > A[child]:',
    '      child = child + 1',
    '    if A[root] >= A[child]: return',
    '    swap A[root], A[child]',
    '    root = child',
  ];

  function buildSteps(input) {
    const A = [...input], n = A.length, steps = [], stack = [`heapSort(A, ${n})`];
    let vars = {}, size = n, sortedFrom = n, root = null, child = null;
    const snap = (line, text, output, extra = {}) => steps.push({
      line, text, output, A: [...A], vars: { ...vars }, stack: [...stack], size, sortedFrom, root, child, focus: [], major: false, ...extra,
    });
    const swap = (a, b) => { [A[a], A[b]] = [A[b], A[a]]; };

    function siftDown(start, heapSize) {
      stack.push(`siftDown(A, ${start}, ${heapSize})`);
      let r = start;
      root = r; child = null;
      vars = { root: r, size: heapSize };
      snap(8, `Repair the heap starting at index ${r}, the value ${A[r]}.`, `root = ${r}, size = ${heapSize}`);
      while (true) {
        const hasChild = 2 * r + 1 < heapSize;
        snap(9, hasChild ? `Index ${r} has at least one child in the heap.` : `Index ${r} has no children in the heap, so stop.`, hasChild ? 'loop: true' : 'loop: false');
        if (!hasChild) break;
        let c = 2 * r + 1;
        child = c;
        vars = { root: r, child: c, size: heapSize };
        snap(10, `Start with the left child, A[${c}] = ${A[c]}.`, `child = ${c}`);
        if (c + 1 < heapSize) {
          const rightBigger = A[c + 1] > A[c];
          snap(11, `Compare the children: A[${c + 1}] = ${A[c + 1]} and A[${c}] = ${A[c]}.`, `${A[c + 1]} > ${A[c]} is ${rightBigger}`, { focus: [c, c + 1] });
          if (rightBigger) {
            c++;
            child = c;
            vars = { root: r, child: c, size: heapSize };
            snap(12, `The right child is larger, so use index ${c}.`, `child = ${c}`);
          }
        } else {
          snap(11, `There's no right child, so keep the left child.`, 'no right child');
        }
        const inOrder = A[r] >= A[c];
        snap(13, `Compare the parent A[${r}] = ${A[r]} with its larger child A[${c}] = ${A[c]}.`, `${A[r]} >= ${A[c]} is ${inOrder}`, { focus: [r, c] });
        if (inOrder) break;
        swap(r, c);
        snap(14, `The child is larger, so swap them.`, fmt(A), { focus: [r, c] });
        r = c;
        root = r; child = null;
        vars = { root: r, size: heapSize };
        snap(15, `Follow the value down to index ${r}.`, `root = ${r}`);
      }
      stack.pop();
      root = null; child = null;
    }

    snap(1, `Start heap sort on ${fmt(A)}. First, arrange the array as a max-heap.`, fmt(A));
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      vars = { i };
      snap(2, `Index ${i} is the next parent to fix, working up from the last one.`, `i = ${i}`);
      snap(3, `Sift A[${i}] = ${A[i]} down.`, `siftDown(A, ${i}, ${n})`);
      siftDown(i, n);
      vars = { i };
    }
    for (let end = n - 1; end >= 1; end--) {
      vars = { end };
      size = end + 1;
      snap(4, `The largest value left, ${A[0]}, is at the top of the heap. It belongs at index ${end}.`, `end = ${end}`);
      swap(0, end);
      size = end;
      sortedFrom = end;
      snap(5, `Swap it to index ${end}, where it's in its final spot. The heap shrinks to ${end}.`, fmt(A), { major: true, focus: [0, end] });
      snap(6, `The new top may break the heap, so sift it down.`, `siftDown(A, 0, ${end})`);
      siftDown(0, end);
      vars = { end };
    }
    sortedFrom = 0; size = 0; vars = {};
    snap(0, `Finished. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });
    return { steps, nodes: [] };
  }

  return { PSEUDO, buildSteps };
})();
