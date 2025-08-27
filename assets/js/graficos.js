const canvas = document.getElementById('cartesian-plane');
const ctx = canvas.getContext('2d');
const points = [];

const canvasWidth = 660;
const canvasHeight = 660;
const gridSize = 30; 
const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;

let currentFunction = null;

function drawCartesianPlane() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvasWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
    }

    for (let y = 0; y <= canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasWidth, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasHeight);
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = -10; i <= 10; i++) {
        if (i !== 0) {
            const x = centerX + i * gridSize;
            if (x >= 0 && x <= canvasWidth) ctx.fillText(i.toString(), x, centerY + 15);
        }
    }

    for (let i = -10; i <= 10; i++) {
        if (i !== 0) {
            const y = centerY - i * gridSize;
            ctx.fillText(i.toString(), centerX - 15, y);
        }
    }

    ctx.fillText('0', centerX - 15, centerY + 15);
}

function drawLines() {
    if (points.length < 2 || !document.getElementById('show-lines').checked) return;

    ctx.strokeStyle = 'rgba(54, 162, 235, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    ctx.beginPath();
    const firstPoint = points[0];
    ctx.moveTo(centerX + firstPoint.x * gridSize, centerY - firstPoint.y * gridSize);

    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        ctx.lineTo(centerX + point.x * gridSize, centerY - point.y * gridSize);
    }

    ctx.stroke();
}

function drawPoints() {
    if (!document.getElementById('show-points').checked) return;

    ctx.fillStyle = 'rgba(255, 99, 132, 0.8)';
    points.forEach(point => {
        const pixelX = centerX + point.x * gridSize;
        const pixelY = centerY - point.y * gridSize;
        if (pixelX >= 0 && pixelX <= canvasWidth && pixelY >= 0 && pixelY <= canvasHeight) {
            ctx.beginPath();
            ctx.arc(pixelX, pixelY, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

function redrawCanvas() {
    drawCartesianPlane();
    drawLines();
    drawPoints();
}

function addPoint() {
    const x = parseFloat(document.getElementById('x-coord').value);
    const y = parseFloat(document.getElementById('y-coord').value);

    if (!isNaN(x) && !isNaN(y)) {
        points.push({ x, y });
        redrawCanvas();
        document.getElementById('x-coord').value = '';
        document.getElementById('y-coord').value = '';
    } else {
        alert('Por favor, ingrese coordenadas válidas.');
    }
}

function clearPoints() {
    points.length = 0;
    redrawCanvas();
}

function generateRandomFunction() {
    let m = Math.floor(Math.random() * 11) - 5;
    m = m === 0 ? 1 : m; 
    let b = Math.floor(Math.random() * 17) - 8;

    currentFunction = { m, b };
    displayFunction(m, b);
}

function displayFunction(m, b) {
    const functionDisplay = document.getElementById('function-display');
    let functionText = 'y = ';

    if (m === 1) functionText += 'x';
    else if (m === -1) functionText += '-x';
    else functionText += m + 'x';

    if (b > 0) functionText += ' + ' + b;
    else if (b < 0) functionText += ' - ' + Math.abs(b);

    functionDisplay.textContent = functionText;
}

function clearFunction() {
    currentFunction = null;
    document.getElementById('function-display').textContent = '';
}

// Limpiar texto de Gemini
function limpiarTexto(texto) {
    return texto.replace(/\*|\\textbf{}/g, '')
                .replace(/\\mathbf{}/g, '')
                .replace(/#+\s?/g, '')
                .replace(/\$/g, '')
                .replace(/---/g, '')
                .trim();
}

// Formatear texto de Gemini en HTML
function formatearGemini(texto) {
    let limpio = limpiarTexto(texto);
    limpio = limpio.replace(/y\(\d+\)\s?=\s?-?\d+/g, match => `<span class="highlight">${match}</span>`);
    const lineas = limpio.split(/\n+/).map(line => line.trim()).filter(line => line);
    return lineas.map(line => `<p>${line}</p>`).join('');
}

// Event listeners
document.getElementById('show-lines').addEventListener('change', redrawCanvas);
document.getElementById('show-points').addEventListener('change', redrawCanvas);

document.getElementById('x-coord').addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('y-coord').focus();
});
document.getElementById('y-coord').addEventListener('keypress', e => {
    if (e.key === 'Enter') addPoint();
});

drawCartesianPlane();

// Evaluate function con loader
document.getElementById("evaluate-function").addEventListener("click", async () => {
    if (!currentFunction) {
        alert("Primero genera una función aleatoria.");
        return;
    }

    const loader = document.getElementById('gemini-loader');
    const resultDiv = document.getElementById('gemini-result');

    loader.classList.remove('hidden');
    resultDiv.innerHTML = '';

    const { m, b } = currentFunction;
    const y0 = m * 0 + b;
    const y1 = m * 1 + b;

    let functionText = "y = ";
    if (m === 1) functionText += "x";
    else if (m === -1) functionText += "-x";
    else functionText += m + "x";
    if (b > 0) functionText += " + " + b;
    else if (b < 0) functionText += " - " + Math.abs(b);

    const prompt = `
    Explica en máximo 100 palabras cómo se evalúa la función ${functionText} 
    cuando x=0 y cuando x=1. 
    Los resultados ya los calculé: y(0) = ${y0}, y(1) = ${y1}.
    Solo necesito una explicación clara, simple y concisa para un estudiante.
    `;

    try {
        const res = await fetch("https://planocartesianobackend.onrender.com/api/resolver", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: prompt })
        });

        const data = await res.json();
        resultDiv.innerHTML = formatearGemini(data.reply);
    } catch (err) {
        console.error(err);
        resultDiv.textContent = "Error al contactar Gemini.";
    } finally {
        loader.classList.add('hidden');
    }
});
