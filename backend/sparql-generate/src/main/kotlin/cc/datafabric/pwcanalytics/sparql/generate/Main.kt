package cc.datafabric.pwcanalytics.sparql.generate

import org.apache.jena.query.ARQ
import org.glassfish.jersey.jetty.JettyHttpContainerFactory
import javax.ws.rs.core.UriBuilder

object Main {

  init {
    ARQ.init()
  }

  @JvmStatic
  fun main(args: Array<String>) {
    val baseUri = UriBuilder
      .fromUri("http://0.0.0.0/")
      .port(19998)
      .build()
    val server = JettyHttpContainerFactory.createServer(baseUri, HTTPApplication())

    server.stopAtShutdown = true

    try {
      server.start()
      server.join()
    } finally {
      server.stop()
      server.destroy()
    }
  }

}
