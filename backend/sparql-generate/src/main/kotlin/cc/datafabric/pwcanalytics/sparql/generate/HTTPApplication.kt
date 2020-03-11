package cc.datafabric.pwcanalytics.sparql.generate

import cc.datafabric.pwcanalytics.sparql.generate.service.SparqlGenerateService
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
  }

  init {
    packages("cc.datafabric.pwcanalytics.sparql.generate.api")

    register(Binder())
    register(JacksonFeature::class.java)
    register(ContextResolver {
      ObjectMapper()
        .registerModule(KotlinModule())
    })
  }

  class Binder : AbstractBinder() {
    override fun configure() {
      bindAsContract(SparqlGenerateService::class.java).`in`(Singleton::class.java)
    }
  }

}
