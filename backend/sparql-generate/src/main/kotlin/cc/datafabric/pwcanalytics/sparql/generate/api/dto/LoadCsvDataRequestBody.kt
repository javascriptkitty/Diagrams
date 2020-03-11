package cc.datafabric.pwcanalytics.sparql.generate.api.dto

data class LoadCsvDataRequestBody(
  val csvFileName: String,
  val csvContent: String,
  val rqgFileName: String,
  val rqgContent: String
)
