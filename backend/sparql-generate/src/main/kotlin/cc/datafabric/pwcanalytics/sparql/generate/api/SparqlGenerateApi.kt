package cc.datafabric.pwcanalytics.sparql.generate.api

import cc.datafabric.pwcanalytics.sparql.generate.api.dto.LoadCsvDataRequestBody
import cc.datafabric.pwcanalytics.sparql.generate.api.dto.LoadCsvDataResponse
import cc.datafabric.pwcanalytics.sparql.generate.service.SparqlGenerateService
import javax.inject.Inject
import javax.ws.rs.Consumes
import javax.ws.rs.GET
import javax.ws.rs.POST
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response


@Path("sparqlGenerate")
class SparqlGenerateApi @Inject constructor(
  private val sparqlGenerateService: SparqlGenerateService
) {

  companion object {
  }

  @Path("status")
  @GET
  fun status(): Response {
    return Response.ok().build()
  }


  @Path("loadCsvData")
  @POST
  @Consumes(APPLICATION_JSON)
  @Produces(APPLICATION_JSON)
  fun loadCsvData(body: LoadCsvDataRequestBody): Response {
    val resultTtl = sparqlGenerateService.generate(body.csvFileName, body.csvContent, body.rqgFileName, body.rqgContent)
    return Response.ok(LoadCsvDataResponse(resultTtl)).build()
//    return Response.ok().build()
  }

}
