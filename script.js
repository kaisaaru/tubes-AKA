/* ============================================
   Tubes AKA - JavaScript
   Analisa Kompleksitas Algoritma
   Penghitung Huruf Kapital (Iteratif vs Rekursif)
   ============================================ */

// ==========================================
// ALGORITMA UTAMA
// ==========================================

/**
 * Algoritma Iteratif - Menghitung huruf kapital menggunakan loop
 * Kompleksitas Waktu: O(n) - linear, mengiterasi setiap karakter sekali
 * Kompleksitas Ruang: O(1) - konstanta, hanya menggunakan variabel counter
 */
function countCapitalIterative(str) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= "A" && str[i] <= "Z") {
      count++;
    }
  }
  return count;
}

/**
 * Algoritma Rekursif - Menghitung huruf kapital menggunakan rekursi
 * Kompleksitas Waktu: O(n) - linear, memanggil diri sendiri n kali
 * Kompleksitas Ruang: O(n) - linear, setiap panggilan menambah call stack
 */
function countCapitalRecursive(str, index = 0) {
  // Base case: jika index melebihi panjang string
  if (index >= str.length) {
    return 0;
  }

  // Cek apakah karakter saat ini kapital
  let isCapital = str[index] >= "A" && str[index] <= "Z" ? 1 : 0;

  // Recursive step: tambah hasil saat ini dengan hasil sisa string
  return isCapital + countCapitalRecursive(str, index + 1);
}

/**
 * Test maximum stack depth of the browser
 */
function testStackLimit() {
  const resultEl = document.getElementById("stackLimitResult");
  resultEl.innerHTML = '<span class="loading">Testing...</span>';
  resultEl.className = "stack-result";
  
  // Use setTimeout to allow UI to update
  setTimeout(() => {
    let depth = 0;
    
    function recurse() {
      depth++;
      recurse();
    }
    
    try {
      recurse();
    } catch (e) {
      // Stack overflow caught
    }
    
    // Format the result
    const formattedDepth = depth.toLocaleString("id-ID");
    resultEl.innerHTML = `Stack Limit Browser Anda: <strong>${formattedDepth}</strong> level<br>
      <small style="color: #64748b;">Artinya, maksimal input untuk rekursif adalah sekitar ${formattedDepth} karakter.</small>`;
    resultEl.className = "stack-result success";
  }, 100);
}

// ==========================================
// UI HELPER FUNCTIONS
// ==========================================

/**
 * Toggle visibility of code preview
 */
function toggleCode(id) {
  const el = document.getElementById(id);
  el.classList.toggle("show");

  // Update button text
  const btn = el.previousElementSibling;
  if (el.classList.contains("show")) {
    btn.innerHTML = "Sembunyikan Kode";
  } else {
    btn.innerHTML = "Lihat Kode";
  }
}

/**
 * Clear input and reset results
 */
function clearInput() {
  document.getElementById("inputText").value = "";
  document.getElementById("charCount").innerText = "0";
  resetResults();
}

/**
 * Update character count display
 */
function updateCharCount() {
  const text = document.getElementById("inputText").value;
  document.getElementById("charCount").innerText = text.length.toLocaleString("id-ID");
}

/**
 * Reset all results to initial state
 */
function resetResults() {
  document.getElementById("iterResult").innerText = "-";
  document.getElementById("iterTime").innerText = "- ms";
  document.getElementById("recResult").innerText = "-";
  document.getElementById("recTime").innerText = "- ms";
  document.getElementById("barRec").style.width = "15%";
  document.getElementById("barRec").innerText = "O(n) Linear";
  document.getElementById("statusMessage").innerHTML = "";
}

/**
 * Load sample text for testing
 */
function loadSample() {
  const sentence =
    "Algoritma Pemrograman Itu Menyenangkan. Belajar Coding Sangat Seru! ";
  let longText = sentence.repeat(145); // Sekitar 10000 karakter
  document.getElementById("inputText").value = longText;
  document.getElementById("charCount").innerText = longText.length.toLocaleString("id-ID");
  showStatus(`Teks sampel dimuat (${longText.length} karakter)`, "success");
}

/**
 * Show status message with type (info, success, error)
 */
function showStatus(message, type = "info") {
  const statusEl = document.getElementById("statusMessage");
  statusEl.innerHTML = message;
  statusEl.className = `status-message ${type}`;
}

// ==========================================
// MAIN ANALYSIS FUNCTION
// ==========================================

/**
 * Run analysis on input text
 */
