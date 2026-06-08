#!/usr/bin/env python3
import pika
import sys
import time

from apbd import sync_apbd

QUEUE_NAME = "apbd"   

def main():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost')
    )
    channel = connection.channel()

    channel.queue_declare(queue=QUEUE_NAME, passive=True)
    print(f"[✓] Waiting for messages in '{QUEUE_NAME}'. Press CTRL+C to exit.")

    def callback(ch, method, properties, body):
        print(f"[x] Received: {body.decode()}")
        #time.sleep(1)  # simulasi proses
        sync_apbd()
        ch.basic_ack(delivery_tag=method.delivery_tag)
        print("[✓] Done")

    channel.basic_qos(prefetch_count=1)   # fair dispatch
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("\n[!] Stopping consumer...")
        channel.stop_consuming()
        connection.close()

if __name__ == "__main__":
    main()
