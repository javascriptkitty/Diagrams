package cc.datafabric.pwcanalytics.sparql.generate.service

import fr.emse.ci.sparqlext.SPARQLExt
import fr.emse.ci.sparqlext.engine.PlanFactory
import fr.emse.ci.sparqlext.engine.RootPlan
import fr.emse.ci.sparqlext.query.SPARQLExtQuery
import fr.emse.ci.sparqlext.stream.SPARQLExtStreamManager
import org.slf4j.LoggerFactory
import fr.emse.ci.sparqlext.stream.LocationMapperAccept
import fr.emse.ci.sparqlext.stream.LocatorFileAccept
import fr.emse.ci.sparqlext.stream.LookUpRequest
import org.apache.commons.io.IOUtils
import org.apache.jena.query.Dataset
import org.apache.jena.query.DatasetFactory
import org.apache.jena.query.QueryFactory
import org.apache.jena.riot.Lang
import org.apache.jena.riot.RDFDataMgr
import org.apache.jena.riot.RDFLanguages
import org.apache.log4j.Level
import java.io.*
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Paths


class SparqlGenerateService {

  companion object {
    private val LOG = LoggerFactory.getLogger(SparqlGenerateService::class.java)
    private val DOCUMENT_URI_BASE = "http://example.com/resource/"
    private val DOCUMENT_MEDIATYPE = "text/csv"
    private val ROOT_LOGGER = org.apache.log4j.Logger.getRootLogger()
  }

  private val tempDir: File

  init {
    ROOT_LOGGER.level = Level.toLevel("INFO", Level.INFO)
    tempDir = Paths.get("temp/").toFile()
  }

  fun generate(csvFileName: String, csvContent: String, rqgFileName: String, rqgContent: String): String {
    var result = ""
    val tempCsvFile = File(tempDir.path + "/" + csvFileName)
    val tempRqgFile = File(tempDir.path + "/" + rqgFileName)
    val tempTtlOutputFile = File(tempDir.path + "/tempoutput.ttl")

    try {
      tempCsvFile.createNewFile()
      var bw = BufferedWriter(FileWriter(tempCsvFile))
      bw.write(csvContent)
      bw.close()

      tempRqgFile.createNewFile()
      bw = BufferedWriter(FileWriter(tempRqgFile))
      bw.write(rqgContent)
      bw.close()

      tempTtlOutputFile.createNewFile()
      bw = BufferedWriter(FileWriter(tempTtlOutputFile))
      bw.close()

      val generateResult = generate(tempCsvFile, tempRqgFile, tempTtlOutputFile)
      if (generateResult) {
        result = tempTtlOutputFile.readText()
      }

      tempCsvFile.delete()
      tempRqgFile.delete()
      tempTtlOutputFile.delete()

    } catch(ex: IOException) {
      LOG.error("Error while creating temp file.", ex)
    }

    return result
  }

  fun generate(csvFile: File, rqgFile: File, outputFile: File): Boolean {
    LOG.info("Starts sparql generation: csvFile = {}, rqgFile = {}, outputFile = {}", csvFile, rqgFile, outputFile)

    val sm = getStreamManager(csvFile, rqgFile)
    val ds = loadDataset(outputFile)
    val q = getQuery(rqgFile.path, sm)
    val context = SPARQLExt.createContext(q, sm)

    val plan: RootPlan
    try {
      plan = PlanFactory.create(q)
    } catch (ex: Exception) {
      LOG.error("Error while creating the plan for the query.", ex)
      return false
    }

    val lang = RDFLanguages.nameToLang(RDFLanguages.strLangTurtle)
    try {
      val model = plan.execGenerate(ds, context)
      val fileOutputStream = FileOutputStream(outputFile)
      model.write(fileOutputStream, lang.label)
      fileOutputStream.close()
    } catch (ex: Exception) {
      LOG.error("Error while executing the plan.", ex)
      return false
    }

    LOG.info("Sparql generation success!")
    return true
  }

  private fun getStreamManager(csvFile: File, rqgFile: File): SPARQLExtStreamManager {
    val rqgFileDir = rqgFile.absolutePath.substring(0, rqgFile.absolutePath.lastIndexOf(File.separator));
    val rqgFileDirPath = Paths.get(rqgFileDir)
    val locator = LocatorFileAccept(rqgFileDir)
    val mapper = LocationMapperAccept()
    val sm = SPARQLExtStreamManager.makeStreamManager(locator)
    sm.setLocationMapper(mapper)

    val csvFileName = csvFile.name;
    val req = LookUpRequest(
      DOCUMENT_URI_BASE + csvFileName,
      DOCUMENT_MEDIATYPE
    )
    val alt = LookUpRequest(csvFile.path)
    mapper.addAltEntry(req, alt)

    try {
      Files.walk(rqgFileDirPath)
        .filter { p -> p.toFile().isFile }
        .forEach { p ->
          val relativePath = rqgFileDirPath.relativize(p).toString()
          val url = DOCUMENT_URI_BASE + relativePath.replace("\\", "/")
          mapper.addAltEntry(url, p.toString())
        }
    } catch (ex: IOException) {
      LOG.warn("Error while computing the URIs for the files in the working directory.", ex)
    }

    return sm
  }

  private fun getQuery(queryPath: String, sm: SPARQLExtStreamManager): SPARQLExtQuery {
    val query: String
    try {
      query = IOUtils.toString(
        sm.open(LookUpRequest(queryPath, SPARQLExt.MEDIA_TYPE)), StandardCharsets.UTF_8.name()
      )
    } catch (ex: IOException) {
      throw RuntimeException(
        String.format("No file named %s was found in the directory that contains the query to be executed.", queryPath),
        ex
      )
    } catch (ex: NullPointerException) {
      throw RuntimeException(
        String.format("No file named %s was found in the directory that contains the query to be executed.", queryPath),
        ex
      )
    }

    try {
      val q = QueryFactory.create(query,
        DOCUMENT_URI_BASE, SPARQLExt.SYNTAX) as SPARQLExtQuery
      q.baseURI = q.baseURI
      return q
    } catch (ex: Exception) {
      throw RuntimeException("Error while parsing the query to be executed.", ex)
    }
  }

  private fun loadDataset(outputFile: File): Dataset {
    val ds = DatasetFactory.create()
    ds.defaultModel = RDFDataMgr.loadModel(outputFile.toString(), Lang.TTL)
    return ds
  }


}
