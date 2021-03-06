import tokyo = require("./13.json");

const colors: string[] = ["#1E2B27", "#688A49", "#9FB75F", "#BAD587", "#EEEFC9"];
for (const oaza of tokyo) {
    oaza.color = colors[Math.floor(Math.random() * colors.length)];
}

// 丸の内一丁目
let originLatitude: number = 35.68151;
let originLongitude: number = 139.76699;

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

(document.getElementById("zoom-in") as HTMLButtonElement).onmouseup = () => {
    zoom *= 2;
    draw(0);
}
(document.getElementById("zoom-out") as HTMLButtonElement).onmouseup = () => {
    zoom /= 2;
    draw(0);
}

let isDragging: boolean = false;
let lastX: number = 0;
let lastY: number = 0;
let zoom: number = 600;

const startDragging = (clientX: number, clientY: number) => {
    isDragging = true;
    const offsetX = canvas.getBoundingClientRect().left;
    const offsetY = canvas.getBoundingClientRect().top;

    lastX = clientX - offsetX;
    lastY = clientY - offsetY;
};

canvas.onmousedown = (e: MouseEvent) => startDragging(e.clientX, e.clientY);

canvas.ontouchstart = (e: TouchEvent) => {
    if (e.targetTouches.length === 1) {
        // Dragging
        startDragging(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    } else {
        // Swipe
        e.preventDefault();
    }
}

const updateDrag = (clientX: number, clientY: number) => {
    const offsetX = canvas.getBoundingClientRect().left;
    const offsetY = canvas.getBoundingClientRect().top;
    originLongitude += (lastX - (clientX - offsetX)) / zoom;
    originLatitude += (clientY - offsetY - lastY) / zoom;
    lastX = clientX - offsetX;
    lastY = clientY - offsetY;
    draw(0);
}

canvas.onmousemove = (e) => {
    if (isDragging) {
        updateDrag(e.clientX, e.clientY);
    }
}

canvas.ontouchmove = (e: TouchEvent) => {
    if (isDragging) {
        updateDrag(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
    }
}

canvas.onmouseup = () => {
    isDragging = false;
}

canvas.ontouchend = () => {
    isDragging = false;
}

const draw = (time: number) => {
    if (canvas.getContext) {
        const context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
        context.fillStyle = "#AADAFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        //context.clearRect(0, 0, canvas.width, canvas.height);
        for (const oaza of tokyo) {
            context.fillStyle = oaza.color;
            context.beginPath();
            for (let i = 0; i + 1 < oaza.sphere.length; i += 2) {
                const y = - (oaza.sphere[i] - originLatitude) * zoom + 300;
                const x = (oaza.sphere[i+1] - originLongitude) * zoom + 500;
                if (i === 0) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }
            }
            context.closePath();
            context.fill();
        }
    }
};

const animate = (time: number) => {
    draw(time);
    //requestAnimationFrame(animate); // アニメーションする場合
};

// 開始
requestAnimationFrame(animate);
