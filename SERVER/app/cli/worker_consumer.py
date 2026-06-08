# worker_consumer.py
import asyncio
import json
import logging
import signal
from typing import Optional

import aio_pika

from apbd_worker import APBDProcessor, init_pool, close_pool

log = logging.getLogger("worker_consumer")
logging.basicConfig(level=logging.INFO)

RABBIT_URL = "amqp://guest:guest@localhost/"
QUEUE_NAME = "rkpd_task"
CONCURRENCY = 4  # jumlah paralel worker

stop_event = asyncio.Event()

async def handle_message(message: aio_pika.IncomingMessage, processor: APBDProcessor):
    async with message.process(requeue=False):
        try:
            payload = json.loads(message.body.decode())
        except Exception as e:
            log.exception("Invalid message body, rejecting: %s", e)
            # reject bad message without requeue
            await message.reject(requeue=False)
            return

        try:
            await processor.process_task(payload)
            # message.process(...) auto-acks on normal exit
        except Exception as e:
            log.exception("Processing failed, will nack and requeue: %s", e)
            # explicitly requeue to try later
            await message.nack(requeue=True)

async def main():
    # init DB pool
    await init_pool()
    processor = APBDProcessor(concurrency=CONCURRENCY, headless=True)
    await processor.start_browser()

    connection = await aio_pika.connect_robust(RABBIT_URL)
    channel = await connection.channel()
    await channel.set_qos(prefetch_count=CONCURRENCY)

    queue = await channel.declare_queue(QUEUE_NAME, durable=True)

    # consume
    consumer_tag = await queue.consume(lambda msg: asyncio.create_task(handle_message(msg, processor)))
    log.info("Consumer started, waiting messages...")

    # graceful shutdown on signals
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, stop_event.set)

    await stop_event.wait()
    log.info("Stopping consumer...")

    # cleanup
    await queue.cancel(consumer_tag)
    await processor.stop_browser()
    await close_pool()
    await connection.close()

if __name__ == "__main__":
    asyncio.run(main())
