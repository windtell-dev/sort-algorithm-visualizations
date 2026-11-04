ALGOS.treesort = (() => {
  const PSEUDO = [
    'treeSort(A, n)',
    '  root = null',
    '  for i = 0 to n - 1:',
    '    root = insert(root, A[i])',
    '  k = 0',
    '  inorder(root, A, k)',
    '',
    'insert(node, x)',
    '  if node == null: return new Node(x)',
    '  if x < node.value: node.left = insert(node.left, x)',
    '  else: node.right = insert(node.right, x)',
    '  return node',
    '',
    'inorder(node, A, k)',
    '  if node == null: return',
    '  inorder(node.left, A, k)',
    '  A[k] = node.value; k++',
    '  inorder(node.right, A, k)',
  ];

  function buildSteps(input) {
    const A = [...input], n = A.length, steps = [], tree = [], stack = [`treeSort(A, ${n})`], visited = [];
    let vars = {}, cur = null, i = null, k = null, x = null, root = null;
    const snap = (line, text, output, extra = {}) => steps.push({
      line, text, output, A: [...A], vars: { ...vars }, stack: [...stack], cur, i, k, visible: tree.length, visited: [...visited], focus: [], major: false, ...extra,
    });

    function insert(node, value, depth, parent) {
      stack.push(`insert(${node ? node.value : 'null'}, ${value})`);
      if (!node) {
        const made = { id: tree.length, value, left: null, right: null, depth, parent };
        tree.push(made);
        cur = made.id;
        snap(9, `This spot is empty, so create a node for ${value}.`, `new Node(${value})`, { major: true });
        stack.pop();
        return made;
      }
      cur = node.id;
      snap(9, `Node ${node.value} is here, so keep going.`, 'node exists');
      const less = value < node.value;
      snap(10, `Compare ${value} with node ${node.value}.`, `${value} < ${node.value} is ${less}`);
      if (less) {
        node.left = insert(node.left, value, depth + 1, node.id);
      } else {
        cur = node.id;
        snap(11, `${value} isn't smaller, so go right.`, `go right of ${node.value}`);
        node.right = insert(node.right, value, depth + 1, node.id);
      }
      cur = node.id;
      snap(12, `Return node ${node.value} to its caller.`, `return ${node.value}`);
      stack.pop();
      return node;
    }

    function inorder(node) {
      stack.push(`inorder(${node ? node.value : 'null'})`);
      cur = node ? node.id : null;
      vars = { k };
      snap(14, node ? `Visit node ${node.value}.` : `Visit an empty spot.`, node ? `node = ${node.value}` : 'node = null');
      if (!node) {
        snap(15, `There's nothing here, so return.`, 'return');
        stack.pop();
        return;
      }
      snap(15, `Node ${node.value} exists, so keep going.`, 'node exists');
      snap(16, `Everything smaller is on the left, so handle that first.`, `go left of ${node.value}`);
      inorder(node.left);
      cur = node.id;
      A[k] = node.value;
      k++;
      visited.push(node.id);
      vars = { k };
      snap(17, `The left side is done, so write ${node.value} into A[${k - 1}].`, fmt(A.slice(0, k)), { major: true, focus: [k - 1] });
      snap(18, `Now handle everything larger, on the right.`, `go right of ${node.value}`);
      inorder(node.right);
      cur = node.id;
      stack.pop();
    }

    snap(1, `Start tree sort on ${fmt(A)}.`, fmt(A));
    snap(2, `Start with an empty tree.`, 'root = null');
    for (i = 0; i <= n - 1; i++) {
      x = A[i];
      vars = { i, x };
      cur = null;
      snap(3, `Take A[${i}] = ${x}.`, `i = ${i}`, { focus: [i] });
      snap(4, `Insert ${x}, starting from the root.`, `insert(root, ${x})`, { focus: [i] });
      root = insert(root, x, 0, null);
    }
    i = null; cur = null;
    k = 0;
    vars = { k };
    snap(5, `The tree holds every value. Set k to 0 to start writing back into A.`, 'k = 0');
    snap(6, `Walk the tree in order: left, node, right. That reads the values smallest first.`, 'inorder(root, A, 0)');
    inorder(root);
    cur = null; vars = {};
    snap(0, `Finished. The sorted list is ${fmt(A)}.`, fmt(A), { major: true });

    let rank = 0;
    (function place(node) {
      if (!node) return;
      place(node.left);
      node.rank = rank++;
      place(node.right);
    })(root);
    return { steps, nodes: [], tree };
  }

  return { PSEUDO, buildSteps };
})();
