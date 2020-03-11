package cc.datafabric.pwcanalytics.service

import com.cloudant.client.api.ClientBuilder
import com.cloudant.client.api.Database
import java.net.URL
import javax.annotation.PreDestroy

class CouchDBApiService(private val serverUrl: URL, private val username: String, private val password: String) {

  private val couchDb = ClientBuilder.url(serverUrl)
    .username(username)
    .password(password)
    .build()

  @PreDestroy
  fun preDestroy() {
    this.couchDb.shutdown()
  }

  fun db(databaseName: String): Database {
    return this.couchDb.database(databaseName, false)
  }

}
