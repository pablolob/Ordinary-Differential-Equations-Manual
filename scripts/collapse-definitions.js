document.addEventListener("DOMContentLoaded", function() {

  // Lista de tipos de bloques a convertir con sus títulos por defecto
  const blockConfig = {
    "example": "Ejemplo",
    "conjecture": "Conjetura",
    "proof": "Demostración",
    "solution": "Solución",
    "remark": "Observación"
  };

  // Selecciona todos los tipos en una sola query
  document.querySelectorAll(Object.keys(blockConfig).map(t => "div." + t).join(","))
    .forEach(function(block) {

      // 🔹 Determinar si debe procesarse
      const requiresMakeCollapse = block.classList.contains("solution") || 
                                    block.classList.contains("remark") || 
                                    block.classList.contains("conjecture");
      const collapsableByDefault = block.classList.contains("example") || 
                                    block.classList.contains("proof");

      // solution, remark, conjecture: solo procesar si tiene make-collapse
      if (requiresMakeCollapse && !block.classList.contains("make-collapse")) {
        return;
      }

      // example, proof: NO procesar si tiene make-uncollapse
      if (collapsableByDefault && block.classList.contains("make-uncollapse")) {
        return;
      }

      // === Determinar título ======================
      const customTitle = block.getAttribute("data-title");
      
      // Determinar el tipo de bloque de forma explícita y robusta
      let blockType = "";
      if (block.classList.contains("solution")) blockType = "solution";
      else if (block.classList.contains("remark")) blockType = "remark";
      else if (block.classList.contains("example")) blockType = "example";
      else if (block.classList.contains("proof")) blockType = "proof";
      else if (block.classList.contains("conjecture")) blockType = "conjecture";
      
      const defaultTitle = blockConfig[blockType];
      const finalTitle = customTitle || defaultTitle;

      // === Crear elementos details y summary ======================
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.innerHTML = `<strong>${finalTitle}</strong>`;

      // === Control de apertura/cierre ======================
      const isExplicitlyOpen =
        block.classList.contains("collapse-false") ||
        block.classList.contains("open");

      if (isExplicitlyOpen) {
        details.setAttribute("open", "true");
      }

      // Quitar solo el título generado por Quarto; el párrafo puede contener la solución.
      block.querySelector(":scope > p:first-child > .proof-title, :scope > p:first-child > .theorem-title")?.remove();

      // === Mover todo el contenido al details ======================
      while (block.firstChild) {
        details.appendChild(block.firstChild);
      }

      block.appendChild(details);
      details.prepend(summary);

    });

});
// cool top
