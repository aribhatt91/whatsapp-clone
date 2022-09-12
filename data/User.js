class User {
    constructor({id, displayName, photoURL, email, lastSeen}) {
        if(!id || !displayName || !email) {
            throw new Error('One or more required arguments are missing: id, displayName, email');
        }
        this.#id = id;
        this.#displayName = displayName;
        this.#photoURL = photoURL || "";
        this.#email = email;
        this.#lastSeen = lastSeen || null;
    }

    get id() {
        return this.#id;
    }

    get displayName() {
        return this.#displayName;
    }

    get photoURL() {
        return this.#photoURL;
    }

    get email() {
        return this.#email;
    }

    get lastSeen() {
        return this.#lastSeen;
    }

    set lastSeen(timestamp) {
        this.#lastSeen = timestamp;
    }
}