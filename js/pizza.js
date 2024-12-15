import {
  paprikaImage,
  ananasImage,
  tomatoSauceImage,
  salmonImage,
} from "./pizzaImages.js";

export function initPizzaConfigurator() {
  const canvas = document.getElementById("pizzaCanvas");
  const ctx = canvas.getContext("2d");
  const sliceCount = 8; // Anzahl der Pizza-Slices
  const sliceAngle = (Math.PI * 2) / sliceCount;

  // Arrays, um die Positionen der Zutaten zu speichern
  let paprikaPositions = [];
  let ananasPositions = [];
  let SalmonPositions = [];

  tomatoSauceImage.onload = () => {
    ctx.drawImage(tomatoSauceImage, 20, 20, 360, 360);
  };


  document.querySelectorAll(".ingredient").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked && checkbox.dataset.name === "Paprika") {
        addIngredientPieces(12, paprikaPositions, paprikaImage);
      } else if (!checkbox.checked && checkbox.dataset.name === "Paprika") {
        paprikaPositions = []; // Paprikastücke löschen
        redrawPizza();
      }
      if (checkbox.checked && checkbox.dataset.name === "Ananas") {
        addIngredientPieces(12, ananasPositions, ananasImage);
      } else if (!checkbox.checked && checkbox.dataset.name === "Ananas") {
        ananasPositions = [];
        redrawPizza();
      }
      if (checkbox.checked && checkbox.dataset.name === "Salmon") {
        addIngredientPieces(12, SalmonPositions, salmonImage);
      } else if (!checkbox.checked && checkbox.dataset.name === "Salmon") {
        SalmonPositions = [];
        redrawPizza();
      }
    });
  });

  //Platzierung der Pizza Stückchen
  function addIngredientPieces(count, positions, image) {
    const centerX = 200;
    const centerY = 200;
    const radius = 150;
    const imageRadius = 25; // Halbe Bildgröße
    const effectiveRadius = radius - imageRadius;
    const minDistance = 50; // Mindestabstand zwischen Zutaten

    for (let i = 0; i < count; i++) {
      let validPosition = false;
      let x, y;

      while (!validPosition) {
        const angle = Math.random() * Math.PI * 2; // Zufälliger Winkel
        const distance = Math.sqrt(Math.random()) * effectiveRadius; // Gleichmäßige Verteilung
        x = centerX + Math.cos(angle) * distance - imageRadius;
        y = centerY + Math.sin(angle) * distance - imageRadius;

        // Prüfen, ob die neue Position gültig ist
        validPosition = isPositionValid({ x, y }, positions, minDistance);
      }

      // Gültige Position hinzufügen
      positions.push({ x, y });
    }

    // Zutaten zeichnen
    positions.forEach((pos) => {
      ctx.drawImage(image, pos.x, pos.y, 50, 50);
    });
  }

  function isPositionValid(newPos, positions, minDistance) {
    return positions.every(
      (pos) =>
        Math.sqrt((pos.x - newPos.x) ** 2 + (pos.y - newPos.y) ** 2) >
        minDistance
    );
  } 

  // Funktion zum Zeichnen der Pizza
  function redrawPizza() {
    // Canvas löschen, um alte Inhalte zu entfernen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pizza-Rand (Kreis mit Canvas wird erstellt)
    ctx.beginPath();
    ctx.arc(200, 200, 160, 0, Math.PI * 2);
    ctx.fillStyle = "#d19b6b"; // Randfarbe
    ctx.fill();

    // Innenbereich der Pizza
    ctx.beginPath();
    ctx.arc(200, 200, 150, 0, Math.PI * 2);
    ctx.fillStyle = "#f2d28c"; // Käsefarbe
    ctx.fill();

    ctx.drawImage(tomatoSauceImage, 20, 20, 360, 360);

    addIngredientPieces(0, paprikaPositions, paprikaImage);
    addIngredientPieces(0, ananasPositions, ananasImage);
    addIngredientPieces(0, SalmonPositions, salmonImage);
  }

  // Zeichne die Pizza beim Start
  redrawPizza();


}
