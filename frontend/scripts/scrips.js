import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const input = document.getElementById("file-input");
const preview = document.querySelector(".preview");
const clearBtn = document.getElementById('clear-btn');
const sendBtn = document.getElementById('send-btn');
const info = document.querySelector('.info');

let selectedFile = null; //variable para manipular el archivo en memoria

// 1. Capturar y manipular el archivo al seeleccionarlo
input.addEventListener('change', () => {
    const file = input.files[0];

    if(!file) return;

    // selectedFile = file; //guarda la referencia en memoria
    sendBtn.disabled = false; //habilita los botones
    clearBtn.disabled = false;
    console.log(file.type);
    
    if(file.type === "application/pdf") {
        const url = URL.createObjectURL(file);
        preview.innerHTML = `<embed src="${url}"  type="application/pdf" width="100%" height="100%"/>`;
        
        parsePDF(file).then(data => {
            info.innerHTML = "Esto es lo que analizará la IA:</br></br></br>" + data;
        });

        sendBtn.style.opacity = 100;
    } else {
        preview.innerHTML = '<span style="color: red;">Formato no soportado</span>';
    }

    clearBtn.addEventListener('click',() => {
        input.value = "";
        preview.innerHTML = ''
        info.innerHTML = '';
        sendBtn.style.opacity = 0;
        clearBtn.disabled = true;
        sendBtn.disabled = true;
    });

    sendBtn.addEventListener("click", () => {
        sendBtn();
    });
});

function send() {
    fetch("/api/review", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cvText: info.innerHTML
        })
    })
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