/**
 * Este script descarga sonidos para el candado Nokia
 * Para ejecutar: 
 * 1. Abrir terminal en la raíz del proyecto
 * 2. Ejecutar: node assets/sounds/download-sounds.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// URLs de sonidos (públicos o creative commons)
const sounds = {
    'nokia-keypress.mp3': 'https://cdn.freesound.org/previews/562/562752_7107484-lq.mp3',
    'nokia-confirm.mp3': 'https://cdn.freesound.org/previews/88/88453_1314076-lq.mp3'
};

// Directorio donde guardar los sonidos
const soundsDir = path.join(__dirname);

// Crear directorio si no existe
if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir, { recursive: true });
}

// Función para descargar un archivo
function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Error al descargar ${url}: Código ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`✅ Descargado: ${filePath}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            console.error(`❌ Error al descargar ${url}: ${err.message}`);
            reject(err);
        });
        
        file.on('error', (err) => {
            fs.unlink(filePath, () => {});
            console.error(`❌ Error al escribir el archivo ${filePath}: ${err.message}`);
            reject(err);
        });
    });
}

// Descargar todos los sonidos
async function downloadAllSounds() {
    console.log('🔊 Descargando sonidos para el candado Nokia...');
    
    try {
        const promises = Object.entries(sounds).map(([filename, url]) => {
            const filePath = path.join(soundsDir, filename);
            return downloadFile(url, filePath);
        });
        
        await Promise.all(promises);
        console.log('✨ ¡Todos los sonidos descargados con éxito!');
    } catch (error) {
        console.error('❌ Error al descargar los sonidos:', error);
    }
}

// Ejecutar descarga
downloadAllSounds(); 