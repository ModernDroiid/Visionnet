// ---------------------------------
// SLIDER con BUCLE REAL + transiciones suaves
// ---------------------------------

const track = document.querySelector(".carousel-track");
let items = Array.from(document.querySelectorAll(".carousel-item"));
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
const dotsContainer = document.querySelector(".carousel-dots");

let index = 1; // porque el primer elemento visible será un clon
let autoTimer = null;
const AUTO_MS = 16000;

// --------------------------
// CLONAR PARA BUCLE INFINITO
// --------------------------
const firstClone = items[0].cloneNode(true);
const lastClone = items[items.length - 1].cloneNode(true);

firstClone.classList.add("clone");
lastClone.classList.add("clone");

track.appendChild(firstClone);
track.insertBefore(lastClone, items[0]);

items = Array.from(document.querySelectorAll(".carousel-item"));
const total = items.length;

// --------------------------
// CREAR DOTS (solo para los reales)
// --------------------------
for (let i = 0; i < total - 2; i++) {
    const dot = document.createElement("div");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
        index = i + 1;    // +1 por el clon
        updateSlider(true);
        resetAuto();
    });

    dotsContainer.appendChild(dot);
}
const dots = Array.from(document.querySelectorAll(".carousel-dot"));


// --------------------------
// ACTUALIZAR SLIDER
// --------------------------
function updateSlider(smooth = true) {
    const container = track.parentElement;
    const containerCenter = container.offsetWidth / 2;

    const center = index;
    const left = index - 1;
    const right = index + 1;

    items.forEach((el) => {
        el.classList.remove("active", "left", "right");
        el.style.transition = smooth ? "transform .55s ease" : "none";
    });

    if (items[center]) items[center].classList.add("active");
    if (items[left]) items[left].classList.add("left");
    if (items[right]) items[right].classList.add("right");

    const rectTrack = track.getBoundingClientRect();
    const rectItem = items[center].getBoundingClientRect();

    const itemCenterRel = (rectItem.left - rectTrack.left) + (rectItem.width / 2);
    const translateX = containerCenter - itemCenterRel;

    track.style.transition = smooth ? "transform .55s ease" : "none";
    track.style.transform = `translateX(${translateX}px)`;

    // Actualizar dots (solo elementos reales)
    dots.forEach((d, i) => {
        d.classList.toggle("active", i === center - 1);
    });

    // -----------------------------
    // ⭐ CENTRAR FLECHAS VERTICALMENTE
    // -----------------------------
    const itemHeight = rectItem.height;
    const containerRect = container.getBoundingClientRect();

    // flechas centradas respecto a la ALTURA de las imágenes
    const centerY = (containerRect.top + itemHeight / 2) - containerRect.top;

    prevBtn.style.top = centerY + "px";
    nextBtn.style.top = centerY + "px";
}


// --------------------------
// BOTONES
// --------------------------
nextBtn.addEventListener("click", () => {
    index++;
    updateSlider();
    checkLoop();
    resetAuto();
});

prevBtn.addEventListener("click", () => {
    index--;
    updateSlider();
    checkLoop();
    resetAuto();
});


// --------------------------
// CONTROL DEL BUCLE REAL
// --------------------------
function checkLoop() {
    setTimeout(() => {
        if (items[index].classList.contains("clone")) {
            if (index === total - 1) {
                index = 1; // salta al real
            } else if (index === 0) {
                index = total - 2;
            }
            updateSlider(false);
        }
    }, 560);
}


// --------------------------
// AUTO SLIDER
// --------------------------
function startAuto() {
    autoTimer = setInterval(() => {
        index++;
        updateSlider();
        checkLoop();
    }, AUTO_MS);
}

function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
}

// INIT
window.addEventListener("load", () => {
    updateSlider(false);
    startAuto();
});

window.addEventListener("resize", () => updateSlider(false));

