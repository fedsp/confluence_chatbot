import requests
import json
from time import sleep
from bs4 import BeautifulSoup
import base64
import os
import re

username = os.environ['CONF_USER']
password = os.environ['CONF_PASSWORD']
base_url = 'https://confluence.jnj.com'
headers = {
    "Authorization": "Basic " + base64.b64encode((username + ":" + password).encode()).decode()
}


def get_confluence_raw_page_content(confluence_space_key):
    url_suffix = f"/rest/api/content"
    params = {
        "type": "page",
        "spaceKey": confluence_space_key,
        "expand": "body.storage",
        "limit": 100,
        "status": "current"
    }
    all_pages = []

    while url_suffix:
        response = requests.get(base_url+url_suffix, params=params, headers=headers)
        data = response.json()
        if "results" in data:
            pure_html_items = []
            for item in data["results"]:
                if item["body"]["storage"]["value"] != "":
                    item_title = item["title"]
                    item_content = item["body"]["storage"]["value"]
                    soup = BeautifulSoup(item_content, 'lxml')
                    safe_filename = item_title.replace('/','_').replace(' ','_').replace('-','_')
                    safe_filename = re.sub(r'[^a-zA-Z0-9_]', '', safe_filename)
                    with open(f'./pages/{confluence_space_key}/{safe_filename}.txt','w',encoding='utf-8') as f:
                        f.write(f'{item_title}\\n\\n{soup.text}')
            all_pages.extend(pure_html_items)
        if "next" in data["_links"]:
            url_suffix = data["_links"]["next"]
        else:
            url_suffix = None
        sleep(1)
    return all_pages


confluence_space_key = 'AAPR'
confluence_raw_page_content = get_confluence_raw_page_content(confluence_space_key)