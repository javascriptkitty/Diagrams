package cc.datafabric.pwcanalytics

import cc.datafabric.pwcanalytics.jena.FusekiServerService
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
      .port(9998)
      .build()
    val server = JettyHttpContainerFactory.createServer(baseUri, HTTPApplication())

    server.stopAtShutdown = true

    val fusekiServer = FusekiServerService()

    try {
      fusekiServer.start()
      server.start()
      server.join()
    } finally {
      fusekiServer.stop()
      server.stop()
      server.destroy()
    }
  }

}
