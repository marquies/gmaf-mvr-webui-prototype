import config from "../config/config";

class GMAFAdapter {

    basePath = `${config.baseUrl}/`;
    apiToken = "";
    static GMAFInstance = false;

    constructor(apiToken = "") {
        this.apiToken = apiToken;
    }

    static async getInstance() {
        if (!this.GMAFInstance) {
            try {
                var gmaf = new GMAFAdapter();
                var token = await gmaf.getToken(config.appKey);

                if (typeof (token) !== "string" || token === "") {
                    throw new Error("The Token received was not a string or empty, Token: " + token);
                }
            } catch (error) {
                console.error("GMAF was not instanciated: " + error);
                return false;
            }
            gmaf.setToken(token);
            this.GMAFInstance = gmaf;
        }

        return this.GMAFInstance;
    }

    setToken(token = "") {
        this.apiToken = token;
    }

    async getToken(password = "") {
        return await this.get("gmaf/getToken/" + password, "", true);
    }

    async processAllAssets(updateStatus) {
        const results = await this.getCollectionIds(false);

        const collectionIds = results.allresults;
        if (typeof collectionIds === 'object') {
            // Only original CMMCOs are processed; entries with an origin cmmco are TCMMCOs
            const cmmcoIds = collectionIds.filter(entry => !entry.cmmco).map(entry => entry.id);

            updateStatus(0, cmmcoIds.length);
            for (let index = 0; index < cmmcoIds.length; index++) {
                await this.processAssetById(cmmcoIds[index]);
                updateStatus(index + 1, cmmcoIds.length);
            }
        }
    }

    async processAssetById(itemid = "") {
        return await this.post("gmaf/processAssetById/" + this.apiToken + "/" + itemid, "json");
    }

    async getQueryIds(query = {}) {
        const keywords = query?.cmmcoQuery?.md?.keywords || "";
        return this.post("gmaf/query/" + this.apiToken + "/" + keywords, "json");
    }

    async getSim(id = "") {
        return this.post("gmaf/getSim/" + this.apiToken + "/" + id, "json");
    }

    async query(query = {}, updateStatus) {
        const result = await this.getQueryIds(query);
        return this.lazyResults(result, updateStatus);
    }

    async similarity(id = "", updateStatus) {
        const result = await this.getSim(id);
        // getSim returns objects with id and similarity score
        const ids = result ? result.map(item => typeof item === 'object' && item.id ? item.id : item) : result;
        return this.lazyResults(ids, updateStatus);
    }

    /**
     * Wraps a list of ids so callers can fetch the minimal CMMCO data in batches.
     */
    lazyResults(queryIds, updateStatus) {
        if (!queryIds || queryIds.length === 0) {
            return { "results": [], "queryIds": [], "totalResults": 0, "fetchMinimalBatch": async () => [] };
        }

        return {
            "results": [],
            "queryIds": queryIds,
            "totalResults": queryIds.length,
            "fetchMinimalBatch": async (startIndex, batchSize) => {
                const endIndex = Math.min(startIndex + batchSize, queryIds.length);
                const batch = [];
                for (let i = startIndex; i < endIndex; i++) {
                    batch.push(await this.getCMMCOMinimal(queryIds[i]));
                    if (updateStatus) updateStatus(i + 1, queryIds.length);
                }
                return batch;
            }
        };
    }

    async getCMMCO(queryId) {
        if (!queryId) {
            console.warn("No queryId received from getCMMCO");
            return;
        }
        return await this.post(`gmaf/getmmfg/${this.apiToken}/${queryId}`, "json");
    }

    async getCMMCOMinimal(queryId) {
        if (!queryId) {
            console.warn("No queryId received from getCMMCOMinimal");
            return null;
        }

        const fullData = await this.getCMMCO(queryId);
        if (!fullData) return null;

        return {
            id: queryId,
            generalMetadata: fullData.generalMetadata,
            tempSimilarity: fullData.tempSimilarity,
            start: fullData.start,
            end: fullData.end,
            hasPd: fullData.pd && Object.keys(fullData.pd).length > 0,
            hasWsd: fullData.wsd && Object.keys(fullData.wsd).length > 0
        };
    }

    async getCollection(updateStatus) {
        const result = await this.getCollectionIds(false);
        if (!result.results) {
            console.log("No results received from Query");
            return;
        }
        const queryIds = result.results;
        updateStatus(0, queryIds.length);
        const queryResults = [];
        if (typeof queryIds === 'object') {
            for (let index = 0; index < queryIds.length; index++) {
                const cmmco = await this.getCMMCO(queryIds[index]);
                queryResults.push(cmmco);
                updateStatus(index + 1, queryIds.length);
            }
        }

        return { "results": queryResults };
    }

    async getCollectionIds(withtcmmcos = false) {
        return await this.post(`gmaf/get-collection-ids/${this.apiToken}/${withtcmmcos}`, "json");
    }

    async addItemToCollection(filename = "", base64file = "", inputoverwrite = false) {
        return await this.post("gmaf/addItem/" + this.apiToken, false, { name: filename, file: base64file, overwrite: inputoverwrite });
    }

    async deleteItemFromCollection(itemid = "") {
        return await this.post(`gmaf/deleteItem/${this.apiToken}/${itemid}`);
    }

    async get(path = "", type = "", initial = false) {
        if (!this.apiToken && !initial) {
            throw new Error("GMAF Token not set");
        }
        try {
            const response = await fetch(this.basePath + path);

            if (type === "blob") {
                return await response.blob();
            }

            if (type === "json") {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            if (error.message === "Failed to fetch") {
                console.error("GMAF Service not reachable");
            }
            console.error(error);
        }
    }

    async post(path = "", jsonResponse = false, body = {}) {
        if (!this.apiToken) {
            throw new Error("GMAF Token not set");
        }
        try {
            const response = await fetch(this.basePath + path, {
                method: 'POST',
                headers: {},
                body: JSON.stringify(body)
            }
            );

            // Check if response was successful based on status code
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (jsonResponse) {
                return await response.json();
            }

        } catch (error) {
            if (error.message === "Failed to fetch") {
                console.error("GMAF Service not reachable");
            }
            console.error(error);
        }
    }

}

export default GMAFAdapter;