# MailTest - Testador de Conexões de E-mail

Aplicação web para diagnosticar e testar conexões com servidores **SMTP** e **IMAP**. Design premium em Glassmorphism com TailwindCSS.

## Stack

- **Backend:** Python 3.8+ + Flask
- **Frontend:** HTML5, Vanilla JS, TailwindCSS (CDN), FontAwesome

## Como Rodar

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Acesse: http://127.0.0.1:5000

## Protocolos Suportados

| Protocolo | Porta Padrão | Segurança |
|-----------|-------------|----------|
| SMTP | 587 | STARTTLS |
| SMTP | 465 | SSL/TLS |
| IMAP | 993 | SSL/TLS |
| IMAP | 143 | STARTTLS / Nenhum |

## Deploy (Hospedagem Python/Passenger)

Crie `passenger_wsgi.py` na raiz do `www/`:

```python
import sys, os
INTERP = "/srv/seudominio.com/bin/python"
if sys.executable != INTERP: os.execl(INTERP, INTERP, *sys.argv)
sys.path.append(os.getcwd())
from app import app as application
```
