import axios from "axios";
export interface SPARQLResultsDocument {
  head: {
    vars: [string];
  };
  boolean?: boolean;
  results?: {
    bindings: [any];
  };
}

function fixUrl(sparqlEndpointUrl) {
  return sparqlEndpointUrl;
  // sparqlEndpointUrl = sparqlEndpointUrl.replace("/sparql", "");
  // return `${baseUrl}${sparqlEndpointUrl}`;
}
//const baseUrl = "http://130.211.58.252:3030/ds/";

class SPARQLService {
  private static SPARQL_GRAPH_URL_PARAM = "?graph=";

  executeSelect(sparqlEndpointUrl: string, query: string): Promise<SPARQLResultsDocument> {
    return axios
      .post(fixUrl(sparqlEndpointUrl), query, {
        headers: {
          "Content-Type": "application/sparql-query",
          Accept: "text/plain"
        }
      })
      .then(res => res.data);
  }

  postGraph(sparqlEndpointUrl: string, graphUri: string, payload: File): Promise<string> {
    return axios
      .post(fixUrl(sparqlEndpointUrl + SPARQLService.SPARQL_GRAPH_URL_PARAM + graphUri), payload, {
        headers: { "Content-Type": "text/turtle", Accept: "text/plain" }
      })
      .then(() => graphUri);
  }

  postGraphFromString(sparqlEndpointUrl: string, graphUri: string, payload: string): Promise<string> {
    return axios
      .post(fixUrl(sparqlEndpointUrl + SPARQLService.SPARQL_GRAPH_URL_PARAM + graphUri), payload, {
        headers: { "Content-Type": "text/turtle", Accept: "text/plain" }
      })
      .then(() => graphUri);
  }

  deleteGraph(sparqlEndpointUrl: string, graphUri: string): Promise<string> {
    return axios
      .delete(fixUrl(sparqlEndpointUrl + SPARQLService.SPARQL_GRAPH_URL_PARAM + graphUri))
      .then(() => graphUri);
  }
}

export default new SPARQLService();
