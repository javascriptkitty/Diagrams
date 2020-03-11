package cc.datafabric.pwcanalytics

import cc.datafabric.jena.DefaultSPARQLExecutor
import cc.datafabric.jena.ISPARQLExecutor
import cc.datafabric.jena.UncaughtExceptionMapper
import cc.datafabric.pwcanalytics.service.CouchDBApiService
import cc.datafabric.pwcanalytics.service.PrepareReportJobExecutorService
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.aeonbits.owner.ConfigFactory
import org.glassfish.hk2.utilities.binding.AbstractBinder
import org.glassfish.jersey.jackson.JacksonFeature
import org.glassfish.jersey.server.ResourceConfig
import javax.inject.Singleton
import javax.ws.rs.ApplicationPath
import javax.ws.rs.ext.ContextResolver

@ApplicationPath("")
class HTTPApplication : ResourceConfig() {

  companion object {
    private val CONFIG = ConfigFactory.create(AppConfig::class.java, System.getProperties(), System.getenv())
  }

  init {
    packages("cc.datafabric.pwcanalytics.api")

    register(Binder())
    register(JacksonFeature::class.java)
    register(ContextResolver {
      ObjectMapper()
        .registerModule(KotlinModule())
    })
    register(UncaughtExceptionMapper::class.java)
  }

  class Binder : AbstractBinder() {
    override fun configure() {
      bindAsContract(PrepareReportJobExecutorService::class.java).`in`(Singleton::class.java)

      bind(CouchDBApiService(CONFIG.couchDbUrl(), CONFIG.couchDbUsername(), CONFIG.couchDbPassword()))
      bind(DefaultSPARQLExecutor(CONFIG.sparqlReadOnlyUrl(), CONFIG.sparqlWriteOnlyUrl()))
        .to(ISPARQLExecutor::class.java)
    }

  }

}
