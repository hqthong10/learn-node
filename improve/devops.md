1. Fundamental (Cơ bản về DevOps & IT infra)

Hiểu khái niệm DevOps, vai trò, mindset.

Networking cơ bản: TCP/IP, DNS, HTTP/HTTPS, Firewall.

Kiến thức về OS, process, memory, logs.

2. Basic Linux

Các command cơ bản (ls, cd, ps, top, grep, awk, sed…).

Quản lý file, permission, user/group.

Systemd service, log (journalctl).

Bash scripting cơ bản (for, if, while…).

3. AWS Basic (Cloud Platform)

Hiểu về các dịch vụ cơ bản: EC2, S3, IAM, VPC.

Networking trong AWS: Security Group, Load Balancer.

AWS CLI.

(Nếu chưa muốn AWS thì có thể học GCP hoặc Azure cũng tương tự.)

4. K8s (Kubernetes)

Container cơ bản (Docker).

K8s architecture: Pod, Deployment, Service, Ingress.

ConfigMap, Secret, Volume.

Helm chart.

5. Gits (Git & SCM)

Git cơ bản: commit, branch, merge, rebase.

Gitflow workflow.

GitHub/GitLab.

6. CI/CD

Jenkins, GitHub Actions, GitLab CI/CD.

Pipeline: build → test → deploy.

Kết hợp với Docker/K8s.

7. Monitoring

Logging: ELK, Loki.

Metrics: Prometheus, Grafana.

Alerting.

8. IaC (Infrastructure as Code)

Terraform cơ bản: provider, resource, state.

Ansible: config management.

Kết hợp IaC để deploy lên AWS/K8s.

9. Mock Project

Tạo project demo:

Deploy app (web/nodejs) lên K8s trên AWS.

Pipeline CI/CD tự động build + push Docker image + deploy.

Monitoring bằng Prometheus/Grafana.

IaC để dựng hạ tầng.