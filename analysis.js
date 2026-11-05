// Recurrence and complexity lessons for the divide-and-conquer pages. Numbers come from the current run.
function mergeLevels(r) {
  const maxD = Math.max(...r.nodes.map(x => x.d));
  const levels = [];
  for (let d = 0; d <= maxD; d++) {
    const nodes = r.nodes.filter(x => x.d === d);
    levels.push({
      cost: nodes.reduce((sum, x) => sum + (x.lo < x.hi ? x.hi - x.lo + 1 : 0), 0),
      boxes: nodes.map(x => ({ lo: x.lo, hi: x.hi, label: x.hi - x.lo + 1, leaf: x.lo === x.hi })),
    });
  }
  return { levels, total: levels.reduce((sum, l) => sum + l.cost, 0), workLevels: levels.filter(l => l.cost).length };
}

function quickLevels(r) {
  const maxD = Math.max(...r.nodes.map(x => x.d));
  const levels = [];
  for (let d = 0; d <= maxD; d++) {
    const nodes = r.nodes.filter(x => x.d === d);
    levels.push({
      cost: nodes.reduce((sum, x) => sum + (x.hi - x.lo), 0),
      boxes: nodes.map(x => ({ lo: x.lo, hi: x.hi, label: x.hi - x.lo + 1, leaf: x.lo === x.hi })),
    });
  }
  return { levels, total: levels.reduce((sum, l) => sum + l.cost, 0), workLevels: levels.filter(l => l.cost).length };
}

function binaryLevels(r) {
  const last = r.steps[r.steps.length - 1];
  const levels = last.passes.map(p => ({ cost: 1, boxes: [{ lo: p.lo, hi: p.hi, label: p.hi - p.lo + 1, leaf: false }] }));
  return { levels, total: levels.length, workLevels: levels.length };
}

const log2Ceil = n => Math.ceil(Math.log2(n));
const log2Floor = n => Math.floor(Math.log2(n));

/* ui */
function costTree(levels, n, label) {
  const rows = levels.map(l => `<div class="rt-row"><div class="rt-bar">${l.boxes.map(b =>
    `<span class="${b.leaf ? 'leaf' : ''}" style="left:${b.lo / n * 100}%;width:calc(${(b.hi - b.lo + 1) / n * 100}% - 3px)">${b.label}</span>`).join('')}</div><b>${l.cost}</b></div>`).join('');
  return `<div class="rt"><div class="rt-row rt-head"><span>Problem sizes at each level</span><b>${label}</b></div>${rows}</div>`;
}

// Pseudocode lines with their cost: the way to build a recurrence from code.
function costTable(rows) {
  return `<div class="cost-table">${rows.map(([line, cost]) =>
    `<code>${line.replace(/</g, '&lt;')}</code><b>${cost}</b>`).join('')}</div>`;
}

function halvings(n) {
  const sizes = [n];
  while (sizes[sizes.length - 1] > 1) sizes.push(Math.floor(sizes[sizes.length - 1] / 2));
  return sizes.join(' → ');
}

