import tokyo = require("./13.json");

// 丸の内一丁目
let originLatitude: number = 35.68151;
let originLongitude: number = 139.76699;

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

let isDragging: boolean = false;
let lastX: number = 0;
let lastY: number = 0;

canvas.onmousedown = (e) => {
    isDragging = true;
    const offsetX = canvas.getBoundingClientRect().left;
    const offsetY = canvas.getBoundingClientRect().top;

    lastX = e.clientX - offsetX;
    lastY = e.clientY - offsetY;
}

canvas.onmousemove = (e) => {
    if (isDragging){
        const offsetX = canvas.getBoundingClientRect().left;
        const offsetY = canvas.getBoundingClientRect().top;
        originLongitude += (lastX - (e.clientX - offsetX)) * 0.001;
        originLatitude += (e.clientY - offsetY - lastY) * 0.001;
        lastX = e.clientX - offsetX;
        lastY = e.clientY - offsetY;
        draw(0);
    }
}

canvas.onmouseup = () => {
    isDragging = false;
}

const draw = (time: number) => {
    if (canvas.getContext) {
        const context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (const oaza of tokyo) {
            context.beginPath();
            for (let i = 0; i + 1 < oaza.sphere.length; i += 2) {
                const y = - (oaza.sphere[i] - originLatitude) * 600 + 300;
                const x = (oaza.sphere[i+1] - originLongitude) * 600 + 500;
                if (i === 0) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }
            }
            context.closePath();
            context.stroke();
        }
        //context.fillStyle = "rgba(0, 0, 200, 0.5)";
        //context.fillRect(10, 10, 10, 10);
    }
};

const animate = (time: number) => {
    draw(time);
    //requestAnimationFrame(animate); // アニメーションする場合
};

// 開始
requestAnimationFrame(animate);
