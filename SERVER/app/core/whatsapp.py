import pycurl
from io import BytesIO


import re
import requests
import datetime
#import pika
from uuid_extensions import uuid7, uuid7str
import json


def format_wa_number(nophone):
    nophone = re.sub(r"(\n)", ",", nophone)
    nophone = re.sub(r"(\r)", "", nophone)
    
    str_ln = len(nophone)
    fn = nophone[0]
    wa_numb = ''
    
    if fn == '0':
        rightstr = nophone[1:str_ln]
        wa_numb = '62' + rightstr
    elif fn == '6':
        wa_numb = nophone
    elif fn == '+':
        rightstr = nophone[3:str_ln]
        wa_numb = '62' + rightstr
    return wa_numb

def sendto_rabbitmq(params):
    wa_numb = format_wa_number(params['nophone'])
    wa_message = params['message']
    wa_message = re.sub(r"[<>]", "", wa_message)
    idmsg = uuid7str()
    message = {
        "wa_id": idmsg,
        "wa_message": wa_message,
        "wa_number": wa_numb
    }

    token = "fuDZ6CV7aRGuFm76yJLh0ZoR0hQmIDWTgCTl8iZfyTE8cdvAmPEOPtW"
    secret_key = "se9PXQog"
    data = {
        'phone': wa_numb,
        'message': wa_message
    }

    headers = {
        "Authorization": f"{token}.{secret_key}",
    }

    url = "https://jogja.wablas.com/api/send-message"

    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        result = response.text
        #print(result)
        return True
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

    '''
    try:
        connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost'))
        channel = connection.channel()

        channel.queue_declare(queue='sendwa')

        channel.basic_publish(exchange='', routing_key='sendwa', body=json.dumps(message)) 

        data = {
            'tgl': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'phone': wa_numb,
            'status': True,
            'msg': message,
            'id_opd': params['users'],
            'user': params['users'][3]
        }
        
        log_wa_to_database(data)
        return True
    
    except Exception as e:
            print(e)
            return False
    '''

def kirim_wa(params):
    # Extract and sanitize inputs
    wa_numb = format_wa_number(params['nophone'])
    message = params['message']
    
    message = re.sub(r"[<>]", "", message)
    
    post_request = {
        "message": message
    }
    
    # Define headers
    headers = {
        'Host': 'e-laba.tegalkota.go.id',
        'Content-Type': 'application/json'
    }
    
    # Define the URL
    url = f"http://localhost:5000/chat/sendmessage/{wa_numb}"
    
    # Send POST request
    try:
        response = requests.post(url, json=post_request, headers=headers, verify=False)
        result = response.text
    except requests.RequestException as e:
        result = str(e)
    
    # Log data (example, adjust based on your database setup)
    data = {
        'tgl': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'phone': wa_numb,
        'status': result,
        'msg': message,
        'id_opd': params['users'],
        'user': params['users'][3]
    }
    
    log_wa_to_database(data)
    
    return result

def log_wa_to_database(data):
    # Implement database logging here
    # For example, if you're using SQLite:
    print("Log data:", data)