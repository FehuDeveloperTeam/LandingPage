import requests
from bs4 import BeautifulSoup
import random
from deep_translator import GoogleTranslator
from urllib.parse import urljoin

class BrainrotService:
    @staticmethod
    def translate_text(text):
        if not text or len(text) < 2: return text
        try:
            # Traduce de Coreano/Inglés/Italiano a Español
            return GoogleTranslator(source='auto', target='es').translate(text)
        except:
            return text

    @staticmethod
    def get_latest_lore():
        url = "https://en.namu.wiki/w/Italian%20Brainrot/%EB%93%B1%EC%9E%A5%20%EC%BA%90%EB%A6%AD%ED%84%B0"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }
        
        try:
            response = requests.get(url, headers=headers, timeout=15)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            items = []
            
            # En NamuWiki los personajes suelen estar en tablas o secciones con títulos h2/h3
            # Buscamos las filas de las tablas que contienen la info de personajes
            tables = soup.find_all('table')
            
            for table in tables:
                rows = table.find_all('tr')
                for row in rows:
                    cols = row.find_all('td')
                    # Buscamos filas que tengan imagen y texto (típico de NamuWiki)
                    if len(cols) >= 2:
                        img_tag = row.find('img')
                        name_tag = row.find('strong') or row.find('b')
                        
                        if name_tag and len(name_tag.text) > 2:
                            raw_name = name_tag.text.strip()
                            raw_desc = row.get_text(separator=" ").replace(raw_name, "").strip()
                            
                            # Extraer URL de imagen (NamuWiki usa lazy loading a veces)
                            img_url = ""
                            if img_tag:
                                img_url = img_tag.get('data-src') or img_tag.get('src') or ""
                                if img_url.startswith('//'): img_url = "https:" + img_url
                                elif img_url.startswith('/'): img_url = urljoin(url, img_url)

                            # Evitar duplicados y basura
                            if any(item['name'] == raw_name for item in items): continue
                            
                            # TRADUCCIÓN
                            name_es = BrainrotService.translate_text(raw_name)
                            # Traducimos solo los primeros 150 caracteres para velocidad
                            desc_es = BrainrotService.translate_text(raw_desc[:150])

                            items.append({
                                "id": f"namu-{len(items)}",
                                "name": name_es,
                                "description": desc_es,
                                "lore": f"Original: {raw_name}",
                                "image": img_url if "http" in img_url else "https://fehudevelopers.cl/placeholder.jpg",
                                "aura": random.randint(4000, 9999),
                                "rizz": random.randint(30, 100),
                                "status": random.choice(["SIGMA", "ALPHA", "BASADO", "GOATED"]),
                                "link": url
                            })
                
                if len(items) >= 12: break # Suficiente contenido

            return items if items else BrainrotService.get_backup_lore()

        except Exception as e:
            print(f"Error Scrapeando Namu: {e}")
            return BrainrotService.get_backup_lore()

    @staticmethod
    def get_backup_lore():
        return [{
            "id": "sardina-es",
            "name": "Sardina Líquida",
            "description": "La entidad suprema que lo inició todo.",
            "lore": "Pilar del Lore.",
            "image": "https://p16-va.lemon8cdn.com/tos-alisg-v-a3e477-sg/o0fIAfD7CIlAnAtX6BfAAdBBAeEAgmBAf8NAu0~tplv-tej9nj120t-origin.webp",
            "aura": 9999,
            "rizz": 100,
            "status": "SIGMA",
            "link": "#"
        }]