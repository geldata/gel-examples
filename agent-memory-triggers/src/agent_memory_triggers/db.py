import gel

gel_client = gel.create_async_client()

async def get_gel():
    try:
        yield gel_client
    finally:
        pass
