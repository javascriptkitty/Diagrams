FROM java:9

ADD build/libs/pwc-analytics-all-0.0.1-SNAPSHOT.jar pwc-analytics.jar
ADD src/main/resources/log4j.properties log4j.properties

EXPOSE 9998
EXPOSE 3030
EXPOSE 8585

CMD java -Xdebug -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8585 -Dlog4j.configuration=file:log4j.properties -jar pwc-analytics.jar
