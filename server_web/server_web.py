import socket
import os # pentru dimensiunea fisierului
import threading
import gzip
from xmlrpc.client import gzip_encode
import json

def handler(clientsocket):

	while True:
		print ('#########################################################################')
		print ('Serverul asculta potentiali clienti.')
		print ('S-a conectat un client.')
		# se proceseaza cererea si se citeste prima linie de text
		cerere = ''
		linieDeStart = ''
		while True:
			buf = clientsocket.recv(1024)
			if len(buf) < 1:
				break
			cerere = cerere + buf.decode()
			print ('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
			pozitie = cerere.find('\r\n')
			if (pozitie > -1 and linieDeStart == ''):
				linieDeStart = cerere[0:pozitie]
				print ('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
				break
		print ('S-a terminat cititrea.')
		if linieDeStart == '':
			clientsocket.close()
			print ('S-a terminat comunicarea cu clientul - nu s-a primit niciun mesaj.')
			continue
		# interpretarea sirului de caractere `linieDeStart`
		elem = linieDeStart.split(' ')

		if elem[0] == "POST" and elem[1] == "/api/utilizatori":
			startIndex = cerere.find('{')
			stopIndex = cerere.find('}')+1
			word =""
			for i in range(startIndex,stopIndex):
				word+=cerere[i]
			print(word)

			payload = json.loads(word)
			f = open("../continut/resurse/utilizatori.json", 'r')
			input = f.read()
			f.close()

			print(input)
			input = input.replace("]", ",")
			print(input)
			input = input + word + "]"
			print(input)

			f = open("../continut/resurse/utilizatori.json", 'w')

			f.write(input)

			clientsocket.sendall('HTTP/1.1 200 OK\r\n'.encode("UTF-8"))

		elementeLineDeStart = linieDeStart.split()
		numeResursaCeruta = elementeLineDeStart[1]
		if numeResursaCeruta == '/':
			numeResursaCeruta = '/index.html'
		
		# calea este relativa la directorul de unde a fost executat scriptul
		numeFisier = '../continut' + numeResursaCeruta
		
		fisier = None
		try:
			# deschide fisierul pentru citire in mod binar
			fisier = open(numeFisier,'rb')

			# tip media
			numeExtensie = numeFisier[numeFisier.rfind('.')+1:]
			tipuriMedia = {
				'html': 'text/html; charset=utf-8',
				'css': 'text/css; charset=utf-',
				'js': 'text/javascript; charset=utf-8',
				'svg': 'image/svg+xml',
				'png': 'image/png',
				'jpg': 'image/jpeg',
				'jpeg': 'image/jpeg',
				'gif': 'image/gif',
				'ico': 'image/x-icon',
				'xml': 'application/xml; charset=utf-8',
				'json': 'application/json; charset=utf-8'
			}
			tipMedia = tipuriMedia.get(numeExtensie,'text/plain; charset=utf-8')
			
			buf = fisier.read(1024)
			all = buf
			while (buf):
				buf = fisier.read(1024)
				all += buf
			compressed = gzip.compress(all)
			
			# se trimite raspunsul
			clientsocket.sendall('HTTP/1.1 200 OK\r\n'.encode('utf8'))
			#clientsocket.sendall(('Content-Length: ' + str(os.stat(numeFisier).st_size) + '\r\n').encode('utf8'))
			clientsocket.sendall(('Content-Length: ' + str(len(compressed))+ '\r\n').encode('utf8'))
			clientsocket.sendall(('Content-Type: ' + tipMedia +'\r\n').encode('utf8'))
			clientsocket.sendall(('Content-Encoding: gzip' +  '\r\n').encode('utf8'))
			clientsocket.sendall('Server: My PW Server\r\n'.encode('utf8'))
			clientsocket.sendall('\r\n'.encode('utf8'))
			clientsocket.send(compressed)
			
			#a = continut fisier
			#c = zlib.compress(a.encode())
			#la content legth -- c.size()
			# citeste din fisier si trimite la server
			
		except IOError:
			# daca fisierul nu exista trebuie trimis un mesaj de 404 Not Found
			msg = 'Eroare! Resursa ceruta ' + numeResursaCeruta + ' nu a putut fi gasita!'
			print (msg)
			clientsocket.sendall('HTTP/1.1 404 Not Found\r\n')
			clientsocket.sendall('Content-Length: ' + str(len(msg.encode('utf-8'))) + '\r\n')
			clientsocket.sendall('Content-Type: text/plain; charset=utf-8\r\n')
			clientsocket.sendall('Server: My PW Server\r\n')
			clientsocket.sendall('\r\n')
			clientsocket.sendall(msg)

		finally:
			if fisier is not None:
				fisier.close()
		clientsocket.close()
		print ('S-a terminat comunicarea cu clientul.')

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as listening_sock:
    print('#########################################################################')
    print('Serverul asculta potentiali clienti.')
    listening_sock.bind(('', 5678))
    listening_sock.listen()
    while True:
        client_soc, client_address = listening_sock.accept()
        # Send each "client_soc" connection as a parameter to a thread.
        threading.Thread(target=handler,args=(client_soc,), daemon=True).start()

