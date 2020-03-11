package cc.datafabric.pwcanalytics.api

import cc.datafabric.pwcanalytics.model.PrepareReportJobRequestBody
import cc.datafabric.pwcanalytics.service.PrepareReportJobExecutorService
import java.util.concurrent.locks.ReentrantLock
import javax.inject.Inject
import javax.ws.rs.Consumes
import javax.ws.rs.DELETE
import javax.ws.rs.GET
import javax.ws.rs.POST
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.QueryParam
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response
import kotlin.concurrent.withLock

data class JobStatus(val scheduled: Boolean)

@Path("prepareReportJob")
class PrepareReportJobApi @Inject constructor(
  private val prepareReportService: PrepareReportJobExecutorService
) {

  companion object {
    private val GLOBAL_LOCK = ReentrantLock()
  }

  @GET
  @Produces(APPLICATION_JSON)
  fun alreadyScheduled(@QueryParam("projectId") projectId: String): Response {
    GLOBAL_LOCK.withLock {
      val status = if (this.prepareReportService.alreadyScheduled(projectId)) {
        JobStatus(true)
      } else {
        JobStatus(false)
      }

      return Response.ok(status).build()
    }
  }

  @POST
  @Consumes(APPLICATION_JSON)
  @Produces(APPLICATION_JSON)
  fun schedule(body: PrepareReportJobRequestBody): Response {
    GLOBAL_LOCK.withLock {
      if (!this.prepareReportService.alreadyScheduled(body.projectId)) {
        this.prepareReportService.schedule(body.projectId, body.diagramQueries)
      }

      return Response.ok(JobStatus(true)).build()
    }
  }

  @DELETE
  fun cancel(@QueryParam("projectId") projectId: String): Response {
    this.prepareReportService.cancel(projectId)

    return Response.ok().build()
  }

}
