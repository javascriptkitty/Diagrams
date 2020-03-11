package cc.datafabric.pwcanalytics.jena

import org.apache.jena.sparql.expr.NodeValue
import org.apache.jena.sparql.function.FunctionBase1
import org.apache.jena.sparql.function.FunctionBase2
import org.apache.jena.sparql.function.FunctionRegistry
import java.time.LocalDate

object CustomFunctionRegister {

  private const val FUNCTION_PREFIX = "http://datafabric.cc/function#"

  fun registerFunctions() {

    // function returns week day of date
    /* example query
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX pwc: <http://example.com/pwc#>
    PREFIX cf: <http://datafabric.cc/function#>

    SELECT ?at ?date ?weekDay
    WHERE {
      ?at rdf:type pwc:AccountingTransaction.
      ?at pwc:date ?date.
      BIND ((cf:DateWeekDay(?date)) as ?weekDay)
      FILTER (?weekDay IN (6, 7))
    }
    LIMIT 10
     */
    FunctionRegistry
      .get()
      .put("${FUNCTION_PREFIX}DateWeekDay") {
        object : FunctionBase1() {
          override fun exec(v: NodeValue): NodeValue {
            val date = LocalDate.of(v.dateTime.year, v.dateTime.month, v.dateTime.day)
            return NodeValue.makeInteger(
              date.dayOfWeek.value.toLong()
            )
          }
        }
      }

    // function returns remainder of dividing arguments
    /* example query
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX pwc: <http://example.com/pwc#>
    PREFIX cf: <http://datafabric.cc/function#>

    SELECT ?at ?amount ?rem
    WHERE {
      ?at rdf:type pwc:AccountingTransaction.
      ?at pwc:amount ?amount.
      BIND ((cf:DivRem(?amount, 1000000)) as ?rem)
      FILTER (?amount != 0 && ?rem = 0)
    }
    LIMIT 10
     */
    FunctionRegistry
      .get()
      .put("${FUNCTION_PREFIX}DivRem") {
        object : FunctionBase2() {
          override fun exec(v1: NodeValue, v2: NodeValue): NodeValue {
            return NodeValue.makeDecimal(
              v1.double % v2.double
            )
          }
        }
      }
  }
}
