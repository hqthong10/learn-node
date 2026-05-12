👉 dependencies:
- express
- mongoose
- pino
- pino-http
- pino-pretty
- prom-client
- uuid

👉 prometheus
docker run -d \
    -p 9090:9090 \
    -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
    prom/prometheus

👉 grafana
docker run -d \
    -p 3001:3000 \
    grafana/grafana

Grafana queries
- Query CPU: càng cao → CPU càng bận
    rate(process_cpu_user_seconds_total[1m])

- Query Memory: RAM đang dùng
    process_resident_memory_bytes



👉 Debug performance luôn theo thứ tự:
1. Grafana → API nào chậm
2. Log → request nào chậm
3. DB log → query có chậm không


👉 Production:
dùng APM (NewRelic, Datadog)
hoặc OpenTelemetry

