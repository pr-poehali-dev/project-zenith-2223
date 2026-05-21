import os
import json
import boto3
import requests

def handler(event: dict, context) -> dict:
    """
    Скачивает фотографии с публичной папки Яндекс.Диска и загружает их в S3.
    Возвращает список CDN-ссылок на загруженные фото.
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    YANDEX_PUBLIC_KEY = 'https://disk.yandex.ru/d/bPtSeWYLgEewEA'
    LIMIT = 30

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

    project_id = os.environ['AWS_ACCESS_KEY_ID']
    cdn_base = f"https://cdn.poehali.dev/projects/{project_id}/bucket"

    # Проверяем, не загружены ли уже фото
    existing = s3.list_objects_v2(Bucket='files', Prefix='gallery/')
    existing_keys = [obj['Key'] for obj in existing.get('Contents', [])]
    image_keys = [k for k in existing_keys if k.lower().endswith(('.jpg', '.jpeg', '.png'))]
    if len(image_keys) >= 12:
        urls = [f"{cdn_base}/{key}" for key in image_keys]
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'urls': urls[:30], 'cached': True})
        }

    # Получаем список файлов с Яндекс.Диска
    api_url = 'https://cloud-api.yandex.net/v1/disk/public/resources'
    params = {
        'public_key': YANDEX_PUBLIC_KEY,
        'limit': LIMIT,
        'offset': 0
    }
    resp = requests.get(api_url, params=params, timeout=15)
    data = resp.json()

    items = data.get('_embedded', {}).get('items', [])
    image_items = [i for i in items if i.get('media_type') == 'image'][:20]

    uploaded_urls = []

    for item in image_items:
        filename = item['name']
        sizes = item.get('sizes', [])
        # Берём M размер (средний) для галереи
        url = None
        for size in sizes:
            if size.get('name') == 'M':
                url = size['url']
                break
        if not url and sizes:
            url = sizes[0]['url']
        if not url:
            continue

        try:
            img_resp = requests.get(url, timeout=20)
            if img_resp.status_code != 200:
                continue

            s3_key = f"gallery/{filename}"
            content_type = item.get('mime_type', 'image/jpeg')

            s3.put_object(
                Bucket='files',
                Key=s3_key,
                Body=img_resp.content,
                ContentType=content_type
            )
            cdn_url = f"{cdn_base}/{s3_key}"
            uploaded_urls.append(cdn_url)
        except Exception:
            continue

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'urls': uploaded_urls, 'cached': False})
    }