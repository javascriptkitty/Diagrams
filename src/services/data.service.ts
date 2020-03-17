// import {
//   Project,
//   Report,
//   GeneralReportResult,
//   StatisticReportResult,
//   StatisticReportResultConverter
// } from "../models/project";
import {
  ClassifierEntityQuery,
  ClassifierRelationQuery,
  ClassifierRestriction,
  ClassifierRestrictionParameter,
  ClassifierValueQuery,
  Diagram,
  DiagramInfo,
  OntologyEntity,
  OntologyRelation,
  AggregateRestriction,
  VisualQuery,
  VisualQueryType
} from "../models";

// import { AppToastService } from "./app-toast.service";

import { CouchDB, CouchDBAllDocumentsResponse, CouchDBDocument } from "./couchdb";
import CouchDBService from "./couchdb";
import Json2TypescriptService from "./json2typescript";
import { SPARQLResultsDocument } from "./sparql";
import SPARQLService from "./sparql";

interface DiagramInfoClass {
  new (props: any): DiagramInfo;
}

class DataService {
  private static COUCHDB_URL = "/couchdb/";

  //   private static COUCHDB_DB_PROJECTS = "pwc-projects";
  private static COUCHDB_DB_DIAGRAM_INFOS = "pwc-diagraminfos";
  private static COUCHDB_DB_DIAGRAMS = "pwc-diagrams";
  private static COUCHDB_DB_REPORTS = "pwc-reports";
  private static COUCHDB_DB_REPORT_RESULTS = "pwc-reportresults";

  private static TRIPLESTORE_URL = "/sparql";

  private static DATAMODEL_GRAPH_URI = "urn:pwc:datamodel";

  private static QUERY_DATAMODEL_EXISTS = `
    ASK {
        GRAPH <urn:pwc:datamodel> { ?x ?y ?z }
    }
  `;
  private static QUERY_ALL_ENTITIES = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>

    SELECT ?uri ?label ?comment
    FROM <urn:pwc:datamodel>
    {
        { ?uri a rdfs:Class }
        UNION
        { ?uri a owl:Class }
        ?uri rdfs:label ?label .
        OPTIONAL { ?uri rdfs:comment ?comment }
    }
  `;
  private static QUERY_ALL_RELATIONS = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?uri ?label ?type ?range ?comment
    FROM <urn:pwc:datamodel>
    {
      {
        ?uri a owl:DatatypeProperty ;
               rdfs:range ?range .

        BIND("datatype" AS ?type)
      }
      UNION
      {
        ?uri a owl:ObjectProperty .

        BIND(xsd:anyURI AS ?range)
        BIND("object" AS ?type)
      }

      ?uri rdfs:label ?label .

      OPTIONAL { ?uri rdfs:comment ?comment }
    }
  `;

  private static QUERY_ALL_AGR_PROPERTIES = `
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX pwc: <http://example.com/pwc#>

  SELECT ?uri ?label ?range
  FROM <urn:pwc:datamodel>
  {

    {
      ?uri a pwc:ObjectAgrProperty ;
       rdfs:range ?range .

    }
    ?uri rdfs:label ?label .

  }
`;

  private couchDBService;
  private j2tService;
  private sparqlService;

  private readonly projectDB: CouchDB;
  private readonly diagramInfoDB: CouchDB;
  private readonly diagramDB: CouchDB;
  private readonly reportsDB: CouchDB;
  private readonly reportResultsDB: CouchDB;
  //   private readonly statisticReportResultConverter: StatisticReportResultConverter;

  private isInstantiated = false;

