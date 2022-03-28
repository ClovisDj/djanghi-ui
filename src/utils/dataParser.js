
export default class DataParser {
    #parsedData;
    constructor(rawData) {
        this.rawData = rawData;
        this.data = this.parse();
    }

    getRelationshipId = (relationshipObject) => {
        return relationshipObject.data.id;
    }

    parse = () => {
        this.#parsedData = JSON.parse(JSON.stringify(this.rawData));
        this.rawData.included.forEach((includedItem) => {
            this.rawData.data.forEach((dataObject, index) => {
                for (const [relationKey, relationshipValue] of Object.entries(dataObject.relationships)) {
                    if (includedItem.id === this.getRelationshipId(relationshipValue)) {
                        this.#parsedData.data[index].relationships[relationKey] = includedItem;
                        break;
                    }
                }
                return this.#parsedData;
            });
            return this.#parsedData;
        });
        return this.#parsedData;
    }
}

export const toTitle = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatValue = (value) => `$ ${Number(value).toFixed(2)}`;
