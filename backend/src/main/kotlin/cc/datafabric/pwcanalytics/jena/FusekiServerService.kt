package cc.datafabric.pwcanalytics.jena

import cc.datafabric.pwcanalytics.AppConfig
import org.aeonbits.owner.ConfigFactory
import org.apache.jena.query.Dataset
import org.apache.jena.tdb.TDB
import org.apache.jena.tdb.TDBFactory
import org.slf4j.LoggerFactory
import javax.annotation.PreDestroy
import org.apache.jena.fuseki.main.FusekiServer

class FusekiServerService() {

  companion object {
    private val LOG = LoggerFactory.getLogger(FusekiServerService::class.java)
    private val CONFIG = ConfigFactory.create(AppConfig::class.java, System.getProperties(), System.getenv())
  }

  private val datasetDirectory = CONFIG.tdbDataSetDirectoryLocation();
  private val dataset: Dataset
  private val fusekiServer: FusekiServer

  init {
    dataset = TDBFactory.createDataset(datasetDirectory)
    dataset.context.set(TDB.symUnionDefaultGraph, true)

    fusekiServer = FusekiServer.create()
      .port(CONFIG.sparqlServerPort())
      .add("/ds", dataset)
      .build()

  }

  @PreDestroy
  fun preDestroy() {
    stop()
  }

  fun start() {
    fusekiServer.start()
    CustomFunctionRegister.registerFunctions()
    LOG.info("Fuseki Server started")
  }

  fun stop() {
    fusekiServer.stop()
    LOG.info("Fuseki Server stopped")
  }

}