  constructor() {
    this.couchDBService = CouchDBService;
    this.j2tService = Json2TypescriptService;
    this.sparqlService = SPARQLService;
    if (!this.isInstantiated) {
      this.diagramInfoDB = this.couchDBService.connect(DataService.COUCHDB_URL, DataService.COUCHDB_DB_DIAGRAM_INFOS);
      this.diagramDB = this.couchDBService.connect(DataService.COUCHDB_URL, DataService.COUCHDB_DB_DIAGRAMS);
      this.reportsDB = this.couchDBService.connect(DataService.COUCHDB_URL, DataService.COUCHDB_DB_REPORTS);
      this.reportResultsDB = this.couchDBService.connect(
        DataService.COUCHDB_URL,
        DataService.COUCHDB_DB_REPORT_RESULTS
      );

      this.isInstantiated = true;
      //   this.statisticReportResultConverter = new StatisticReportResultConverter();
    }
  }

  //   ngOnDestroy(): void {}

  dataModelExists(): Promise<boolean> {
    return this.sparqlService
      .executeSelect(DataService.TRIPLESTORE_URL, DataService.QUERY_DATAMODEL_EXISTS)
      .then(body => body.boolean)
      .catch(this.onError);
  }

  onError(err: any) {
    console.log(err);
    return err;
  }

  uploadDataModel(dataModel: File): Promise<any> {
    return this.sparqlService
      .postGraph(DataService.TRIPLESTORE_URL, DataService.DATAMODEL_GRAPH_URI, dataModel)
      .catch(err => this.onError(err));
  }

  //   uploadProjectDataFile(project: Project, data: File): Promise<any> {
  //     return this.sparqlService
  //       .postGraph(
  //         DataService.TRIPLESTORE_URL,
  //         project.getDataModelGraphUri(),
  //         data
  //       )
  //       .pipe(
  //
  //         catchError(err => {
  //           return this._onError(err);
  //         })
  //       );
  //   }

  //   uploadProjectDataString(
  //     project: Project,
  //     data: string,
  //     graphUri: string
  //   ): Promise<any> {
  //     return this.sparqlService
  //       .postGraphFromString(DataService.TRIPLESTORE_URL, graphUri, data)
  //       .pipe(
  //
  //         catchError(err => {
  //           return this._onError(err);
  //         })
  //       );
  //   }

  //   getProjects(): Promise<Project[]> {
  //     return this.projectDB.all(true).pipe(
  //       map((response: CouchDBAllDocumentsResponse) =>
  //         response.rows.map(row =>
  //           this.j2tService.deserializeObject(row.doc, Project)
  //         )
  //       ),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   getProject(id: string): Promise<Project> {
  //     const project$ = this.projectDB
  //       .get(id)
  //       .pipe(map(doc => this.j2tService.deserializeObject(doc, Project)));
  //     const indicators$ = this.getProjectDiagramInfos(id, [
  //       VisualQueryType.INDICATOR
  //     ]);
  //     const classifiers$ = this.getProjectDiagramInfos(id, [
  //       VisualQueryType.ENTITY_CLASSIFIER,
  //       VisualQueryType.RELATION_CLASSIFIER,
  //       VisualQueryType.VALUE_CLASSIFIER
  //     ]);

  //     return combineLatest([project$, indicators$, classifiers$]).pipe(
  //       map(results => {
  //         const project = results[0] as Project;

  //         project.indicators = results[1];
  //         project.classifiers = results[2];

  //         return project;
  //       }),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   createProject(
  //     name: string,
  //     description: string,
  //     data: File
  //   ): Promise<Project> {
  //     return this.projectDB.save(new Project(name, description)).pipe(
  //       map((doc: CouchDBDocument) =>
  //         this.j2tService.converter().deserializeObject(doc, Project)
  //       ),
  //       mergeMap(project =>
  //         this.sparqlService
  //           .postGraph(
  //             DataService.TRIPLESTORE_URL,
  //             project.getDataModelGraphUri(),
  //             data
  //           )
  //           .pipe(mapTo(project))
  //       ),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   updateProject(project: Project): Promise<Project> {
  //     project.modifiedAt = new Date().toISOString();

