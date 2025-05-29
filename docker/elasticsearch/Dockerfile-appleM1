FROM docker.elastic.co/elasticsearch/elasticsearch:8.14.3

COPY es-init.sh /usr/share/elasticsearch/config/init/elasticsearch-init.sh

CMD [ "/bin/bash", "-c", "/usr/share/elasticsearch/config/init/elasticsearch-init.sh & exec /usr/local/bin/docker-entrypoint.sh elasticsearch" ]