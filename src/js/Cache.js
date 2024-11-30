class Cache {
    constructor() {
        if (Cache.instance) {
            // Return the existing instance if it already exists
            return Cache.instance;
        }

        // Otherwise, initialize a new instance
        this.cmmcosCache = {};

        // Store the instance in a static property
        Cache.instance = this;

        console.log('Cache instance created.');
    }

    // Add or update a cmmcos object in the cache
    addCmmcos(id, cmmcosObject) {
        this.cmmcosCache[id] = cmmcosObject;
        console.log(`Added/Updated cmmcos with ID: ${id}`);
    }

    // Retrieve a cmmcos object by ID
    getCmmcos(id) {
        const cmmcosObject = this.cmmcosCache[id];
        if (cmmcosObject) {
            console.log(`Retrieved cmmcos with ID: ${id}`, cmmcosObject);
            return cmmcosObject;
        } else {
            console.log(`No cmmcos found with ID: ${id}`);
            return null;
        }
    }

    // Remove a cmmcos object by ID
    removeCmmcos(id) {
        if (this.cmmcosCache[id]) {
            delete this.cmmcosCache[id];
            console.log(`Removed cmmcos with ID: ${id}`);
        } else {
            console.log(`No cmmcos found with ID: ${id} to remove`);
        }
    }

    // Get the entire cache
    getCache() {
        console.log('Current Cache:', this.cmmcosCache);
        return this.cmmcosCache;
    }

    // Static method to get the singleton instance
    static getInstance() {
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance;
    }
}

export default Cache;