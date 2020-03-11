package cc.datafabric.pwcanalytics.service

import cc.datafabric.jena.ISPARQLExecutor
import cc.datafabric.pwcanalytics.AppConfig
import cc.datafabric.pwcanalytics.model.DiagramQuery
import cc.datafabric.pwcanalytics.model.Report
import cc.datafabric.pwcanalytics.model.GeneralReportResult
import cc.datafabric.pwcanalytics.model.StatisticReportResult
import org.aeonbits.owner.ConfigFactory
import org.apache.jena.query.Query
import org.apache.jena.query.QueryFactory
import org.apache.jena.query.Syntax
import org.apache.jena.shared.impl.PrefixMappingImpl
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.Executors
import java.util.concurrent.Future
import javax.annotation.PreDestroy
import javax.inject.Inject
import kotlin.collections.HashMap

class PrepareReportJobExecutorService @Inject constructor(
  private val sparqlService: ISPARQLExecutor,
  private val couchDbService: CouchDBApiService
) {

  companion object {
    private const val QUERY_ACCOUNTING_TRANSACTION = """
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX pwc: <http://example.com/pwc#>

      SELECT ?transactionNumber ?date ?amount ?user {
        {
          {{subQuery}}
        }

        ?uri pwc:id ?transactionNumber ;
          pwc:amount ?amount ;
          pwc:date ?date ;
          pwc:createdBy/pwc:name ?user .
      }
    """

    private val CONFIG = ConfigFactory.create(AppConfig::class.java, System.getProperties(), System.getenv())
  }

  private val executor = Executors.newFixedThreadPool(2)
  private val jobs = mutableMapOf<String, Future<*>>()

  @PreDestroy
  fun preDestroy() {
    this.executor.shutdown()
  }

  fun alreadyScheduled(projectId: String): Boolean {
    val future = this.jobs[projectId]

    return if (future == null) false
    else {
      if (future.isDone) {
        this.jobs.remove(projectId)
      }

      this.jobs.containsKey(projectId)
    }
  }

  fun cancel(projectId: String) {
    this.jobs[projectId]?.cancel(true)
  }

  fun schedule(projectId: String, diagramQueries: Array<DiagramQuery>) {
    this.jobs[projectId] = this.executor.submit(PrepareReportJob(
      couchDbService, sparqlService, projectId, diagramQueries
    ))
  }

  private class PrepareReportJob(
    val couchDbService: CouchDBApiService,
    val sparqlService: ISPARQLExecutor,
    val projectId: String,
    val diagramQueries: Array<DiagramQuery>
  ) : Runnable {

    companion object {
      private val LOG = LoggerFactory.getLogger(PrepareReportJob::class.java)
    }

    override fun run() {
      try {
        LOG.info("Started the prepare report job for $projectId. Number of queries: ${diagramQueries.size}...")

        val report = Report(
          projectId = projectId,
          generatedAt = DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(LocalDateTime.now())
        )
        val response = couchDbService.db(CONFIG.databaseReports()).save(report)

        report._id = response.id
        report._rev = response.rev

        var countResults = 0;

        diagramQueries.forEach {
          val results = if (it.statisticDiagram) {
            executeForStatisticReport(report._id!!, it)
          } else {
            executeForGeneralReport(report._id!!, it)
          }

          LOG.info("Number of report results ${results.size}")

          countResults += results.size

          couchDbService.db(CONFIG.databaseReportResults()).bulk(results)
        }

        report.numberOfResults = countResults
        couchDbService.db(CONFIG.databaseReports()).update(report)

        LOG.info("Finished the prepare report job for $projectId")
      } catch (ex: Throwable) {
        LOG.error(ex.message, ex)
      }
    }

    private fun executeForGeneralReport(reportId: String, diagramQuery: DiagramQuery): List<GeneralReportResult> {
      val query = wrapInAsSubQuery(QUERY_ACCOUNTING_TRANSACTION, diagramQuery.query)
      appendGraphUriToQuery(query)

      return sparqlService.executeSelectAsQuerySolution(query)
        .map {
          GeneralReportResult(null, null, reportId,
            diagramQuery.diagramId, diagramQuery.diagramLabel,
            it.getLiteral("transactionNumber").string,
            it.getLiteral("date").string,
            it.getLiteral("amount").double,
            it.getLiteral("user").string
          )
        }
        .blockingIterable().toList()
    }

    private fun executeForStatisticReport(reportId: String, diagramQuery: DiagramQuery): List<StatisticReportResult> {
      val query = diagramQuery.query
      appendGraphUriToQuery(query)

      return sparqlService.executeSelectAsQuerySolution(query)
        .map {
          val statisticFields = HashMap<String, String>()
          for (varName in it.varNames()) {
            statisticFields[varName] = it.getLiteral(varName).string
          }
          StatisticReportResult(null, null, reportId,
            diagramQuery.diagramId, diagramQuery.diagramLabel, true, statisticFields
          )
        }
        .blockingIterable().toList()
    }

    private fun wrapInAsSubQuery(wrapperQuery: String, subQuery: Query): Query {
      // Empty the prefix mapping to make the subquery embeddable
      val prefixMapping = subQuery.prefixMapping
      subQuery.prefixMapping = PrefixMappingImpl()

      subQuery.isDistinct = true

      val query = QueryFactory.create(
        wrapperQuery.replaceFirst("{{subQuery}}", subQuery.toString(Syntax.syntaxSPARQL_11), true)
      )

      query.prefixMapping = prefixMapping

      return query
    }

    private fun appendGraphUriToQuery(query: Query) {
      query.addGraphURI("urn:couchdb:id:$projectId")
    }
  }

}
