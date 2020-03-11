package cc.datafabric.pwcanalytics.model

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import org.apache.jena.query.Query
import org.apache.jena.query.QueryFactory
import org.apache.jena.query.Syntax

data class PrepareReportJobRequestBody(val projectId: String, val diagramQueries: Array<DiagramQuery>)

data class DiagramQuery(
  val diagramId: String,
  val diagramLabel: String,
  val statisticDiagram: Boolean,
  @JsonDeserialize(using = QueryDeserializer::class)
  val query: Query
)

class QueryDeserializer : StdDeserializer<Query>(Query::class.java) {

  override fun deserialize(p: JsonParser, ctxt: DeserializationContext?): Query? {
    val queryString = p.valueAsString

    return if (queryString == null) null else QueryFactory.create(queryString, Syntax.syntaxSPARQL_11)
  }

}
