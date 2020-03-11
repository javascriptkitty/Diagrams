FROM java:9

#ADD build/libs/SparqlGenerate-all-0.0.1-SNAPSHOT.jar SparqlGenerate.jar
ADD backend/sparql-generate/build/libs/SparqlGenerate-all-0.0.1-SNAPSHOT.jar SparqlGenerate.jar
EXPOSE 19998
CMD java -jar SparqlGenerate.jar
