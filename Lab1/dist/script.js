"use strict";
const canvas = document.getElementById('coordinateSystem');
const ctx = canvas.getContext('2d');
const displaySize = 550;
const gridSize = 25;
const scaleFactor = window.devicePixelRatio || 1;
canvas.width = displaySize * scaleFactor;
canvas.height = displaySize * scaleFactor;
canvas.style.width = displaySize + "px";
canvas.style.height = displaySize + "px";
ctx.scale(scaleFactor, scaleFactor);
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let startX = 0;
let startY = 0;
const squares = [];
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
});
canvas.addEventListener('mousemove', (e) => {
    if (!isDragging)
        return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    drawCoordinateSystem();
    drawAllShapes();
});
canvas.addEventListener('mouseup', () => {
    isDragging = false;
});
function drawCoordinateSystem() {
    ctx.clearRect(0, 0, displaySize, displaySize);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, displaySize / 2 + offsetY);
    ctx.lineTo(displaySize, displaySize / 2 + offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(displaySize / 2 + offsetX, 0);
    ctx.lineTo(displaySize / 2 + offsetX, displaySize);
    ctx.stroke();
    drawGrid();
    drawNumber();
}
function drawGrid() {
    ctx.strokeStyle = '#c0c0c082';
    ctx.lineWidth = 1;
    for (let x = -displaySize; x < displaySize * 2; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + offsetX % gridSize, 0);
        ctx.lineTo(x + offsetX % gridSize, displaySize);
        ctx.stroke();
    }
    for (let y = -displaySize; y < displaySize * 2; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + offsetY % gridSize);
        ctx.lineTo(displaySize, y + offsetY % gridSize);
        ctx.stroke();
    }
}
function drawNumber() {
    const centerX = displaySize / 2 + offsetX;
    const centerY = displaySize / 2 + offsetY;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('0', centerX - 8, centerY + 12);
    for (let x = Math.floor(-centerX / gridSize); x <= Math.ceil((displaySize - centerX) / gridSize); x++) {
        if (x === 0)
            continue;
        const canvasX = centerX + x * gridSize;
        ctx.fillText(x.toString(), canvasX, centerY + 10);
    }
    for (let y = Math.floor(-centerY / gridSize); y <= Math.ceil((displaySize - centerY) / gridSize); y++) {
        if (y === 0)
            continue;
        const canvasY = centerY + y * gridSize;
        const num = y * (-1);
        ctx.fillText(num.toString(), centerX + 10, canvasY);
    }
}
drawCoordinateSystem();
function drawAllShapes() {
    squares.forEach(square => {
        const [x1, y1] = square.points[0];
        const [x2, y2] = square.points[1];
        const color = square.color;
        drawSquare(x1, y1, x2, y2, color);
        if (square.hasCircle) {
            drawCircle(x1, y1, x2, y2);
        }
    });
}
const drawButton = document.getElementById('drawButton');
const circleButton = document.getElementById('circleButton');
const deleteButton = document.getElementById('deleteButton');
if (drawButton && circleButton && deleteButton) {
    drawButton.addEventListener('click', () => {
        const x1 = parseInt(document.getElementById('x1').value, 10);
        const y1 = parseInt(document.getElementById('y1').value, 10);
        const x2 = parseInt(document.getElementById('x2').value, 10);
        const y2 = parseInt(document.getElementById('y2').value, 10);
        const color = document.getElementById('lineColor').value;
        squares.push({
            points: [[x1, y1], [x2, y2]],
            hasCircle: false,
            color: color
        });
        drawSquare(x1, y1, x2, y2, color);
    });
    circleButton.addEventListener('click', () => {
        const lastSquare = squares[squares.length - 1];
        if (lastSquare) {
            const x1 = lastSquare.points[0][0];
            const y1 = lastSquare.points[0][1];
            const x2 = lastSquare.points[1][0];
            const y2 = lastSquare.points[1][1];
            squares[squares.length - 1].hasCircle = true;
            drawCircle(x1, y1, x2, y2);
        }
    });
    deleteButton.addEventListener('click', () => {
        ctx.strokeStyle = '#000';
        ctx.clearRect(0, 0, displaySize, displaySize);
        squares.splice(0, squares.length);
        drawCoordinateSystem();
        drawGrid();
        drawNumber();
    });
}
function drawCircle(x1, y1, x2, y2) {
    const stx1 = displaySize / 2 + x1 * gridSize + offsetX;
    const sty1 = displaySize / 2 - y1 * gridSize + offsetY;
    const stx2 = displaySize / 2 + x2 * gridSize + offsetX;
    const sty2 = displaySize / 2 - y2 * gridSize + offsetY;
    const centerX = (stx1 + stx2) / 2;
    const centerY = (sty1 + sty2) / 2;
    const radius = Math.abs(stx2 - stx1) / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "red";
    ctx.stroke();
}
function lightenColor(color, alpha = 0.5) {
    if (color.startsWith("#")) {
        color = color.replace("#", "");
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (color.startsWith("rgb")) {
        return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
    }
    return color;
}
function drawSquare(x1, y1, x2, y2, color) {
    const stx1 = displaySize / 2 + x1 * gridSize + offsetX;
    const sty1 = displaySize / 2 - y1 * gridSize + offsetY;
    const stx2 = displaySize / 2 + x2 * gridSize + offsetX;
    const sty2 = displaySize / 2 - y2 * gridSize + offsetY;
    const sizeD = Math.sqrt(Math.pow((stx2 - stx1), 2) + Math.pow((sty2 - sty1), 2));
    const sizeA = sizeD / Math.sqrt(2);
    let startX = stx1;
    let startY = sty1;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    startX += sizeA;
    ctx.lineTo(startX, startY);
    startY += sizeA;
    ctx.lineTo(startX, startY);
    startX -= sizeA;
    ctx.lineTo(startX, startY);
    startY -= sizeA;
    ctx.lineTo(startX, startY);
    ctx.closePath();
    ctx.stroke();
    const lighterColor = lightenColor(color, 0.2);
    for (let index = startY + gridSize / 2; index < startY + sizeA; index += gridSize / 2) {
        ctx.strokeStyle = lighterColor;
        ctx.beginPath();
        ctx.moveTo(startX, index);
        ctx.lineTo(startX + sizeA, index);
        ctx.stroke();
    }
    for (let index = startX + gridSize / 2; index < startX + sizeA; index += gridSize / 2) {
        ctx.strokeStyle = lighterColor;
        ctx.beginPath();
        ctx.moveTo(index, startY);
        ctx.lineTo(index, startY + sizeA);
        ctx.stroke();
    }
}
if (ctx) {
    ctx.imageSmoothingEnabled = false;
    drawCoordinateSystem();
}
else {
    console.error('Canvas context не знайдено!');
}
//# sourceMappingURL=script.js.map