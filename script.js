const botones = document.querySelectorAll(".boton-categoria");
console.log("botones encontrados:", botones.length);
botones.forEach((boton) => {
    boton.addEventListener("click", () => {
        const categoria = boton.dataset.categoria;
        window.location.href = `quiz.html?categoria=${categoria}`;
    });
});