  //     return this.projectDB
  //       .update(project._id, project)
  //       .pipe(catchError(err => this._onError(err)));
  //   }

  //   deleteProject(id: string): Promise<CouchDBDocument> {
  //     return this.getProject(id).pipe(
  //       mergeMap((doc: CouchDBDocument) => {
  //         const project = Object.assign(new Project(), doc);
  //         const deletes$ = [];

  //         project.indicators.forEach(
  //           diagram => deletes$.push(this.deleteDiagram(diagram._id)),
  //           this
  //         );
  //         project.classifiers.forEach(
  //           diagram => deletes$.push(this.deleteDiagram(diagram._id)),
  //           this
  //         );

  //         deletes$.push(this.projectDB.delete(id));
  //         deletes$.push(
  //           this.sparqlService.deleteGraph(
  //             DataService.TRIPLESTORE_URL,
  //             project.getDataModelGraphUri()
  //           )
  //         );

  //         return forkJoin(deletes$).pipe(mapTo(() => project));
  //       }),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   /**
  //    *
  //    * @param projectId if null then the indicator is shared, otherwise is project-based
  //    */
  createDiagram(type: VisualQueryType, label: string, description?: string, projectId?: string): Promise<DiagramInfo> {
    const libraryDiagram = projectId == null;

    return this.diagramInfoDB
      .save(new DiagramInfo(type, label, description, projectId, libraryDiagram))
      .then(diagramInfo => {
        switch (type) {
          case VisualQueryType.INDICATOR:
            return this.diagramDB.save(new Diagram(diagramInfo._id)).then((res: any) => {
              res.type = type;
              res.label = "label";
              this.j2tService.deserializeObject(res, DiagramInfo as DiagramInfoClass);
            });
          case VisualQueryType.ENTITY_CLASSIFIER:
            return this.diagramDB
              .save(new ClassifierEntityQuery(diagramInfo._id))
              .then(res => this.j2tService.deserializeObject(res, DiagramInfo as DiagramInfoClass));
          case VisualQueryType.RELATION_CLASSIFIER:
            return this.diagramDB
              .save(new ClassifierRelationQuery(diagramInfo._id))
              .then(res => this.j2tService.deserializeObject(res, DiagramInfo as DiagramInfoClass));
          case VisualQueryType.VALUE_CLASSIFIER:
            return this.diagramDB
              .save(new ClassifierValueQuery(diagramInfo._id))
              .then(res => this.j2tService.deserializeObject(res, DiagramInfo as DiagramInfoClass));
        }
      })
      .catch(this.onError);
  }

