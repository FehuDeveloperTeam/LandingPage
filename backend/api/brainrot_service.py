import requests
from bs4 import BeautifulSoup
import random
from deep_translator import GoogleTranslator

class BrainrotService:
    @staticmethod
    def translate_text(text):
        try:
            # Traduce de italiano (it) a español (es)
            return GoogleTranslator(source='it', target='es').translate(text)
        except Exception as e:
            print(f"Error traduciendo: {e}")
            return text

    @staticmethod
    def get_latest_lore():
        base_url = "https://italianbrainrot.miraheze.org"
        url = f"{base_url}/wiki/Categoria:Personaggi"
        headers = {'User-Agent': 'FehuBot/1.0 (https://fehudevelopers.cl)'}
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            items = []
            category_section = soup.find('div', {'class': 'mw-category'})
            if not category_section:
                return BrainrotService.get_backup_lore()

            # Limitamos a 8 para que la traducción no ralentice demasiado la carga inicial
            links = category_section.find_all('a')[:8] 

            for link in links:
                original_name = link.text
                char_url = base_url + link['href']
                
                try:
                    char_res = requests.get(char_url, headers=headers, timeout=5)
                    char_soup = BeautifulSoup(char_res.text, 'html.parser')
                    
                    # 1. Obtener Imagen
                    img_tag = char_soup.find('table', {'class': 'infobox'})
                    if img_tag:
                        img_tag = img_tag.find('img')
                    else:
                        img_tag = char_soup.find('div', {'class': 'mw-parser-output'}).find('img')
                    
                    img_url = img_tag['src'] if img_tag and img_tag.has_attr('src') else ""
                    if img_url.startswith('/'):
                        img_url = base_url + img_url

                    # 2. Obtener Descripción y Traducir
                    paragraphs = char_soup.find_all('p')
                    raw_description = paragraphs[1].text if len(paragraphs) > 1 else "Información no disponible."
                    
                    # TRADUCCIÓN
                    name_es = BrainrotService.translate_text(original_name)
                    desc_es = BrainrotService.translate_text(raw_description[:200]) # Traducimos solo el inicio

                except Exception as e:
                    name_es = original_name
                    desc_es = "Error al recuperar datos del Lore."
                    img_url = "https://fehudevelopers.cl/placeholder.jpg"

                # Stats consistentes
                seed = sum(ord(c) for c in original_name)
                random.seed(seed)
                
                items.append({
                    "id": original_name.lower().replace(" ", "-"),
                    "name": name_es,
                    "description": desc_es,
                    "lore": f"Fuente original: {char_url}",
                    "image": img_url,
                    "aura": random.randint(2000, 9999),
                    "rizz": random.randint(10, 100),
                    "status": random.choice(["SIGMA", "ALPHA", "BASADO", "QUEMADO"]),
                    "link": char_url
                })
            
            return items
        except Exception as e:
            print(f"Error general en Scraper: {e}")
            return BrainrotService.get_backup_lore()

    @staticmethod
    def get_backup_lore():
        return [{
            "id": "sardina-liquida",
            "name": "Sardina Líquida",
            "description": "La entidad suprema del multiverso italiano.",
            "lore": "Pilar fundamental del Lore.",
            "image": "https://p16-va.lemon8cdn.com/tos-alisg-v-a3e477-sg/o0fIAfD7CIlAnAtX6BfAAdBBAeEAgmBAf8NAu0~tplv-tej9nj120t-origin.webp",
            "aura": 9999,
            "rizz": 100,
            "status": "SIGMA",
            "link": "https://italianbrainrot.miraheze.org/wiki/Sardina_Liquida"
        }]