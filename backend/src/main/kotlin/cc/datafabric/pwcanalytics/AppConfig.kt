package cc.datafabric.pwcanalytics

import org.aeonbits.owner.Config
import java.net.URL

interface AppConfig : Config {
  @Config.Key("SPARQL_PORT")
  @Config.DefaultValue("3030")
  fun sparqlServerPort(): Int

  @Config.Key("SPARQL_URL")
  @Config.DefaultValue("http://localhost:3030/ds/sparql")
  fun sparqlReadOnlyUrl(): String

  @Config.Key("SPARQL_WRITE_URL")
  @Config.DefaultValue("http://localhost:3030/ds/update")
  fun sparqlWriteOnlyUrl(): String

  @Config.Key("TDB_DATASET_DIRECTORY")
  @Config.DefaultValue("tdb-dataset")
  fun tdbDataSetDirectoryLocation(): String


  @Config.Key("COUCHDB_URL")
  @Config.DefaultValue("http://pwc-demo-1:5984")
  fun couchDbUrl(): URL

  @Config.Key("COUCHDB_USERNAME")
  @Config.DefaultValue("admin")
  fun couchDbUsername(): String

  @Config.Key("COUCHDB_PASSWORD")
  @Config.DefaultValue("pass")
  fun couchDbPassword(): String

  @Config.Key("DATABASE_REPORTS")
  @Config.DefaultValue("pwc-reports")
  fun databaseReports(): String

  @Config.Key("DATABASE_REPORTRESULTS")
  @Config.DefaultValue("pwc-reportresults")
  fun databaseReportResults(): String
}
