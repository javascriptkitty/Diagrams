package cc.datafabric.pwcanalytics.model

data class Report(
  var _id: String? = null,
  var _rev: String? = null,

  val projectId: String,
  val generatedAt: String,
  var numberOfResults: Int = 0
)

data class GeneralReportResult(
  val _id: String? = null,
  val _rev: String? = null,

  val reportId: String,
  val diagramId: String,
  val diagramLabel: String,

  val transactionNumber: String,
  val date: String,
  val amount: Double,
  val user: String
)

data class StatisticReportResult(
  val _id: String? = null,
  val _rev: String? = null,

  val reportId: String,
  val diagramId: String,
  val diagramLabel: String,
  val statisticDiagram: Boolean = true,

  val statisticFields: Map<String, String>
)