  //   copyDiagramToProject(
  //     diagramInfo: DiagramInfo,
  //     projectId: string
  //   ): Promise<DiagramInfo> {
  //     return this.diagramInfoDB
  //       .save(
  //         new DiagramInfo(
  //           diagramInfo.type,
  //           diagramInfo.label,
  //           diagramInfo.description,
  //           projectId
  //         )
  //       )
  //       .pipe(
  //         map(diagramInfoCopy => {
  //           let diagramCopy: Promise<VisualQuery>;
  //           switch (diagramInfo.type) {
  //             case VisualQueryType.INDICATOR:
  //               diagramCopy = this.getDiagram(diagramInfo._id).pipe(
  //                 map(
  //                   diagram =>
  //                     new Diagram(
  //                       diagramInfoCopy._id,
  //                       diagram.entities,
  //                       diagram.values,
  //                       diagram.relations,
  //                       diagram.expression
  //                     )
  //                 )
  //               );
  //               break;
  //             case VisualQueryType.ENTITY_CLASSIFIER:
  //               diagramCopy = this.getVisualQuery<ClassifierEntityQuery>(
  //                 diagramInfo._id
  //               ).pipe(
  //                 map(
  //                   classifier =>
  //                     new ClassifierEntityQuery(
  //                       diagramInfoCopy._id,
  //                       classifier.sparqlQuery
  //                     )
  //                 )
  //               );
  //               break;
  //             case VisualQueryType.RELATION_CLASSIFIER:
  //               diagramCopy = this.getVisualQuery<ClassifierRelationQuery>(
  //                 diagramInfo._id
  //               ).pipe(
  //                 map(
  //                   classifier =>
  //                     new ClassifierRelationQuery(
  //                       diagramInfoCopy._id,
  //                       classifier.sparqlQuery
  //                     )
  //                 )
  //               );
  //               break;
  //             case VisualQueryType.VALUE_CLASSIFIER:
  //               diagramCopy = this.getVisualQuery<ClassifierValueQuery>(
  //                 diagramInfo._id
  //               ).pipe(
  //                 map(
  //                   classifier =>
  //                     new ClassifierValueQuery(
  //                       diagramInfoCopy._id,
  //                       classifier.restriction,
  //                       classifier.datatype,
  //                       classifier.inputParameters
  //                     )
  //                 )
  //               );
  //               break;
  //           }
  //           let newDiagram = diagramCopy.subscribe(v =>
  //             this.diagramDB.save(v).subscribe()
  //           );
  //           return diagramInfoCopy;
  //         }),
  //         mapTo(diagramInfoCopy =>
  //           this.j2tService.deserializeObject(diagramInfoCopy, DiagramInfo)
  //         ),
  //         catchError(err => this._onError(err))
  //       );
  //   }

