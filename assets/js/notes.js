/**
 * Sistema de notas/comentarios para candados
 * Permite añadir notas privadas a cada candado
 */
class NotesManager {
    constructor() {
        this.storageKey = 'escapify_notes';
        this.notes = this.loadNotes();
    }

    loadNotes() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error cargando notas:', error);
            return {};
        }
    }

    saveNotes() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
        } catch (error) {
            console.error('Error guardando notas:', error);
        }
    }

    // Obtener nota de un candado
    getNote(lockId) {
        return this.notes[lockId] || null;
    }

    // Guardar/actualizar nota
    saveNote(lockId, note) {
        if (!lockId) return false;
        
        if (note && note.trim()) {
            this.notes[lockId] = {
                text: note.trim(),
                updatedAt: new Date().toISOString()
            };
        } else {
            delete this.notes[lockId];
        }
        
        this.saveNotes();
        return true;
    }

    // Eliminar nota
    deleteNote(lockId) {
        if (this.notes[lockId]) {
            delete this.notes[lockId];
            this.saveNotes();
            return true;
        }
        return false;
    }

    // Obtener todas las notas
    getAllNotes() {
        return { ...this.notes };
    }

    // Buscar en notas
    searchNotes(query) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        Object.entries(this.notes).forEach(([lockId, note]) => {
            if (note.text.toLowerCase().includes(searchTerm)) {
                results.push({
                    lockId,
                    note: note.text,
                    updatedAt: note.updatedAt
                });
            }
        });
        
        return results;
    }

    // Renderizar editor de notas en un contenedor
    renderNoteEditor(container, lockId, lockName = '') {
        if (!container) return;

        const currentNote = this.getNote(lockId);
        
        container.innerHTML = `
            <div class="note-editor">
                <div class="note-header">
                    <h4>Notas privadas</h4>
                    <span class="note-info">Solo tú puedes ver estas notas</span>
                </div>
                <textarea 
                    class="note-textarea" 
                    placeholder="Añade notas, recordatorios, observaciones sobre el uso de este candado..."
                    rows="4"
                >${currentNote ? this.escapeHtml(currentNote.text) : ''}</textarea>
                <div class="note-footer">
                    <span class="note-updated">${currentNote ? `Última actualización: ${new Date(currentNote.updatedAt).toLocaleString()}` : ''}</span>
                    <button class="btn btn-primary btn-sm note-save">Guardar</button>
                </div>
            </div>
        `;

        const textarea = container.querySelector('.note-textarea');
        const saveBtn = container.querySelector('.note-save');
        const updatedSpan = container.querySelector('.note-updated');

        const save = () => {
            const text = textarea.value.trim();
            if (this.saveNote(lockId, text)) {
                if (window.notificationManager) {
                    window.notificationManager.success(text ? 'Nota guardada' : 'Nota eliminada');
                }
                updatedSpan.textContent = text ? `Última actualización: ${new Date().toLocaleString()}` : '';
                document.dispatchEvent(new CustomEvent('noteUpdated', { detail: { lockId } }));
            }
        };

        saveBtn.addEventListener('click', save);
        
        // Auto-guardar después de 2 segundos sin escribir
        let saveTimeout;
        textarea.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(save, 2000);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Instancia global
window.notesManager = new NotesManager();

