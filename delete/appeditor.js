// app.js
document.addEventListener('DOMContentLoaded', function () {
	// Validar formulario antes de guardar
	document.querySelector('button[type=submit], button:contains("Validar")').onclick = function (e) {
	  let nombre = document.querySelector('input[aria-label="Nombre"]').value.trim();
	  if (!nombre) {
		alert("El nombre del candado es obligatorio.");
		e.preventDefault();
	  }
	};
  
	// Añadir código extra de desbloqueo
	document.querySelector('button:contains("Añadir un nuevo código")')?.addEventListener('click', function () {
	  let entrada = document.createElement('input');
	  entrada.type = "text";
	  entrada.placeholder = "Código extra";
	  document.querySelector('.candado-crear').appendChild(entrada);
	});
  
	// Selector tipo de candado
	document.querySelector('select').onchange = function (e) {
	  // Muestra u oculta campos dependiendo el tipo seleccionado
	  // (Lógica particular para tipo seleccionados)
	  // Ejemplo: mostrar campo "colores" si es de tipo "A color"
	  // ...
	};
  
	// Mostrar confeti y sonido
	document.querySelector('input[aria-label="Mostrar confeti en caso de éxito"]')?.addEventListener('change', function (e) {
	  if (this.checked) {
		// Reemplaza por función real de confeti
		console.log('🎉 Confeti activado');
	  }
	});
  });
  
  // editor.js
  // Simulación de editor enriquecido muy básico
  function applyFormat(format) {
	let textarea = document.querySelector('textarea');
	let start = textarea.selectionStart;
	let end = textarea.selectionEnd;
	let selected = textarea.value.slice(start, end);
	let before = textarea.value.slice(0, start), after = textarea.value.slice(end);
  
	if (format === "bold") {
	  textarea.value = before + "**" + selected + "**" + after;
	} else if (format === "italic") {
	  textarea.value = before + "*" + selected + "*" + after;
	}
  }
  
  document.querySelector('.editor-toolbar button[data-format="bold"]')?.addEventListener('click', function() {
	applyFormat("bold");
  });
  document.querySelector('.editor-toolbar button[data-format="italic"]')?.addEventListener('click', function() {
	applyFormat("italic");
  });
  