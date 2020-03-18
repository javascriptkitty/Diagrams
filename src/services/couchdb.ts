import axios from 'axios';

export interface CouchDBDocument {
    _id: string;
    _rev: string;
}

export interface CouchDBAllDocumentsResponse {
    offset: number;
    rows: [
        {
            id: string;
            key: string;
            value: {
                rev: string;
            };
            doc?: CouchDBDocument;
        }
    ];
    total_rows: number;
}

export interface CouchDBFindQuery {
    selector: object;
    limit?: number;
    skip?: number;
    sort?: [string] | [object];
    fields?: object;
    use_index?: string | [];
    r?: number;
    bookmark?: string;
    update?: boolean;
    stable?: boolean;
    stale?: string;
}

export interface CouchDBFindResponse<T extends CouchDBDocument> {
    docs: T[];
    warning?: string;
    execution_states?: {
        total_keys_examined: number;
        total_docs_examined: number;
        total_quorum_docs_examined: number;
        results_returned: number;
        execution_time_ms: number;
    };
    bookmark?: string;
}

declare interface CouchDBDocumentStatusResponse {
    id: string;
    ok: boolean;
    rev: string;
}

class CouchDBService {
    connect(hostUrl: string, databaseName: string): CouchDB {
        return new CouchDB(hostUrl, databaseName);
    }
}

export default new CouchDBService();

export class CouchDB {
    constructor(private hostUrl: string, private databaseName: string) {}

    private static READ_HEADERS = {
        Accept: 'application/json'
    };
    private static WRITE_HEADERS = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };

    private static hasValidDocumentId(json: { [key: string]: any }): boolean {
        return json.hasOwnProperty('_id') && json['_id'];
    }

    private static hasValidRevisionId(json: { [key: string]: any }): boolean {
        return json.hasOwnProperty('_rev') && json['_rev'];
    }

    /**
     *
     * @param includeDocs
     */
    all(includeDocs = false): Promise<CouchDBAllDocumentsResponse> {
        return axios
            .get(this.hostUrl + this.databaseName + '/_all_docs?include_docs=' + includeDocs, {
                headers: CouchDB.READ_HEADERS
            })
            .then(res => res.data);
    }

    get(id: string): Promise<CouchDBDocument> {
        return axios
            .get(this.hostUrl + this.databaseName + '/' + id, { headers: CouchDB.READ_HEADERS })
            .then(res => res.data);
    }

    /**
     *
     * @see http://docs.couchdb.org/en/stable/api/database/find.html#post--db-_find
     */
    findOnlyDocs(query: CouchDBFindQuery): Promise<CouchDBDocument[]> {
        return axios
            .post(this.hostUrl + this.databaseName + '/_find', query, { headers: CouchDB.WRITE_HEADERS })
            .then(res => res.data.docs);
    }

    find(query: CouchDBFindQuery): Promise<CouchDBFindResponse<CouchDBDocument>> {
        return axios
            .post(this.hostUrl + this.databaseName + '/_find', query, { headers: CouchDB.WRITE_HEADERS })
            .then(res => res.data.docs);
    }

    save(json: { [key: string]: any }): Promise<CouchDBDocument> {
        if (CouchDB.hasValidDocumentId(json)) {
            if (!CouchDB.hasValidRevisionId(json)) {
                delete json['_rev'];
            }
        } else {
            delete json['_rev'];
            delete json['_id'];
        }

        return axios
            .post(this.hostUrl + this.databaseName, json, { headers: CouchDB.WRITE_HEADERS })
            .then(res => {
                const doc = res.data;
                json['_id'] = doc.id;
                json['_rev'] = doc.rev;

                return json as CouchDBDocument;
            })
            .catch(error => {
                return {} as CouchDBDocument;
            });
    }

    update(projectId: string, json: { [key: string]: any }): Promise<CouchDBDocument> {
        if (CouchDB.hasValidDocumentId(json)) {
            delete json['_id'];
        }

        return axios
            .put(this.hostUrl + this.databaseName + '/' + projectId, json, { headers: CouchDB.WRITE_HEADERS })

            .then(res => {
                const doc = res.data;
                json['_id'] = doc.id;
                json['_rev'] = doc.rev;

                return json as CouchDBDocument;
            })
            .catch(error => {
                return {} as CouchDBDocument;
            });
    }

    delete(id: string, rev?: string): Promise<CouchDBDocument> {
        if (rev) {
            return this._delete(id, rev);
        } else {
            return this.get(id).then((doc: CouchDBDocument) => this._delete(doc._id, doc._rev));
        }
    }

    private _delete(id: string, rev: string): Promise<CouchDBDocument> {
        return axios
            .delete(this.hostUrl + this.databaseName + '/' + id + '?rev=' + rev, { headers: CouchDB.READ_HEADERS })
            .then(res => {
                const doc = res.data;
                return { _id: doc.id, _rev: doc.rev } as CouchDBDocument;
            })
            .catch(error => {
                return {} as CouchDBDocument;
            });
    }
}
