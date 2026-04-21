let bubbles = [];
let seaweeds = [];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    // 將 p5 畫布置入指定的 div 中，並搭配 css 放置於背景
    canvas.parent('canvas-container');
    
    // 產生水底氣泡
    for (let i = 0; i < 60; i++) {
        bubbles.push(new Bubble());
    }
    
    // 產生海草作為生態聚落的背景裝飾
    for (let i = 0; i < windowWidth; i += 45) {
        seaweeds.push(new Seaweed(i, windowHeight));
    }
}

function draw() {
    // 繪製水底深色漸層背景
    setGradient(0, 0, width, height, color(0, 20, 40), color(0, 90, 130));
    
    // 繪製與更新氣泡
    for (let b of bubbles) {
        b.update();
        b.display();
    }
    
    // 繪製海草 (隨著水波自然搖曳)
    for (let sw of seaweeds) {
        sw.display();
    }
}

function windowResized() {
    // 確保畫面縮放時，背景也能完整覆蓋
    resizeCanvas(windowWidth, windowHeight);
}

// 漸層背景函式
function setGradient(x, y, w, h, c1, c2) {
    noFill();
    for (let i = y; i <= y + h; i++) {
        let inter = map(i, y, y + h, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x + w, i);
    }
}

// 氣泡類別
class Bubble {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(4, 15);
        this.speed = random(0.5, 2.5);
    }
    
    update() {
        this.y -= this.speed;
        // 利用 sin 函數讓氣泡呈現左右微幅搖擺上升
        this.x += sin(frameCount * 0.05 + this.y) * 0.5; 
        
        // 如果氣泡超出螢幕上方，則回到畫面最下方重新出現
        if (this.y < -this.size) {
            this.y = height + this.size;
            this.x = random(width);
        }
    }
    
    display() {
        noStroke();
        fill(255, 255, 255, 120);
        circle(this.x, this.y, this.size);
    }
}

// 海草類別
class Seaweed {
    constructor(x, y) {
        this.x = x + random(-15, 15);
        this.y = y + 20; // 稍微超出底部以隱藏底部的斷點
        this.segments = floor(random(6, 14));
        this.segmentLength = random(25, 45);
        this.offset = random(1000); // 獨立的 Perlin Noise 偏移值，讓每株海草搖擺不同步
    }
    
    display() {
        stroke(20, 150, 100, 150); 
        noFill();
        beginShape();
        for (let i = 0; i < this.segments; i++) {
            let py = this.y - i * this.segmentLength;
            // 使用 Perlin Noise 讓海草隨時間自然飄動
            let px = this.x + map(noise(this.offset + i * 0.1, frameCount * 0.005), 0, 1, -40, 40);
            
            // 越往上的區段海草越細
            strokeWeight(map(i, 0, this.segments, 12, 2));
            curveVertex(px, py);
        }
        endShape();
    }
}