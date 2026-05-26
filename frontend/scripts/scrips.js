import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'; 

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const input = document.getElementById("file-input");
const preview = document.querySelector(".preview");
const clearBtn = document.getElementById('clear-btn');
const sendBtn = document.getElementById('send-btn');
const info = document.querySelector('.info');

let txtParaLaIa = '';

// 1. Capturar y manipular el archivo al seeleccionarlo
input.addEventListener('change', async () => {
    const file = input.files[0];

    if(!file) return;

    if(file.type === "application/pdf") {
        const url = URL.createObjectURL(file);
        preview.innerHTML = `<embed src="${url}"  type="application/pdf" width="100%" height="100%"/>`;

        info.innerHTML = "Procesando texto del PDF..."; // <--- Avisás al usuario

        txtParaLaIa = await parsePDF(file);
        
        info.innerHTML = "PDF procesado listo para enviar."; // <--- Avisás que terminó
        
        sendBtn.disabled = false; //habilita los botones
        clearBtn.disabled = false;
        clearBtn.style.opacity = 1;
        sendBtn.style.opacity = 1;
    } else {
        preview.innerHTML = '<span style="color: red;">Formato no soportado</span>';
    }


});

clearBtn.addEventListener('click',() => {
    input.value = "";
    preview.innerHTML = ''
    info.innerHTML = '';
    clearBtn.style.opacity = 0;
    sendBtn.style.opacity = 0;
    clearBtn.disabled = true;
    sendBtn.disabled = true;
});

sendBtn.addEventListener("click", () => {
    info.innerHTML = 'PDF enviado. Por favor, espere';
    enviarAlBackend(txtParaLaIa);
    sendBtn.disabled = true;
});

async function enviarAlBackend(cv) {
    try {
        const respuesta = await fetch('https://appcv-g3l8.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Le avisamos al backend que enviamos JSON
            },
            body: JSON.stringify({ variableTexto: cv }) // Convertimos la variable a texto JSON
        });

        const resultado = await respuesta.json();
        // Respuesta del backend:
        //console.log(resultado.devolucion);
        info.innerHTML = resultado.devolucion;
        
    } catch (error) {
        console.error("Error en la comunicación:", error);
    }
}

async function parsePDF(file) {
    const arrayBuffer = await file.arrayBuffer()

    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
    }).promise

    let text = ""

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)

        const content = await page.getTextContent()

        const strings = content.items.map(item => item.str)

        text += strings.join(" ")
    }


    text = text.replace(
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        "[EMAIL]"
    )

    text = text.replace(
        /\+?\d[\d\s\-()]{7,}/g,
        "[TELEFONO]"
    )

    text = text.replace(
        /https?:\/\/(www\.)?linkedin\.com\/\S+/gi,
        "[LINKEDIN]"
    )

    return text
}