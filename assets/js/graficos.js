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
                    const x = centerX + (i * gridSize);
                    if (x >= 0 && x <= canvasWidth) {
                        ctx.fillText(i.toString(), x, centerY + 15);
                    }
                }
            }
            
            ctx.textAlign = 'center';
            for (let i = -10; i <= 10; i++) {
                if (i !== 0) {
                    const y = centerY - (i * gridSize);
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
            const firstPixelX = centerX + (firstPoint.x * gridSize);
            const firstPixelY = centerY - (firstPoint.y * gridSize);
            ctx.moveTo(firstPixelX, firstPixelY);
            
            for (let i = 1; i < points.length; i++) {
                const point = points[i];
                const pixelX = centerX + (point.x * gridSize);
                const pixelY = centerY - (point.y * gridSize);
                ctx.lineTo(pixelX, pixelY);
            }
            
            ctx.stroke();
        }

        function drawPoints() {
            if (!document.getElementById('show-points').checked) return;
            
            ctx.fillStyle = 'rgba(255, 99, 132, 0.8)';
            points.forEach(point => {
                const pixelX = centerX + (point.x * gridSize);
                const pixelY = centerY - (point.y * gridSize);
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
                points.push({ x: x, y: y });
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
            
            currentFunction = { m: m, b: b };
            displayFunction(m, b);
        }

        function displayFunction(m, b) {
            const functionDisplay = document.getElementById('function-display');
            let functionText = 'y = ';
            
            if (m === 1) {
                functionText += 'x';
            } else if (m === -1) {
                functionText += '-x';
            } else {
                functionText += m + 'x';
            }
            
            if (b > 0) {
                functionText += ' + ' + b;
            } else if (b < 0) {
                functionText += ' - ' + Math.abs(b);
            }
            
            functionDisplay.textContent = functionText;
        }

        function clearFunction() {
            currentFunction = null;
            document.getElementById('function-display').textContent = '';
        }

        // Event listeners para los checkboxes
        document.getElementById('show-lines').addEventListener('change', redrawCanvas);
        document.getElementById('show-points').addEventListener('change', redrawCanvas);

        // Event listeners para presionar Enter en los campos de entrada
        document.getElementById('x-coord').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('y-coord').focus();
            }
        });

        document.getElementById('y-coord').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addPoint();
            }
        });

        drawCartesianPlane();