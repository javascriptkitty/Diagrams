import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, mapTo, take } from "rxjs/operators";

export interface SPARQLResultsDocument {
  head: {
    vars: [string];
  };
  boolean?: boolean;
  results?: {
    bindings: [any];
  };
}

export default class SPARQLService {
  private static SPARQL_GRAPH_URL_PARAM = "?graph=";

  constructor(private http: HttpClient) {}

  executeSelect(sparqlEndpointUrl: string, query: string): Observable<SPARQLResultsDocument> {
    return this.http
      .post(sparqlEndpointUrl, query, {
        headers: {
          "Content-Type": "application/sparql-query",
          Accept: "application/json"
        }
      })
      .pipe(
        take(1),
        map((body: SPARQLResultsDocument) => body)
      );
  }

  postGraph(sparqlEndpointUrl: string, graphUri: string, payload: File): Observable<string> {
    return this.http
      .post(sparqlEndpointUrl + SPARQLService.SPARQL_GRAPH_URL_PARAM + graphUri, payload, {
        headers: { "Content-Type": "text/turtle" },
        responseType: "text"
      })
      .pipe(take(1), mapTo(graphUri));
  }

  postGraphFromString(sparqlEndpointUrl: string, graphUri: string, payload: string): Observable<string> {
    return this.http
      .post(sparqlEndpointUrl + SPARQLService.SPARQL_GRAPH_URL_PARAM + graphUri, payload, {
        headers: { "Content-Type": "text/turtle" },
        responseType: "text"
      })
      .pipe(take(1), mapTo(graphUri));
  }

  deleteGraph(sparqlEndpointUrl: string, graphUri: string): Observable<string> {
    return this.http
      .delete(sparqlEndpointUrl + SPARQLService.SPARQL_GRAPH_URL_PARAM + graphUri)
      .pipe(take(1), mapTo(graphUri));
  }
}
