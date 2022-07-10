
export default class DataParser {
    #parsedData;
    constructor(rawData) {
        this.rawData = rawData;
        this.data = this.parse() || [];
    }

    getRelationshipId = (relationshipObject) => {
        return relationshipObject.data.id;
    }

    parse = () => {
        this.#parsedData = JSON.parse(JSON.stringify(this.rawData));
        if (this.rawData.hasOwnProperty("included")) {
            this.rawData.included.forEach((includedItem) => {
                this.rawData.data.forEach((dataObject, index) => {
                    for (const [relationKey, relationshipValue] of Object.entries(dataObject.relationships)) {
                        if (includedItem.id === this.getRelationshipId(relationshipValue)) {
                            this.#parsedData.data[index].relationships[relationKey] = includedItem;
                        }
                    }
                    return this.#parsedData;
                });
                return this.#parsedData;
            });
        }
        return this.#parsedData;
    }
}

