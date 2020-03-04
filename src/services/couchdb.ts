import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

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

export class CouchDBService {
    constructor(private http: HttpClient) {}

    connect(hostUrl: string, databaseName: string): CouchDB {
        return new CouchDB(this.http, hostUrl, databaseName);
    }
}

export class CouchDB {
    constructor(private http: HttpClient, private hostUrl: string, private databaseName: string) {}

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
    all(includeDocs = false): Observable<CouchDBAllDocumentsResponse> {
        return this.http
            .get(this.hostUrl + this.databaseName + '/_all_docs?include_docs=' + includeDocs, {
                headers: CouchDB.READ_HEADERS
            })
            .pipe(
                take(1),
                map((doc: CouchDBAllDocumentsResponse) => doc)
            );
    }

    get(id: string): Observable<CouchDBDocument> {
        return this.http.get(this.hostUrl + this.databaseName + '/' + id, { headers: CouchDB.READ_HEADERS }).pipe(
            take(1),
            map((doc: CouchDBDocument) => doc)
        );
    }

    /**
     *
     * @see http://docs.couchdb.org/en/stable/api/database/find.html#post--db-_find
     */
    findOnlyDocs(query: CouchDBFindQuery): Observable<CouchDBDocument[]> {
        return this.http
            .post(this.hostUrl + this.databaseName + '/_find', query, { headers: CouchDB.WRITE_HEADERS })
            .pipe(
                take(1),
                map((response: CouchDBFindResponse<CouchDBDocument>) => response.docs)
            );
    }

    find(query: CouchDBFindQuery): Observable<CouchDBFindResponse<CouchDBDocument>> {
        return this.http
            .post(this.hostUrl + this.databaseName + '/_find', query, { headers: CouchDB.WRITE_HEADERS })
            .pipe(
                take(1),
                map((response: CouchDBFindResponse<CouchDBDocument>) => response)
            );
    }

    save(json: { [key: string]: any }): Observable<CouchDBDocument> {
        if (CouchDB.hasValidDocumentId(json)) {
            if (!CouchDB.hasValidRevisionId(json)) {
                delete json['_rev'];
            }
        } else {
            delete json['_rev'];
            delete json['_id'];
        }

        return this.http.post(this.hostUrl + this.databaseName, json, { headers: CouchDB.WRITE_HEADERS }).pipe(
            take(1),
            map((doc: CouchDBDocumentStatusResponse) => {
                if (!doc.ok) {
                    console.error(doc);
                }

                json['_id'] = doc.id;
                json['_rev'] = doc.rev;

                return json as CouchDBDocument;
            })
        );
    }

    update(projectId: string, json: { [key: string]: any }): Observable<CouchDBDocument> {
        if (CouchDB.hasValidDocumentId(json)) {
            delete json['_id'];
        }

        return this.http
            .put(this.hostUrl + this.databaseName + '/' + projectId, json, { headers: CouchDB.WRITE_HEADERS })
            .pipe(
                take(1),
                map((doc: CouchDBDocumentStatusResponse) => {
                    if (!doc.ok) {
                        console.error(doc);
                    }

                    json['_id'] = doc.id;
                    json['_rev'] = doc.rev;

                    return json as CouchDBDocument;
                })
            );
    }

    delete(id: string, rev?: string): Observable<CouchDBDocument> {
        if (rev) {
            return this._delete(id, rev);
        } else {
            return this.get(id).pipe(mergeMap((doc: CouchDBDocument) => this._delete(doc._id, doc._rev)));
        }
    }

    private _delete(id: string, rev: string): Observable<CouchDBDocument> {
        return this.http
            .delete(this.hostUrl + this.databaseName + '/' + id + '?rev=' + rev, { headers: CouchDB.READ_HEADERS })
            .pipe(
                take(1),
                map((doc: CouchDBDocumentStatusResponse) => {
                    if (!doc.ok) {
                        console.error(doc);
                    }

                    return { _id: doc.id, _rev: doc.rev } as CouchDBDocument;
                })
            );
    }
}
