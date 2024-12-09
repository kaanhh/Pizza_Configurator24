export function initPizzaConfigurator() {
    console.log("Pizza-Konfigurator gestartet!");

    const canvas = document.getElementById('pizzaCanvas');
    const ctx = canvas.getContext('2d');
    
    const sliceCount = 8; // Anzahl der Pizza-Slices
    const sliceAngle = (Math.PI * 2) / sliceCount;

    // Funktion zum Zeichnen der Pizza
    function redrawPizza() {
        // Pizza-Rand
        ctx.beginPath();
        ctx.arc(200, 200, 160, 0, Math.PI * 2);
        ctx.fillStyle = '#d19b6b'; // Randfarbe
        ctx.fill();

        // Innenbereich der Pizza
        ctx.beginPath();
        ctx.arc(200, 200, 150, 0, Math.PI * 2);
        ctx.fillStyle = '#f2d28c'; // Käsefarbe
        ctx.fill();

        // Slices
        for (let i = 0; i < sliceCount; i++) {
            const startAngle = i * sliceAngle;
            const endAngle = startAngle + sliceAngle;

            ctx.moveTo(200, 200);
            ctx.arc(200, 200, 150, startAngle, endAngle);
            ctx.strokeStyle = '#d19b6b'; // Randfarbe
            ctx.stroke();
        }
    }

    // Funktion, um ein Slice hervorzuheben
    function drawHighlightedSlice(sliceIndex) {
        redrawPizza(); // Setzt die Pizza zurück

        const startAngle = sliceIndex * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 150, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = '#ffe680'; // Hervorhebungsfarbe
        ctx.fill();
    }

    // Mausbewegung überwachen
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const centerX = 200;
        const centerY = 200;
        const radius = 150;

        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const correctedAngle = (angle + Math.PI * 2) % (Math.PI * 2);

        if (distance <= radius) {
            const sliceIndex = Math.floor(correctedAngle / sliceAngle);
            drawHighlightedSlice(sliceIndex);
        } else {
            redrawPizza(); // Setzt die Pizza zurück, wenn Maus außerhalb ist
        }
    });

    // Zeichne die Pizza beim Start
    redrawPizza();
}
