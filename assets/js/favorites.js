/**
 * Sistema de favoritos para Escapify
 * Permite marcar candados y escape rooms como favoritos
 */
class FavoritesManager {
    constructor() {
        this.storageKey = 'escapify_favorites';
        this.favorites = this.loadFavorites();
    }

    /**
     * Carga los favoritos desde localStorage
     */
    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : { locks: [], escapes: [] };
        } catch (error) {
            console.error('Error cargando favoritos:', error);
            return { locks: [], escapes: [] };
        }
    }

    /**
     * Guarda los favoritos en localStorage
     */
    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error guardando favoritos:', error);
        }
    }

    /**
     * Añade un candado a favoritos
     */
    addLock(lockId) {
        if (!this.favorites.locks.includes(lockId)) {
            this.favorites.locks.push(lockId);
            this.saveFavorites();
            this.dispatchEvent('favorite-added', { type: 'lock', id: lockId });
            return true;
        }
        return false;
    }

    /**
     * Elimina un candado de favoritos
     */
    removeLock(lockId) {
        const index = this.favorites.locks.indexOf(lockId);
        if (index > -1) {
            this.favorites.locks.splice(index, 1);
            this.saveFavorites();
            this.dispatchEvent('favorite-removed', { type: 'lock', id: lockId });
            return true;
        }
        return false;
    }

    /**
     * Añade un escape room a favoritos
     */
    addEscape(escapeId) {
        if (!this.favorites.escapes.includes(escapeId)) {
            this.favorites.escapes.push(escapeId);
            this.saveFavorites();
            this.dispatchEvent('favorite-added', { type: 'escape', id: escapeId });
            return true;
        }
        return false;
    }

    /**
     * Elimina un escape room de favoritos
     */
    removeEscape(escapeId) {
        const index = this.favorites.escapes.indexOf(escapeId);
        if (index > -1) {
            this.favorites.escapes.splice(index, 1);
            this.saveFavorites();
            this.dispatchEvent('favorite-removed', { type: 'escape', id: escapeId });
            return true;
        }
        return false;
    }

    /**
     * Verifica si un candado es favorito
     */
    isLockFavorite(lockId) {
        return this.favorites.locks.includes(lockId);
    }

    /**
     * Verifica si un escape room es favorito
     */
    isEscapeFavorite(escapeId) {
        return this.favorites.escapes.includes(escapeId);
    }

    /**
     * Toggle favorito para un candado
     */
    toggleLock(lockId) {
        if (this.isLockFavorite(lockId)) {
            return this.removeLock(lockId);
        } else {
            return this.addLock(lockId);
        }
    }

    /**
     * Toggle favorito para un escape room
     */
    toggleEscape(escapeId) {
        if (this.isEscapeFavorite(escapeId)) {
            return this.removeEscape(escapeId);
        } else {
            return this.addEscape(escapeId);
        }
    }

    /**
     * Obtiene todos los favoritos
     */
    getAll() {
        return {
            locks: [...this.favorites.locks],
            escapes: [...this.favorites.escapes]
        };
    }

    /**
     * Obtiene solo los candados favoritos
     */
    getFavoriteLocks() {
        return [...this.favorites.locks];
    }

    /**
     * Obtiene solo los escape rooms favoritos
     */
    getFavoriteEscapes() {
        return [...this.favorites.escapes];
    }

    /**
     * Limpia todos los favoritos
     */
    clear() {
        this.favorites = { locks: [], escapes: [] };
        this.saveFavorites();
        this.dispatchEvent('favorites-cleared', {});
    }

    /**
     * Dispara un evento personalizado
     */
    dispatchEvent(name, detail) {
        const event = new CustomEvent(name, { detail });
        document.dispatchEvent(event);
    }
}

// Instancia global
window.favoritesManager = new FavoritesManager();

