// Real code for each algorithm. In each line, the number before "|" is the pseudocode line it runs for (blank = none).
const LISTINGS = {
  mergesort: {
    cpp: `
|#include <vector>
|using namespace std;
|
8|void merge(vector<int>& A, int lo, int mid, int hi) {
9|  vector<int> L(A.begin() + lo, A.begin() + mid + 1);
10|  vector<int> R(A.begin() + mid + 1, A.begin() + hi + 1);
11|  size_t i = 0, j = 0;
11|  int k = lo;
12|  while (i < L.size() && j < R.size()) {
13|    if (L[i] <= R[j]) {
14|      A[k] = L[i];
14|      i++;
15|    } else {
16|      A[k] = R[j];
16|      j++;
|    }
17|    k++;
|  }
18|  while (i < L.size()) A[k++] = L[i++];
19|  while (j < R.size()) A[k++] = R[j++];
|}
|
1|void mergeSort(vector<int>& A, int lo, int hi) {
2|  if (lo >= hi) return;
3|  int mid = (lo + hi) / 2;
4|  mergeSort(A, lo, mid);
5|  mergeSort(A, mid + 1, hi);
6|  merge(A, lo, mid, hi);
|}`,
    java: `
|import java.util.Arrays;
|
|public class MergeSort {
8|  static void merge(int[] A, int lo, int mid, int hi) {
9|    int[] L = Arrays.copyOfRange(A, lo, mid + 1);
10|    int[] R = Arrays.copyOfRange(A, mid + 1, hi + 1);
11|    int i = 0, j = 0, k = lo;
12|    while (i < L.length && j < R.length) {
13|      if (L[i] <= R[j]) {
14|        A[k] = L[i];
14|        i++;
15|      } else {
16|        A[k] = R[j];
16|        j++;
|      }
17|      k++;
|    }
18|    while (i < L.length) A[k++] = L[i++];
19|    while (j < R.length) A[k++] = R[j++];
|  }
|
1|  static void mergeSort(int[] A, int lo, int hi) {
2|    if (lo >= hi) return;
3|    int mid = (lo + hi) / 2;
4|    mergeSort(A, lo, mid);
5|    mergeSort(A, mid + 1, hi);
6|    merge(A, lo, mid, hi);
|  }
|}`,
    python: `
8|def merge(A, lo, mid, hi):
9|    L = A[lo:mid + 1]
10|    R = A[mid + 1:hi + 1]
11|    i = j = 0
11|    k = lo
12|    while i < len(L) and j < len(R):
13|        if L[i] <= R[j]:
14|            A[k] = L[i]
14|            i += 1
15|        else:
16|            A[k] = R[j]
16|            j += 1
17|        k += 1
18|    while i < len(L):
18|        A[k] = L[i]
18|        i += 1
18|        k += 1
19|    while j < len(R):
19|        A[k] = R[j]
19|        j += 1
19|        k += 1
|
|
1|def merge_sort(A, lo, hi):
2|    if lo >= hi:
2|        return
3|    mid = (lo + hi) // 2
4|    merge_sort(A, lo, mid)
5|    merge_sort(A, mid + 1, hi)
6|    merge(A, lo, mid, hi)`,
  },

  quicksort: {
    cpp: `
|#include <utility>
|#include <vector>
|using namespace std;
|
7|int partition(vector<int>& A, int lo, int hi) {
8|  int pivot = A[hi];
8|  int i = lo - 1;
9|  for (int j = lo; j <= hi - 1; j++) {
10|    if (A[j] <= pivot) {
11|      i++;
11|      swap(A[i], A[j]);
|    }
|  }
12|  swap(A[i + 1], A[hi]);
13|  return i + 1;
|}
|
1|void quickSort(vector<int>& A, int lo, int hi) {
2|  if (lo < hi) {
3|    int p = partition(A, lo, hi);
4|    quickSort(A, lo, p - 1);
5|    quickSort(A, p + 1, hi);
|  }
|}`,
    java: `
|public class QuickSort {
7|  static int partition(int[] A, int lo, int hi) {
8|    int pivot = A[hi];
8|    int i = lo - 1;
9|    for (int j = lo; j <= hi - 1; j++) {
10|      if (A[j] <= pivot) {
11|        i++;
11|        int temp = A[i];
11|        A[i] = A[j];
11|        A[j] = temp;
|      }
|    }
12|    int temp = A[i + 1];
12|    A[i + 1] = A[hi];
12|    A[hi] = temp;
13|    return i + 1;
|  }
|
1|  static void quickSort(int[] A, int lo, int hi) {
2|    if (lo < hi) {
3|      int p = partition(A, lo, hi);
4|      quickSort(A, lo, p - 1);
5|      quickSort(A, p + 1, hi);
|    }
|  }
|}`,
    python: `
7|def partition(A, lo, hi):
8|    pivot = A[hi]
8|    i = lo - 1
9|    for j in range(lo, hi):
10|        if A[j] <= pivot:
11|            i += 1
11|            A[i], A[j] = A[j], A[i]
12|    A[i + 1], A[hi] = A[hi], A[i + 1]
13|    return i + 1
|
|
1|def quick_sort(A, lo, hi):
2|    if lo < hi:
3|        p = partition(A, lo, hi)
4|        quick_sort(A, lo, p - 1)
5|        quick_sort(A, p + 1, hi)`,
  },

  binarysearch: {
    cpp: `
|#include <vector>
|using namespace std;
|
1|int binarySearch(const vector<int>& A, int target) {
2|  int lo = 0;
2|  int hi = (int)A.size() - 1;
3|  while (lo <= hi) {
4|    int mid = (lo + hi) / 2;
5|    if (A[mid] == target) return mid;
6|    else if (A[mid] < target) lo = mid + 1;
7|    else hi = mid - 1;
|  }
8|  return -1;
|}`,
    java: `
|public class BinarySearch {
1|  static int binarySearch(int[] A, int target) {
2|    int lo = 0;
2|    int hi = A.length - 1;
3|    while (lo <= hi) {
4|      int mid = (lo + hi) / 2;
5|      if (A[mid] == target) return mid;
6|      else if (A[mid] < target) lo = mid + 1;
7|      else hi = mid - 1;
|    }
8|    return -1;
|  }
|}`,
    python: `
1|def binary_search(A, target):
2|    lo = 0
2|    hi = len(A) - 1
3|    while lo <= hi:
4|        mid = (lo + hi) // 2
5|        if A[mid] == target:
5|            return mid
6|        elif A[mid] < target:
6|            lo = mid + 1
7|        else:
7|            hi = mid - 1
8|    return -1`,
  },

  bubblesort: {
    cpp: `
|#include <utility>
|#include <vector>
|using namespace std;
|
1|void bubbleSort(vector<int>& A, int n) {
2|  for (int pass = 0; pass <= n - 2; pass++) {
3|    bool swapped = false;
4|    for (int j = 0; j <= n - 2 - pass; j++) {
5|      if (A[j] > A[j + 1]) {
6|        swap(A[j], A[j + 1]);
7|        swapped = true;
|      }
|    }
8|    if (!swapped) return;
|  }
|}`,
    java: `
|public class BubbleSort {
1|  static void bubbleSort(int[] A, int n) {
2|    for (int pass = 0; pass <= n - 2; pass++) {
3|      boolean swapped = false;
4|      for (int j = 0; j <= n - 2 - pass; j++) {
5|        if (A[j] > A[j + 1]) {
6|          int temp = A[j];
6|          A[j] = A[j + 1];
6|          A[j + 1] = temp;
7|          swapped = true;
|        }
|      }
8|      if (!swapped) return;
|    }
|  }
|}`,
    python: `
1|def bubble_sort(A, n):
2|    for pass_num in range(n - 1):
3|        swapped = False
4|        for j in range(n - 1 - pass_num):
5|            if A[j] > A[j + 1]:
6|                A[j], A[j + 1] = A[j + 1], A[j]
7|                swapped = True
8|        if not swapped:
8|            return`,
  },

  selectionsort: {
    cpp: `
|#include <utility>
|#include <vector>
|using namespace std;
|
1|void selectionSort(vector<int>& A, int n) {
2|  for (int i = 0; i <= n - 2; i++) {
3|    int min = i;
4|    for (int j = i + 1; j <= n - 1; j++) {
5|      if (A[j] < A[min]) {
6|        min = j;
|      }
|    }
7|    swap(A[i], A[min]);
|  }
|}`,
    java: `
|public class SelectionSort {
1|  static void selectionSort(int[] A, int n) {
2|    for (int i = 0; i <= n - 2; i++) {
3|      int min = i;
4|      for (int j = i + 1; j <= n - 1; j++) {
5|        if (A[j] < A[min]) {
6|          min = j;
|        }
|      }
7|      int temp = A[i];
7|      A[i] = A[min];
7|      A[min] = temp;
|    }
|  }
|}`,
    python: `
1|def selection_sort(A, n):
2|    for i in range(n - 1):
3|        min_idx = i
4|        for j in range(i + 1, n):
5|            if A[j] < A[min_idx]:
6|                min_idx = j
7|        A[i], A[min_idx] = A[min_idx], A[i]`,
  },

  insertionsort: {
    cpp: `
|#include <vector>
|using namespace std;
|
1|void insertionSort(vector<int>& A, int n) {
2|  for (int i = 1; i <= n - 1; i++) {
3|    int key = A[i];
4|    int j = i - 1;
5|    while (j >= 0 && A[j] > key) {
6|      A[j + 1] = A[j];
7|      j--;
|    }
8|    A[j + 1] = key;
|  }
|}`,
    java: `
|public class InsertionSort {
1|  static void insertionSort(int[] A, int n) {
2|    for (int i = 1; i <= n - 1; i++) {
3|      int key = A[i];
4|      int j = i - 1;
5|      while (j >= 0 && A[j] > key) {
6|        A[j + 1] = A[j];
7|        j--;
|      }
8|      A[j + 1] = key;
|    }
|  }
|}`,
    python: `
1|def insertion_sort(A, n):
2|    for i in range(1, n):
3|        key = A[i]
4|        j = i - 1
5|        while j >= 0 and A[j] > key:
6|            A[j + 1] = A[j]
7|            j -= 1
8|        A[j + 1] = key`,
  },

  heapsort: {
    cpp: `
|#include <utility>
|#include <vector>
|using namespace std;
|
8|void siftDown(vector<int>& A, int root, int size) {
9|  while (2 * root + 1 < size) {
10|    int child = 2 * root + 1;
11|    if (child + 1 < size && A[child + 1] > A[child]) {
12|      child = child + 1;
|    }
13|    if (A[root] >= A[child]) return;
14|    swap(A[root], A[child]);
15|    root = child;
|  }
|}
|
1|void heapSort(vector<int>& A, int n) {
2|  for (int i = n / 2 - 1; i >= 0; i--) {
3|    siftDown(A, i, n);
|  }
4|  for (int end = n - 1; end >= 1; end--) {
5|    swap(A[0], A[end]);
6|    siftDown(A, 0, end);
|  }
|}`,
    java: `
|public class HeapSort {
8|  static void siftDown(int[] A, int root, int size) {
9|    while (2 * root + 1 < size) {
10|      int child = 2 * root + 1;
11|      if (child + 1 < size && A[child + 1] > A[child]) {
12|        child = child + 1;
|      }
13|      if (A[root] >= A[child]) return;
14|      int temp = A[root];
14|      A[root] = A[child];
14|      A[child] = temp;
15|      root = child;
|    }
|  }
|
1|  static void heapSort(int[] A, int n) {
2|    for (int i = n / 2 - 1; i >= 0; i--) {
3|      siftDown(A, i, n);
|    }
4|    for (int end = n - 1; end >= 1; end--) {
5|      int temp = A[0];
5|      A[0] = A[end];
5|      A[end] = temp;
6|      siftDown(A, 0, end);
|    }
|  }
|}`,
    python: `
8|def sift_down(A, root, size):
9|    while 2 * root + 1 < size:
10|        child = 2 * root + 1
11|        if child + 1 < size and A[child + 1] > A[child]:
12|            child = child + 1
13|        if A[root] >= A[child]:
13|            return
14|        A[root], A[child] = A[child], A[root]
15|        root = child
|
|
1|def heap_sort(A, n):
2|    for i in range(n // 2 - 1, -1, -1):
3|        sift_down(A, i, n)
4|    for end in range(n - 1, 0, -1):
5|        A[0], A[end] = A[end], A[0]
6|        sift_down(A, 0, end)`,
  },

  shellsort: {
    cpp: `
|#include <vector>
|using namespace std;
|
1|void shellSort(vector<int>& A, int n) {
2|  int gap = n / 2;
3|  while (gap > 0) {
4|    for (int i = gap; i <= n - 1; i++) {
5|      int temp = A[i];
6|      int j = i;
7|      while (j >= gap && A[j - gap] > temp) {
8|        A[j] = A[j - gap];
9|        j = j - gap;
|      }
10|      A[j] = temp;
|    }
11|    gap = gap / 2;
|  }
|}`,
    java: `
|public class ShellSort {
1|  static void shellSort(int[] A, int n) {
2|    int gap = n / 2;
3|    while (gap > 0) {
4|      for (int i = gap; i <= n - 1; i++) {
5|        int temp = A[i];
6|        int j = i;
7|        while (j >= gap && A[j - gap] > temp) {
8|          A[j] = A[j - gap];
9|          j = j - gap;
|        }
10|        A[j] = temp;
|      }
11|      gap = gap / 2;
|    }
|  }
|}`,
    python: `
1|def shell_sort(A, n):
2|    gap = n // 2
3|    while gap > 0:
4|        for i in range(gap, n):
5|            temp = A[i]
6|            j = i
7|            while j >= gap and A[j - gap] > temp:
8|                A[j] = A[j - gap]
9|                j = j - gap
10|            A[j] = temp
11|        gap = gap // 2`,
  },

  radixsort: {
    cpp: `
|#include <algorithm>
|#include <vector>
|using namespace std;
|
6|void countingSort(vector<int>& A, int n, int exp) {
7|  vector<int> count(10, 0);
|  vector<int> output(n);
8|  for (int i = 0; i <= n - 1; i++) {
9|    count[(A[i] / exp) % 10]++;
|  }
10|  for (int d = 1; d <= 9; d++) {
11|    count[d] = count[d] + count[d - 1];
|  }
12|  for (int i = n - 1; i >= 0; i--) {
13|    int d = (A[i] / exp) % 10;
14|    count[d]--;
15|    output[count[d]] = A[i];
|  }
16|  A = output;
|}
|
1|void radixSort(vector<int>& A, int n) {
2|  int max = *max_element(A.begin(), A.end());
3|  for (int exp = 1; max / exp > 0; exp = exp * 10) {
4|    countingSort(A, n, exp);
|  }
|}`,
    java: `
|public class RadixSort {
6|  static void countingSort(int[] A, int n, int exp) {
7|    int[] count = new int[10];
|    int[] output = new int[n];
8|    for (int i = 0; i <= n - 1; i++) {
9|      count[(A[i] / exp) % 10]++;
|    }
10|    for (int d = 1; d <= 9; d++) {
11|      count[d] = count[d] + count[d - 1];
|    }
12|    for (int i = n - 1; i >= 0; i--) {
13|      int d = (A[i] / exp) % 10;
14|      count[d]--;
15|      output[count[d]] = A[i];
|    }
16|    System.arraycopy(output, 0, A, 0, n);
|  }
|
1|  static void radixSort(int[] A, int n) {
2|    int max = A[0];
2|    for (int i = 1; i < n; i++) {
2|      if (A[i] > max) max = A[i];
2|    }
3|    for (int exp = 1; max / exp > 0; exp = exp * 10) {
4|      countingSort(A, n, exp);
|    }
|  }
|}`,
    python: `
6|def counting_sort(A, n, exp):
7|    count = [0] * 10
|    output = [0] * n
8|    for i in range(n):
9|        count[(A[i] // exp) % 10] += 1
10|    for d in range(1, 10):
11|        count[d] = count[d] + count[d - 1]
12|    for i in range(n - 1, -1, -1):
13|        d = (A[i] // exp) % 10
14|        count[d] -= 1
15|        output[count[d]] = A[i]
16|    A[:] = output
|
|
1|def radix_sort(A, n):
2|    max_value = max(A)
3|    exp = 1
3|    while max_value // exp > 0:
4|        counting_sort(A, n, exp)
3|        exp = exp * 10`,
  },

  treesort: {
    cpp: `
|#include <vector>
|using namespace std;
|
|struct Node {
|  int value;
|  Node *left = nullptr, *right = nullptr;
|  Node(int v) : value(v) {}
|};
|
8|Node* insert(Node* node, int x) {
9|  if (node == nullptr) return new Node(x);
10|  if (x < node->value) node->left = insert(node->left, x);
11|  else node->right = insert(node->right, x);
12|  return node;
|}
|
14|void inorder(Node* node, vector<int>& A, int& k) {
15|  if (node == nullptr) return;
16|  inorder(node->left, A, k);
17|  A[k] = node->value;
17|  k++;
18|  inorder(node->right, A, k);
|}
|
|void freeTree(Node* node) {
|  if (node == nullptr) return;
|  freeTree(node->left);
|  freeTree(node->right);
|  delete node;
|}
|
1|void treeSort(vector<int>& A, int n) {
2|  Node* root = nullptr;
3|  for (int i = 0; i <= n - 1; i++) {
4|    root = insert(root, A[i]);
|  }
5|  int k = 0;
6|  inorder(root, A, k);
|  freeTree(root);
|}`,
    java: `
|public class TreeSort {
|  static class Node {
|    int value;
|    Node left, right;
|    Node(int v) { value = v; }
|  }
|
8|  static Node insert(Node node, int x) {
9|    if (node == null) return new Node(x);
10|    if (x < node.value) node.left = insert(node.left, x);
11|    else node.right = insert(node.right, x);
12|    return node;
|  }
|
14|  static int inorder(Node node, int[] A, int k) {
15|    if (node == null) return k;
16|    k = inorder(node.left, A, k);
17|    A[k] = node.value;
17|    k++;
18|    return inorder(node.right, A, k);
|  }
|
1|  static void treeSort(int[] A, int n) {
2|    Node root = null;
3|    for (int i = 0; i <= n - 1; i++) {
4|      root = insert(root, A[i]);
|    }
5|    int k = 0;
6|    inorder(root, A, k);
|  }
|}`,
    python: `
|class Node:
|    def __init__(self, value):
|        self.value = value
|        self.left = None
|        self.right = None
|
|
8|def insert(node, x):
9|    if node is None:
9|        return Node(x)
10|    if x < node.value:
10|        node.left = insert(node.left, x)
11|    else:
11|        node.right = insert(node.right, x)
12|    return node
|
|
14|def inorder(node, A, k):
15|    if node is None:
15|        return k
16|    k = inorder(node.left, A, k)
17|    A[k] = node.value
17|    k += 1
18|    return inorder(node.right, A, k)
|
|
1|def tree_sort(A, n):
2|    root = None
3|    for i in range(n):
4|        root = insert(root, A[i])
5|    k = 0
6|    inorder(root, A, k)`,
  },

  bucketsort: {
    cpp: `
|#include <algorithm>
|#include <vector>
|using namespace std;
|
|static void insertionSort(vector<int>& b) {
|  for (int i = 1; i < (int)b.size(); i++) {
|    int key = b[i];
|    int j = i - 1;
|    while (j >= 0 && b[j] > key) {
|      b[j + 1] = b[j];
|      j--;
|    }
|    b[j + 1] = key;
|  }
|}
|
1|void bucketSort(vector<int>& A, int n) {
2|  int min = *min_element(A.begin(), A.end());
2|  int max = *max_element(A.begin(), A.end());
3|  vector<vector<int>> buckets(n);
4|  for (int i = 0; i <= n - 1; i++) {
5|    int b = (A[i] - min) * n / (max - min + 1);
6|    buckets[b].push_back(A[i]);
|  }
7|  for (auto& b : buckets) {
8|    insertionSort(b);
|  }
9|  int k = 0;
10|  for (auto& b : buckets) {
11|    for (int x : b) {
12|      A[k] = x;
12|      k++;
|    }
|  }
|}`,
    java: `
|import java.util.ArrayList;
|
|public class BucketSort {
|  static void insertionSort(ArrayList<Integer> b) {
|    for (int i = 1; i < b.size(); i++) {
|      int key = b.get(i);
|      int j = i - 1;
|      while (j >= 0 && b.get(j) > key) {
|        b.set(j + 1, b.get(j));
|        j--;
|      }
|      b.set(j + 1, key);
|    }
|  }
|
1|  static void bucketSort(int[] A, int n) {
2|    int min = A[0], max = A[0];
2|    for (int i = 1; i < n; i++) {
2|      if (A[i] < min) min = A[i];
2|      if (A[i] > max) max = A[i];
2|    }
3|    ArrayList<ArrayList<Integer>> buckets = new ArrayList<>();
3|    for (int b = 0; b < n; b++) buckets.add(new ArrayList<>());
4|    for (int i = 0; i <= n - 1; i++) {
5|      int b = (A[i] - min) * n / (max - min + 1);
6|      buckets.get(b).add(A[i]);
|    }
7|    for (ArrayList<Integer> b : buckets) {
8|      insertionSort(b);
|    }
9|    int k = 0;
10|    for (ArrayList<Integer> b : buckets) {
11|      for (int x : b) {
12|        A[k] = x;
12|        k++;
|      }
|    }
|  }
|}`,
    python: `
|def insertion_sort(b):
|    for i in range(1, len(b)):
|        key = b[i]
|        j = i - 1
|        while j >= 0 and b[j] > key:
|            b[j + 1] = b[j]
|            j -= 1
|        b[j + 1] = key
|
|
1|def bucket_sort(A, n):
2|    low = min(A)
2|    high = max(A)
3|    buckets = [[] for _ in range(n)]
4|    for i in range(n):
5|        b = (A[i] - low) * n // (high - low + 1)
6|        buckets[b].append(A[i])
7|    for b in buckets:
8|        insertion_sort(b)
9|    k = 0
10|    for b in buckets:
11|        for x in b:
12|            A[k] = x
12|            k += 1`,
  },

  oddevensort: {
    cpp: `
|#include <utility>
|#include <vector>
|using namespace std;
|
1|void oddEvenSort(vector<int>& A, int n) {
2|  bool sorted = false;
3|  while (!sorted) {
4|    sorted = true;
5|    for (int i = 1; i <= n - 2; i += 2) {
6|      if (A[i] > A[i + 1]) {
7|        swap(A[i], A[i + 1]);
8|        sorted = false;
|      }
|    }
9|    for (int i = 0; i <= n - 2; i += 2) {
10|      if (A[i] > A[i + 1]) {
11|        swap(A[i], A[i + 1]);
12|        sorted = false;
|      }
|    }
|  }
|}`,
    java: `
|public class OddEvenSort {
1|  static void oddEvenSort(int[] A, int n) {
2|    boolean sorted = false;
3|    while (!sorted) {
4|      sorted = true;
5|      for (int i = 1; i <= n - 2; i += 2) {
6|        if (A[i] > A[i + 1]) {
7|          int temp = A[i];
7|          A[i] = A[i + 1];
7|          A[i + 1] = temp;
8|          sorted = false;
|        }
|      }
9|      for (int i = 0; i <= n - 2; i += 2) {
10|        if (A[i] > A[i + 1]) {
11|          int temp = A[i];
11|          A[i] = A[i + 1];
11|          A[i + 1] = temp;
12|          sorted = false;
|        }
|      }
|    }
|  }
|}`,
    python: `
1|def odd_even_sort(A, n):
2|    is_sorted = False
3|    while not is_sorted:
4|        is_sorted = True
5|        for i in range(1, n - 1, 2):
6|            if A[i] > A[i + 1]:
7|                A[i], A[i + 1] = A[i + 1], A[i]
8|                is_sorted = False
9|        for i in range(0, n - 1, 2):
10|            if A[i] > A[i + 1]:
11|                A[i], A[i + 1] = A[i + 1], A[i]
12|                is_sorted = False`,
  },
};