function runAnalysis() {
  const text = document.getElementById("inputText").value;

  if (!text) {
    alert("Mohon masukkan teks terlebih dahulu!");
    return;
  }

  // 1. Jalankan Iteratif
  const t0 = performance.now();
  const iterResult = countCapitalIterative(text);
  const t1 = performance.now();
  const iterTime = (t1 - t0).toFixed(4);

  // Update UI Iteratif
  document.getElementById("iterResult").innerText = iterResult;
  document.getElementById("iterTime").innerText = iterTime + " ms";

  // 2. Jalankan Rekursif (Dengan Error Handling untuk Stack Overflow)
  // Batas manual - jika lebih dari ini, langsung tampilkan error tanpa mencoba
  // Browser limit asli akan ditangkap oleh try-catch
  const SAFE_RECURSION_LIMIT = 15000;

  if (text.length > SAFE_RECURSION_LIMIT) {
    document.getElementById("recResult").innerHTML =
      "<span class='error-msg'>Stack Overflow!</span>";
    document.getElementById("recTime").innerText = "Gagal";
    document.getElementById("barRec").style.width = "100%";
    document.getElementById("barRec").innerText = "MEMORY FULL";
    document.getElementById("barRec").style.background =
      "linear-gradient(90deg, #1e3a8a, #0f172a)";

    showStatus(
      `Teks terlalu panjang (${text.length} karakter) untuk metode Rekursif. Browser limit stack: ~${SAFE_RECURSION_LIMIT} karakter.`,
      "error"
    );
  } else {
    try {
      const t2 = performance.now();
      const recResult = countCapitalRecursive(text);
      const t3 = performance.now();
      const recTime = (t3 - t2).toFixed(4);

      // Update UI Rekursif
      document.getElementById("recResult").innerText = recResult;
      document.getElementById("recTime").innerText = recTime + " ms";

      // Visualisasi Stack
      let stackPercentage = Math.min(
        100,
        Math.max(15, (text.length / 5000) * 100)
      );
      document.getElementById("barRec").style.width = stackPercentage + "%";
      document.getElementById("barRec").innerText = `Stack Depth: ${text.length}`;
      document.getElementById("barRec").style.background = "";

      showStatus(
        `Analisa selesai. Panjang teks: ${text.length} karakter. Huruf kapital ditemukan: ${iterResult}`,
        "success"
      );
    } catch (e) {
      console.error(e);
      document.getElementById("recResult").innerHTML =
        `<span class='error-msg'>Stack Overflow!</span>`;
      document.getElementById("recTime").innerText = "Gagal";
      document.getElementById("barRec").style.width = "100%";
      document.getElementById("barRec").innerText = `Error @ ${text.length.toLocaleString("id-ID")} char`;
      document.getElementById("barRec").style.background =
        "linear-gradient(90deg, #1e3a8a, #0f172a)";
      showStatus(
        `Stack Overflow terjadi di ukuran input: ${text.length.toLocaleString("id-ID")} karakter. Browser Anda tidak mendukung rekursi sebanyak ini.`,
        "error"
      );
    }
  }
}

// ==========================================
// BENCHMARK & CHART FUNCTIONS
// ==========================================

let benchmarkChart = null;
let benchmarkData = {
  labels: [],
  iterative: [],
  recursive: [],
};

/**
 * Generate random text with specified length
 */
function generateRandomText(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Run benchmark for a single input size
 */
function runSingleBenchmark(size) {
  const text = generateRandomText(size);
  const iterations = 10; // Run multiple times for average

  // Benchmark Iterative
  let iterTimes = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    countCapitalIterative(text);
    const end = performance.now();
    iterTimes.push(end - start);
  }
  const iterAvg = iterTimes.reduce((a, b) => a + b, 0) / iterations;

  // Benchmark Recursive (only if safe)
  let recAvg = null;
  if (size <= 10000) {
    let recTimes = [];
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      countCapitalRecursive(text);
      const end = performance.now();
      recTimes.push(end - start);
    }
    recAvg = recTimes.reduce((a, b) => a + b, 0) / iterations;
  }

  return { iterative: iterAvg, recursive: recAvg };
}

/**
 * Run full benchmark across various input sizes
 */
async function runBenchmark() {
  const sizes = [10, 50, 100, 500, 1000, 2000, 3000, 5000, 7000, 8000, 9000, 10000];
  const statusEl = document.getElementById("benchmarkStatus");
  const btn = document.querySelector(".btn-success");

  // Disable button during benchmark
  btn.disabled = true;
  btn.innerHTML = "Running...";
  btn.classList.add("loading");

  // Reset data
  benchmarkData = {
    labels: [],
    iterative: [],
    recursive: [],
  };

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    statusEl.innerHTML = `<span class="loading">Menjalankan benchmark untuk ${size} karakter... (${
      i + 1
    }/${sizes.length})</span>`;

    // Allow UI to update
    await new Promise((resolve) => setTimeout(resolve, 50));

    const result = runSingleBenchmark(size);

    benchmarkData.labels.push(size);
    benchmarkData.iterative.push(result.iterative);
    benchmarkData.recursive.push(result.recursive);

    updateChart();
  }

  // Re-enable button
  btn.disabled = false;
  btn.innerHTML = "Run Benchmark";
  btn.classList.remove("loading");

  statusEl.innerHTML = `Benchmark selesai! Diuji dengan ${sizes.length} ukuran input berbeda (10 - 10000 karakter).`;
}

/**
 * Initialize or update the chart
 */
function updateChart() {
  const ctx = document.getElementById("benchmarkChart").getContext("2d");

  if (benchmarkChart) {
    benchmarkChart.data.labels = benchmarkData.labels;
    benchmarkChart.data.datasets[0].data = benchmarkData.iterative;
    benchmarkChart.data.datasets[1].data = benchmarkData.recursive;
    benchmarkChart.update();
  } else {
    benchmarkChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: benchmarkData.labels,
        datasets: [
          {
            label: "Iteratif O(n)",
            data: benchmarkData.iterative,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 8,
          },
          {
            label: "Rekursif O(n)",
            data: benchmarkData.recursive,
            borderColor: "#1e3a8a",
            backgroundColor: "rgba(30, 58, 138, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 14,
                weight: "600",
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 13 },
            padding: 15,
            cornerRadius: 10,
            callbacks: {
              label: function (context) {
                if (context.raw === null) {
                  return context.dataset.label + ": Stack Overflow";
                }
                return (
                  context.dataset.label + ": " + context.raw.toFixed(4) + " ms"
                );
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Ukuran Input (karakter)",
              font: { size: 14, weight: "600" },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Waktu Eksekusi (ms)",
              font: { size: 14, weight: "600" },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}

/**
 * Initialize chart on page load
 */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize empty chart
  updateChart();
});
