import feedparser
import re
import random

class BrainrotService:
    @staticmethod
    def get_latest_lore():
        # URL de tendencias de Know Your Meme
        url = "https://knowyourmeme.com/memes.rss"
        feed = feedparser.parse(url)
        
        lore_list = []
        
        for entry in feed.entries[:15]:  # Tomamos los últimos 15
            # Extraer la imagen principal usando regex del contenido HTML
            img_match = re.search(r'<img src="([^"]+)"', entry.description)
            image_url = img_match.group(1) if img_match else "https://via.placeholder.com/600x400?text=No+Lore+Image"

            # Limpiar el HTML de la descripción para que quede texto plano
            clean_description = re.sub('<[^<]+?>', '', entry.description)
            # Cortamos a 150 caracteres para el preview
            clean_description = (clean_description[:150] + '...') if len(clean_description) > 150 else clean_description

            lore_list.append({
                "id": entry.id,
                "name": entry.title.replace("Meme: ", ""),
                "description": clean_description,
                "image": image_url,
                "link": entry.link,
                # Generamos stats lúdicos aleatorios (Aura y Rizz)
                "aura": random.randint(-5000, 9999),
                "rizz": random.randint(0, 100),
                "status": random.choice(["SIGMA", "SKIBIDI", "COOKED", "OHIO", "ALPHA"]),
                "published": entry.published
            })
            
        return lore_list