const ANALYSIS = {
  mergesort: {
    recurrence(r) {
      const n = r.steps[0].A.length, t = mergeLevels(r);
      return `
        <h3>The recurrence</h3>
        <p class="formula">T(n) = 2T(n/2) + n</p>
        <ul>
          <li><b>2</b>: each call makes two recursive calls.</li>
          <li><b>T(n/2)</b>: each of those calls gets half the list.</li>
          <li><b>+ n</b>: merging the two sorted halves takes about n steps.</li>
          <li><b>Base case</b>: T(1) is constant, because one element is already sorted.</li>
        </ul>
        <h3>Build it line by line</h3>
        <p>Label each line with its cost, then add them up. A recursive call on half the list costs T(n/2).</p>
        ${costTable([
          ['if lo >= hi: return', 'O(1)'],
          ['mid = floor((lo + hi) / 2)', 'O(1)'],
          ['mergeSort(A, lo, mid)', 'T(n/2)'],
          ['mergeSort(A, mid + 1, hi)', 'T(n/2)'],
          ['merge(A, lo, mid, hi)', 'O(n)'],
        ])}
        <p>Inside <code>merge</code>, the main loop and the two copy loops are each O(n), and O(n) + O(n) + O(n) = O(n). Adding everything and dropping the smaller O(1) terms gives T(n) = 2T(n/2) + n.</p>
        <h3>Your list as a recursion tree</h3>
        <p>Each bar is one call, labeled with its size. The widths add up to the same list at every level, which is why each level costs about n.</p>
        ${costTree(t.levels, n, 'Writes')}
        <p>Total for this list: <b>${t.total}</b> values written during merges, across ${t.workLevels} ${t.workLevels === 1 ? 'level' : 'levels'} of merging. Odd sizes make some bottom levels cost less than n.</p>
        <h3>Unroll it</h3>
        <pre class="formula">T(n) = 2T(n/2) + n
     = 4T(n/4) + 2n
     = 8T(n/8) + 3n
     = 2^k T(n/2^k) + kn</pre>
        <p>The base case arrives when n/2^k = 1, so k = log₂n. Substituting gives:</p>
        <p class="formula">T(n) = n·T(1) + n log₂n = Θ(n log n)</p>
        <h3>Check it with the Master Theorem</h3>
        <p>Match T(n) = aT(n/b) + f(n), with f(n) = nᵏ logᵖ n.</p>
        <ol>
          <li>a = 2, b = 2, and f(n) = n, so k = 1 and p = 0.</li>
          <li>log_b a = log₂2 = 1.</li>
          <li>log_b a equals k, and p = 0 is greater than -1, so this is Case 2.1: Θ(nᵏ logᵖ⁺¹ n).</li>
          <li>That gives <b>Θ(n log n)</b>, the same as unrolling.</li>
        </ol>`;
    },
    complexity(r) {
      const n = r.steps[0].A.length, t = mergeLevels(r), bound = n * log2Ceil(n);
      return `
        <h3>Time: Θ(n log n)</h3>
        <p>Don't try to count every step at once. Find the work on one level, count the levels, then multiply.</p>
        <ol>
          <li><b>Work on one level.</b> Each merge step places exactly one value, so merging m values takes m writes. All the lists on a level hold at most n values together, so a level costs at most n.</li>
          <li><b>Number of levels.</b> Halving gets to size 1 in about log₂n steps. For your list: ${halvings(n)}.</li>
          <li><b>Multiply.</b> n work per level × log₂n levels = n log₂n.</li>
        </ol>
        <p class="note"><b>On your list:</b> n = ${n}, so the limit is n⌈log₂n⌉ = ${bound}. It actually made ${t.total} writes.</p>
        <p><b>Why best, average and worst are all the same:</b> merge sort splits at the middle and merges everything no matter what the values are. A sorted list changes how many comparisons it makes, but only by a constant factor, so it stays Θ(n log n).</p>
        <h3>Space: O(n)</h3>
        <p>Add up the extra memory the algorithm holds at its peak.</p>
        <ol>
          <li><b>Temporary arrays.</b> The final merge copies all n values into L and R, which takes n extra spots.</li>
          <li><b>Call stack.</b> One call waits at each level, so the stack is about log₂n calls deep.</li>
          <li><b>Add, then keep the largest.</b> n + log₂n = O(n).</li>
        </ol>
        <p class="warn"><b>Common mistake:</b> answering O(n log n) space because every level uses n. L and R only exist while their merge runs, and they're gone before the next merge starts, so they don't pile up.</p>
        <h3>Compared with the naive approach</h3>
        <p>A <b>naive</b> solution finds an answer the simple way, without trying to optimize. A <b>brute force</b> solution goes further and accounts for every possible operation.</p>
        <p>The naive way to sort is a simple loop-based sort like insertion or selection sort: O(n²) time and O(1) extra space. Merge sort is much faster on large lists but uses O(n) extra memory. That's the trade-off.</p>
        <p>The two halves are also independent, so separate processors could sort them at the same time.</p>
        <h3>Why databases often prefer it</h3>
        <p>Merge sort stays Θ(n log n) on every input, keeps equal values in their original order, and reads data in order. That also makes it a good fit for data too large to fit in memory, which has to be sorted in pieces on disk.</p>
        <h3>What to write on an exam</h3>
        <p class="formula">T(n) = 2T(n/2) + n
Time: Θ(n log n) in every case
Space: O(n) temporary arrays
       + O(log n) stack = O(n)</p>`;
    },
  },

  quicksort: {
    recurrence(r) {
      const n = r.steps[0].A.length, t = quickLevels(r);
      return `
        <h3>The recurrence</h3>
        <p class="formula">T(n) = T(L) + T(R) + (n - 1)</p>
        <ul>
          <li><b>T(L)</b> and <b>T(R)</b>: the two sides of the pivot. L + R = n - 1, because the pivot is done.</li>
          <li><b>+ (n - 1)</b>: partition compares every other value with the pivot once.</li>
          <li><b>Base case</b>: a range of 0 or 1 values needs no work.</li>
        </ul>
        <p>Unlike merge sort, the pivot decides L and R, so there isn't one recurrence for every input. That's why quicksort has separate best and worst cases.</p>
        <h3>Build it line by line</h3>
        <p>Label each line with its cost, assuming the pivot splits the list evenly.</p>
        ${costTable([
          ['if lo < hi:', 'O(1)'],
          ['p = partition(A, lo, hi)', 'O(n)'],
          ['quickSort(A, lo, p - 1)', 'T(n/2)'],
          ['quickSort(A, p + 1, hi)', 'T(n/2)'],
        ])}
        <p>Inside <code>partition</code>, the loop checks n - 1 values, which is O(n), and everything else is O(1). Adding the lines gives T(n) = 2T(n/2) + n. Some versions also compare the pivot with itself, making n comparisons, but the big-O is the same.</p>
        <h3>Your list as a recursion tree</h3>
        <p>Each bar is one call, labeled with its size. Gaps are pivots that are already in their final spots, so each level has less left to do.</p>
        ${costTree(t.levels, n, 'Compares')}
        <p>Total for this list: <b>${t.total}</b> comparisons across ${t.workLevels} ${t.workLevels === 1 ? 'level' : 'levels'} of partitioning. Try <code>1, 2, 3, 4, 5, 6, 7, 8</code> to see the worst-case diagonal.</p>
        <h3>Best case: even splits</h3>
        <pre class="formula">T(n) = 2T(n/2) + n</pre>
        <p>This is the same recurrence as merge sort. Master Theorem: a = 2, b = 2, k = 1, p = 0. log₂2 = 1 = k, and p is greater than -1, so Case 2.1 gives <b>Θ(n log n)</b>.</p>
        <h3>Worst case: one side is empty</h3>
        <pre class="formula">T(n) = T(n-1) + n
     = T(n-2) + (n-1) + n
     = T(n-3) + (n-2) + (n-1) + n
     = 1 + 2 + ... + n
     = n(n+1)/2 = O(n²)</pre>
        <p class="warn"><b>The Master Theorem doesn't apply here.</b> It needs the size divided by a constant, as in T(n/b). T(n-1) only subtracts, so unroll it and use the summation instead.</p>`;
    },
    complexity(r) {
      const n = r.steps[0].A.length, t = quickLevels(r);
      return `
        <h3>Time: depends on the pivot</h3>
        <p>Use the same approach as merge sort: work per level × number of levels. The work per level is the same in every case, so the number of levels decides the answer.</p>
        <ol>
          <li><b>Work on one level.</b> A partition of m values makes m - 1 comparisons. All the ranges on a level hold at most n values, so a level costs at most n.</li>
          <li><b>Best case: O(n log n).</b> Each pivot lands in the middle, so sizes halve and there are about log₂n levels.</li>
          <li><b>Worst case: O(n²).</b> Each pivot is the smallest or largest value, so the size only drops by 1. That makes n levels: (n-1) + (n-2) + ... + 1 = n(n-1)/2.</li>
          <li><b>Average case: O(n log n).</b> Splits don't need to be perfect. Even a steady 9-to-1 split shrinks the larger side by a constant factor at each level, so the number of levels is still O(log n).</li>
        </ol>
        <p class="note"><b>On your list:</b> n = ${n}, with ${t.total} comparisons over ${t.workLevels} ${t.workLevels === 1 ? 'level' : 'levels'}. A perfectly balanced run would be near n log₂n ≈ ${Math.round(n * Math.log2(n))}, and the worst case is n(n-1)/2 = ${n * (n - 1) / 2}.</p>
        <p><b>When does the worst case happen?</b> With the last value as the pivot, as in this pseudocode: on lists already sorted, reverse sorted, or with all values equal.</p>
        <h3>Space: O(log n) average, O(n) worst</h3>
        <ol>
          <li><b>No temporary arrays.</b> Partition swaps values inside A and only uses a few variables, so each call adds O(1).</li>
          <li><b>The call stack is the real cost.</b> Waiting calls stack up, so the space equals the recursion depth.</li>
          <li><b>Depth follows the splits.</b> About log₂n when balanced and about n when lopsided.</li>
        </ol>
        <p class="warn"><b>Common mistake:</b> answering O(1) space because quicksort sorts in place. In place only means there are no extra arrays. The recursion still uses stack space.</p>
        <h3>Choosing the pivot</h3>
        <p>This version uses the last value because it's simple and takes O(1) to choose. It can split badly: in <code>3, 100, 5, 10, 200, 300</code>, the pivot 300 is the largest value, so everything else lands on one side.</p>
        <p>Choosing a pivot near the average value usually splits more evenly. Finding it takes O(n) per partition, which doesn't change the O(n) cost of partitioning, so an even split still gives O(n log n). It improves the odds but doesn't guarantee an even split.</p>
        <h3>Compared with the naive approach</h3>
        <p>The naive way to sort is a simple loop-based sort like insertion or selection sort: O(n²) time and O(1) extra space. Quicksort is usually much faster and needs no extra arrays, but its worst case is still O(n²) and it uses stack space.</p>
        <h3>What to write on an exam</h3>
        <p class="formula">Best:  T(n) = 2T(n/2) + n → O(n log n)
Worst: T(n) = T(n-1) + n → O(n²)
Average time: O(n log n)
Space: O(log n) average, O(n) worst</p>`;
    },
  },

  binarysearch: {
    recurrence(r) {
      const last = r.steps[r.steps.length - 1], n = last.A.length, t = binaryLevels(r);
      return `
        <h3>The recurrence</h3>
        <p class="formula">T(n) = T(n/2) + 1</p>
        <ul>
          <li><b>T(n/2)</b>: only one half is ever searched. The other half is thrown away.</li>
          <li><b>+ 1</b>: checking the middle takes constant time.</li>
          <li><b>Base case</b>: an empty range ends the search.</li>
        </ul>
        <p>Compare this with merge sort: there is one recursive call instead of two, and no merging afterward. Some textbooks call this "decrease and conquer" for that reason.</p>
        <h3>Build it line by line</h3>
        <p>A recurrence needs a recursive version, so here's the same search written that way. Label each line with its cost.</p>
        ${costTable([
          ['if lo > hi: return -1', 'O(1)'],
          ['mid = floor((lo + hi) / 2)', 'O(1)'],
          ['if A[mid] == target: return mid', 'O(1)'],
          ['if target < A[mid]: search left half', 'T(n/2)'],
          ['else: search right half', 'T(n/2)'],
        ])}
        <p>Only one of the two searches ever runs, so you count T(n/2) once. Adding the lines gives T(n) = T(n/2) + 1. The animation on this page uses a loop, which makes the same comparisons. You may also see <code>mid = lo + (hi - lo) // 2</code>, which gives the same index and avoids overflow in some languages.</p>
        <h3>Your search, level by level</h3>
        <p>Each bar is the range still possible at that loop, labeled with its size.</p>
        ${costTree(t.levels, n, 'Checks')}
        <p>Total for this search: <b>${t.total}</b> ${t.total === 1 ? 'check' : 'checks'}.</p>
        <h3>Unroll it</h3>
        <pre class="formula">T(n) = T(n/2) + 1
     = T(n/4) + 2
     = T(n/8) + 3
     = T(n/2^k) + k</pre>
        <p>The range reaches size 1 when n/2^k = 1, so k = log₂n. That leaves:</p>
        <p class="formula">T(n) = T(1) + log₂n = Θ(log n)</p>
        <h3>Check it with the Master Theorem</h3>
        <p>Match T(n) = aT(n/b) + f(n), with f(n) = nᵏ logᵖ n.</p>
        <ol>
          <li>a = 1, b = 2, and f(n) = 1 = n⁰ log⁰ n, so k = 0 and p = 0.</li>
          <li>log_b a = log₂1 = 0.</li>
          <li>log_b a equals k, and p = 0 is greater than -1, so this is Case 2.1: Θ(nᵏ logᵖ⁺¹ n).</li>
          <li>That gives n⁰ log¹ n = <b>Θ(log n)</b>, the same as unrolling.</li>
        </ol>`;
    },
    complexity(r) {
      const last = r.steps[r.steps.length - 1], n = last.A.length, t = binaryLevels(r), max = log2Floor(n) + 1;
      return `
        <h3>Time: O(log n)</h3>
        <p>Each loop does a constant amount of work, so the time is just the number of loops.</p>
        <ol>
          <li><b>Work in one loop.</b> Compute mid, compare once or twice, and move lo or hi. That doesn't depend on n.</li>
          <li><b>Number of loops.</b> Each loop at least halves the range: ${halvings(n)}.</li>
          <li><b>Multiply.</b> O(1) work × at most ⌊log₂n⌋ + 1 loops = O(log n).</li>
        </ol>
        <p class="note"><b>On your search:</b> n = ${n}, so the most checks it can take is ⌊log₂n⌋ + 1 = ${max}. It took ${t.total}.</p>
        <p><b>Best case: O(1).</b> The target is the first middle value.</p>
        <p><b>Worst case: O(log n).</b> The target is missing or isn't reached until the range shrinks to one value.</p>
        <p>To feel how slowly log n grows: doubling the list only adds one more check, and about a billion values take around 30 checks.</p>
        <h3>Space: O(1) with a loop, O(log n) recursive</h3>
        <ol>
          <li><b>This version uses a loop.</b> It only stores lo, hi and mid, whatever the list size.</li>
          <li><b>No copies.</b> It moves lo and hi instead of creating smaller arrays.</li>
        </ol>
        <p class="warn"><b>Check which version you wrote.</b> Recursive binary search has the same time, but each waiting call uses stack space, so its space is O(log n), not O(1). Answer for the version you actually wrote.</p>
        <p class="warn"><b>Also remember:</b> the list must already be sorted. O(log n) doesn't include sorting it first.</p>
        <h3>Compared with the naive approach</h3>
        <p>The naive search scans from the left and returns as soon as it finds the target. A brute force search accounts for every position. Both take O(n) time and O(1) space in the worst case.</p>
        <p>Binary search reduces the time to O(log n), but only works on a sorted list. If the list is unsorted and you only search once, scanning is cheaper than sorting first.</p>
        <h3>What to write on an exam</h3>
        <p class="formula">T(n) = T(n/2) + 1
Time: O(log n) worst, O(1) best
Space: O(1) iterative,
       O(log n) recursive</p>`;
    },
  },
};
