from flask import Flask, render_template, request, jsonify
import smtplib
import imaplib
import ssl

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test-smtp', methods=['POST'])
def test_smtp():
    data = request.json
    host = data.get('host')
    port = int(data.get('port', 587))
    user = data.get('user')
    password = data.get('password')
    security = data.get('security', 'STARTTLS') # NONE, STARTTLS, SSL

    try:
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        if security == 'SSL':
            server = smtplib.SMTP_SSL(host, port, timeout=10, context=context)
        else:
            server = smtplib.SMTP(host, port, timeout=10)
        
        server.set_debuglevel(False)
        
        if security == 'STARTTLS':
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            
        if user and password:
            server.login(user, password)
            
        server.quit()
        return jsonify({'status': 'success', 'message': f'Conexão SMTP estabelecida com sucesso! ({security} na porta {port})'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Erro SMTP: {str(e)}'})

@app.route('/test-imap', methods=['POST'])
def test_imap():
    data = request.json
    host = data.get('host')
    port = int(data.get('port', 993))
    user = data.get('user')
    password = data.get('password')
    security = data.get('security', 'SSL') # NONE, STARTTLS, SSL
    
    try:
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        if security == 'SSL':
            mail = imaplib.IMAP4_SSL(host, port, ssl_context=context)
        else:
            mail = imaplib.IMAP4(host, port)
            
        if security == 'STARTTLS':
            try:
                mail.starttls(ssl_context=context)
            except AttributeError:
                pass 
                
        if user and password:
            mail.login(user, password)
            
        mail.logout()
        return jsonify({'status': 'success', 'message': f'Conexão IMAP estabelecida com sucesso! ({security} na porta {port})'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Erro IMAP: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