  //   getDiagram(id: string): Promise<Diagram> {
  //     return this.diagramDB.get(id).pipe(
  //       map(doc => this.j2tService.deserializeObject(doc, Diagram)),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  getVisualQueries<T extends VisualQuery>(ids: string[]): Promise<T[]> {
    return this.diagramDB
      .findOnlyDocs({
        selector: {
          _id: { $in: ids }
        }
      })
      .then(docs => docs.map((doc: T) => VisualQuery.convertToSubClass<T>(doc)))
      .catch(this.onError);
  }

  //   getVisualQuery<T extends VisualQuery>(id: string): Promise<T> {
  //     return this.diagramDB.get(id).pipe(
  //       map((doc: T) => VisualQuery.convertToSubClass<T>(doc)),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   getDiagramClassifierRelationQuery(
  //     diagram: Diagram
  //   ): Promise<ClassifierRelationQuery[]> {
  //     let classifierRelationIds = diagram.relations
  //       .map(v => v.restriction)
  //       .filter(v => v instanceof ClassifierRestriction)
  //       .map(v => v as ClassifierRestriction)
  //       .map(v => v.id);

  //     return this.diagramDB
  //       .findOnlyDocs({
  //         selector: {
  //           _id: { $in: classifierRelationIds }
  //         }
  //       })
  //       .pipe(
  //         map(docs =>
  //           this.j2tService
  //             .converter()
  //             .deserializeArray(docs, ClassifierRelationQuery)
  //         )
  //       );
  //   }

  //   getDiagramClassifierEntityQuery(
  //     diagram: Diagram
  //   ): Promise<ClassifierEntityQuery[]> {
  //     let classifierEntityIds = diagram.entities
  //       .filter(v => v.classifierRestriction != null)
  //       .map(v => v.classifierRestriction)
  //       .map(v => v.id);

  //     return this.diagramDB
  //       .findOnlyDocs({
  //         selector: {
  //           _id: { $in: classifierEntityIds }
  //         }
  //       })
  //       .pipe(
  //         map(docs =>
  //           this.j2tService
  //             .converter()
  //             .deserializeArray(docs, ClassifierEntityQuery)
  //         )
  //       );
  //   }

  private getClassifierRestrictions(classifierInfos: DiagramInfo[]): Promise<ClassifierRestriction[]> {
    return this.getVisualQueries(classifierInfos.map(i => i._id)).then(classifiers => {
      let classifiersMap = {};
      classifiers.forEach(d => (classifiersMap[d._id] = d));
      return classifierInfos.map(info => {
        let diagram = classifiersMap[info._id] as VisualQuery;
        let inputParameters = null;
        if (diagram != null) {
          inputParameters = diagram.inputParameters.map(
            v => new ClassifierRestrictionParameter(v.name, v.datatype, v.defaultValue)
          );
        }
        return new ClassifierRestriction(info._id, info.label, inputParameters);
      });
    });
  }

  //   getValueClassifiers(
  //     projectId: string,
  //     datatype: string
  //   ): Promise<ClassifierRestriction[]> {
  //     return this.getProjectDiagramInfos(projectId, [
  //       VisualQueryType.VALUE_CLASSIFIER
  //     ]).pipe(
  //       mergeMap((infos: DiagramInfo[]) => this.getClassifierRestrictions(infos)),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   getRelationClassifiers(
  //     projectId: string
  //   ): Promise<ClassifierRestriction[]> {
  //     return this.getProjectDiagramInfos(projectId, [
  //       VisualQueryType.RELATION_CLASSIFIER
  //     ]).pipe(
  //       mergeMap((infos: DiagramInfo[]) => this.getClassifierRestrictions(infos)),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   getEntityClassifiers(projectId: string): Promise<ClassifierRestriction[]> {
  //     return this.getProjectDiagramInfos(projectId, [
  //       VisualQueryType.ENTITY_CLASSIFIER
  //     ]).pipe(
  //       mergeMap((infos: DiagramInfo[]) => this.getClassifierRestrictions(infos)),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   getClassifierRestriction(id: string): Promise<ClassifierRestriction> {
  //     return this.getDiagramInfo(id).pipe(
  //       mergeMap((info: DiagramInfo) =>
  //         this.getVisualQuery(id).pipe(
  //           map(
  //             (diagram: Diagram) =>
  //               new ClassifierRestriction(
  //                 info._id,
  //                 info.label,
  //                 diagram.inputParameters.map(
  //                   v =>
  //                     new ClassifierRestrictionParameter(
  //                       v.name,
  //                       v.datatype,
  //                       v.defaultValue
  //                     )
  //                 )
  //               )
  //           )
  //         )
  //       ),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   getDiagramInfo(id: string): Promise<DiagramInfo> {
  //     return this.diagramInfoDB.get(id).pipe(
  //       map(doc =>
  //         this.j2tService.converter().deserializeObject(doc, DiagramInfo)
  //       ),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   saveDiagram<T extends VisualQuery>(diagram: T): Promise<T> {
  //     return this.diagramDB.save(diagram).pipe(
  //       map((doc: T) => VisualQuery.convertToSubClass<T>(doc)),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  //   deleteDiagram(id: string): Promise<string> {
  //     const a$ = this.diagramDB.delete(id);
  //     const b$ = this.diagramInfoDB.delete(id);

  //     return combineLatest([a$, b$]).pipe(
  //       mapTo(() => id),
  //       catchError(err => this._onError(err))
  //     );
  //   }

  getOntologyEntities(): Promise<OntologyEntity[]> {
    return this.sparqlService
      .executeSelect(DataService.TRIPLESTORE_URL, DataService.QUERY_ALL_ENTITIES)
      .then((body: SPARQLResultsDocument) => {
        if (body.results.bindings.length > 0) {
          return body.results.bindings.map(binding => {
            const entity = new OntologyEntity();
            entity.uri = binding.uri.value;
            entity.label = binding.label.value;
            if (binding.comment) {
              entity.description = binding.comment.value;
            }
            return entity;
          });
        } else {
          return [];
        }
      })
      .catch(err => this.onError(err));
  }

  getOntologyRelations(): Promise<OntologyRelation[]> {
    return this.sparqlService
      .executeSelect(DataService.TRIPLESTORE_URL, DataService.QUERY_ALL_RELATIONS)
      .then((body: SPARQLResultsDocument) => {
        if (body.results.bindings.length > 0) {
          return body.results.bindings.map(binding => {
            const relation = new OntologyRelation();
            relation.uri = binding.uri.value;
            relation.label = binding.label.value;
            relation.isDatatypeProperty = binding.type.value === "datatype";
            relation.isObjectProperty = binding.type.value === "object";
            if (binding.comment) {
              relation.description = binding.comment.value;
            }
            relation.rangeUri = binding.range.value;

            return relation;
          });
        } else {
          return [];
        }
      })
      .catch(err => this.onError(err));
  }

  getAggregateRestrictions(): Promise<AggregateRestriction[]> {
    return this.sparqlService
      .executeSelect(DataService.TRIPLESTORE_URL, DataService.QUERY_ALL_AGR_PROPERTIES)
      .then((body: SPARQLResultsDocument) => {
        if (body.results.bindings.length > 0) {
          return body.results.bindings.map(binding => {
            const restriction = new AggregateRestriction();
            restriction.uri = binding.uri.value;
            restriction.label = binding.label.value;
            restriction.rangeUri = binding.range.value;

            return restriction;
          });
        } else {
          return [];
        }
      })
      .catch(err => this.onError(err));
  }

  //   getReport(projectId: string): Promise<Report> {
  //     return this.reportsDB
  //       .findOnlyDocs({
  //         selector: { projectId },
  //         sort: [{ generatedAt: "desc" }]
  //       })
  //       .pipe(
  //         map(docs => {
  //           const reports = this.j2tService
  //             .converter()
  //             .deserializeArray(docs, Report);

  //           return reports.length > 0 ? reports[0] : null;
  //         }),
  //         catchError(err => this._onError(err))
  //       );
  //   }

  //   getReportResults(
  //     reportId: string,
  //     pageNumber: number = 0,
  //     amountFrom?: number,
  //     amountTo?: number,
  //     dateFrom?: string,
  //     dateTo?: string,
  //     indicators?: [string]
  //   ): Promise<GeneralReportResult[]> {
  //     const selector = { reportId };

  //     if (amountFrom || amountTo) {
  //       selector["amount"] = {};
  //       if (amountFrom) {
  //         selector["amount"]["$gte"] = amountFrom;
  //       }
  //       if (amountTo) {
  //         selector["amount"]["$lte"] = amountTo;
  //       }
  //     }
  //     if (dateFrom || dateTo) {
  //       selector["date"] = {};
  //       if (dateFrom) {
  //         selector["date"]["$gte"] = dateFrom;
  //       }
  //       if (dateTo) {
  //         selector["date"]["$lte"] = dateTo;
  //       }
  //     }
  //     if (indicators) {
  //       selector["diagramId"] = {
  //         $in: indicators
  //       };
  //     }

  //     return this.reportResultsDB
  //       .findOnlyDocs({
  //         selector,
  //         sort: ["date"],
  //         limit: 10,
  //         skip: 10 * pageNumber
  //       })
  //       .pipe(
  //         map(docs =>
  //           this.j2tService
  //             .converter()
  //             .deserializeArray(docs, GeneralReportResult)
  //         ),
  //         catchError(err => this._onError(err))
  //       );
  //   }

  //   getAllReportResults(
  //     reportId: string,
  //     limit: number,
  //     indicators?: [string]
  //   ): Promise<GeneralReportResult[]> {
  //     const selector = { reportId };
  //     if (indicators) {
  //       selector["diagramId"] = {
  //         $in: indicators
  //       };
  //     }

  //     return this.reportResultsDB
  //       .findOnlyDocs({
  //         selector,
  //         sort: ["date"],
  //         limit: limit
  //       })
  //       .pipe(
  //         map(docs =>
  //           this.j2tService
  //             .converter()
  //             .deserializeArray(docs, GeneralReportResult)
  //         ),
  //         catchError(err => this._onError(err))
  //       );
  //   }

  //   getStatisticReportResults(
  //     reportId: string,
  //     indicatorId: string,
  //     pageNumber: number = 0
  //   ): Promise<StatisticReportResult[]> {
  //     const selector = {
  //       reportId: reportId,
  //       diagramId: indicatorId,
  //       statisticDiagram: true
  //     };

  //     return this.reportResultsDB
  //       .findOnlyDocs({
  //         selector,
  //         limit: 10,
  //         skip: 10 * pageNumber
  //       })
  //       .pipe(
  //         map(docs => {
  //           return docs.map(doc =>
  //             this.statisticReportResultConverter.deserialize(doc)
  //           );
  //         }),
  //         catchError(err => this._onError(err))
  //       );
  //   }

  getProjectDiagramInfos(projectId: string, types: VisualQueryType[]): Promise<DiagramInfo[]> {
    return this.diagramInfoDB
      .findOnlyDocs({
        selector: {
          projectId,
          type: { $in: types }
        }
      })
      .then(docs => {
        debugger;
        return this.j2tService.converter().deserializeArray(docs, DiagramInfo as DiagramInfoClass);
      });
  }

  //   getLibraryDiagramInfos(): Promise<DiagramInfo[]> {
  //     return this.diagramInfoDB
  //       .findOnlyDocs({
  //         selector: {
  //           libraryDiagram: true
  //         }
  //       })
  //       .pipe(
  //         map(docs =>
  //           this.j2tService.converter().deserializeArray(docs, DiagramInfo)
  //         )
  //       );
  //   }

  //   getLibraryIndicatorsDiagramInfos(): Promise<DiagramInfo[]> {
  //     return this.diagramInfoDB
  //       .findOnlyDocs({
  //         selector: {
  //           type: VisualQueryType.INDICATOR,
  //           libraryDiagram: true
  //         }
  //       })
  //       .pipe(
  //         map(docs =>
  //           this.j2tService.converter().deserializeArray(docs, DiagramInfo)
  //         )
  //       );
  //   }

  //   getLibraryClassifierDiagramInfos(): Promise<DiagramInfo[]> {
  //     return this.diagramInfoDB
  //       .findOnlyDocs({
  //         selector: {
  //           type: {
  //             $in: [
  //               VisualQueryType.VALUE_CLASSIFIER,
  //               VisualQueryType.ENTITY_CLASSIFIER,
  //               VisualQueryType.RELATION_CLASSIFIER
  //             ]
  //           },
  //           libraryDiagram: true
  //         }
  //       })
  //       .pipe(
  //         map(docs =>
  //           this.j2tService.converter().deserializeArray(docs, DiagramInfo)
  //         )
  //       );
  //   }

  //   convertResultObjectsToCsv(result: GeneralReportResult[]): string {
  //     if (result == null || !result.length) {
  //       return null;
  //     }
  //     const columnDelimiter = ";";
  //     const lineDelimiter = "\n";

  //     const keys = Object.keys(result[0]);

  //     let csvResult = "";
  //     csvResult += keys.join(columnDelimiter);
  //     csvResult += lineDelimiter;

  //     result.forEach(item => {
  //       let ctr = 0;
  //       keys.forEach(key => {
  //         if (ctr > 0) {
  //           csvResult += columnDelimiter;
  //         }
  //         csvResult += item[key];
  //         ctr++;
  //       });
  //       csvResult += lineDelimiter;
  //     });

  //     return csvResult;
  //   }

  //   private _onError(err: any): Promise<any> {
  //     let message = "It failed to execute an HTTP request. Please retry later!";

  //     if (err.message) {
  //       message += "\nDetails: " + err.message;
  //     }

  //     this.toastService.show("An HTTP Request failed!", message);

  //     console.error(err);

  //     throw err;
  //   }
}
export default new DataService();
