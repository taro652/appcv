/*import * as pdfjsLib from 'pdfjs-dist';

const input = document.getElementById('file-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const preview = document.querySelector('.preview');

let selectedFile = null; //variable para manipular el archivo en memoria

// 1. Capturar y manipular el archivo al seeleccionarlo
input.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if(!file) return;

    selectedFile = file; //guarda la referencia  en memoria
    sendBtn.disabled = false; //habilita los botones
    clearBtn.disabled = false;

    //Genear preview según el tipo
    if(file.type === file.name.endsWith('.pdf')) {
        const fileURL = URL.createObjectURL(file);
        preview.innerHTML = '<iframe src="${fileURL}"></iframe>';
        console.log("wsdgfdshg");
    } else if (file.type === file.name.endsWith('.docx')) {
        preview.innerHTML = '<div class="doc-preview"> <strong>Archivo Word detectado:</strong><br> ${file.name}<br> <small>(${ (file.size / 1024).toFixed(1) } KB)</small> </div>';
    } else {
        preview.innerHTML = '<span style="color: red;">Formato no soportado</span>';
    }
    })
});

*/

const input = document.getElementById("file-input");
const preview = document.querySelector(".preview");
const clearBtn = document.getElementById('clear-btn');


input.addEventListener("change", () => {
    const file = input.files[0];

        if (!file) return;

        const url = URL.createObjectURL(file);

            preview.innerHTML = `<embed src="${url}"  type="application/pdf" width="100%" height="100%"/>`;
            console.log(file);
            console.log(file.type);
        
        clearBtn.addEventListener('click',() => {
        input.value = "";
        preview.innerHTML = ''
    })
});